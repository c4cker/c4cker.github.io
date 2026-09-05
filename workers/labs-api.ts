type Env = {
  FLAGS_JSON: string;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RATE_LIMITER?: DurableObjectNamespace;
};
import { challenges as challengeCatalog } from "../apps/labs/src/data/challenges.published";

const allowedOrigins = new Set(["https://c4cker.com", "https://www.c4cker.com", "https://labs.c4cker.com", "https://c4cker.github.io", "http://localhost:4322", "http://labs.localhost:4322"]);
const challenges = Object.fromEntries(challengeCatalog.map((item) => [item.slug, { mode: item.flagMode, stages: item.stages.map((stage) => stage.id) }]));
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    // Las peticiones internas del prerender de Astro no incluyen Origin; CORS
    // solo debe bloquear orígenes explícitos que no estén permitidos.
    if (request.method === "OPTIONS") return !origin || allowedOrigins.has(origin) ? response(null, 204, origin) : response({ ok: false, error: "origin_not_allowed" }, 403, origin);
    if (request.method !== "GET" && origin && !allowedOrigins.has(origin)) return response({ ok: false, error: "origin_not_allowed" }, 403, origin);
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" && pathname === "/health") {
      const configured = Boolean(env.FLAGS_JSON && env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY && env.SUPABASE_SERVICE_ROLE_KEY && env.RATE_LIMITER);
      return response({ ok: configured, service: "labs-api" }, configured ? 200 : 503, origin, "no-store");
    }
    if (request.method === "GET" && pathname === "/ranking") {
      const result = await supabase(env, "rpc/get_ranking", "POST", { limit_count: 100 });
      if (!result.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const rows = await result.json() as Array<{ nickname: string; points: number }>;
      if (!Array.isArray(rows) || rows.some((row) => typeof row.nickname !== "string" || typeof row.points !== "number")) return response({ ok: false, error: "db_error" }, 500, origin);
      return response({ ok: true, ranking: rows }, 200, origin, "public, max-age=30");
    }
    if ((pathname === "/profile" || pathname === "/submit-flag") && !env.RATE_LIMITER) return response({ ok: false, error: "server_config" }, 503, origin);
    if ((request.method === "GET" || request.method === "PATCH") && pathname === "/profile") {
      const user = await authenticate(request, env);
      if (!user) return response({ ok: false, error: "auth_required" }, 401, origin);
      if (!(await allowAttempt([user.id], env))) return response({ ok: false, error: "rate_limited" }, 429, origin);
      if (request.method === "GET") {
        const result = await supabase(env, `profiles?id=eq.${encodeURIComponent(user.id)}&select=public_nickname&limit=1`);
        if (!result.ok) return response({ ok: false, error: "db_error" }, 500, origin);
        const profiles = await result.json() as Array<{ public_nickname: string }>;
        return response({ ok: true, profile: profiles[0] ?? null }, 200, origin, "no-store");
      }
      const contentType = request.headers.get("Content-Type") ?? "";
      if (!contentType.toLowerCase().startsWith("application/json")) return response({ ok: false, error: "unsupported_media_type" }, 415, origin);
      const parsed = await readJsonBody<{ publicNickname?: string }>(request, 2048);
      if (!parsed.ok) return response({ ok: false, error: parsed.error }, parsed.error === "payload_too_large" ? 413 : 400, origin);
      const body = parsed.value;
      const nickname = normalizeNickname(body.publicNickname);
      if (!nickname) return response({ ok: false, error: "bad_nickname" }, 400, origin);
      const updated = await supabase(env, "profiles", "POST", { id: user.id, public_nickname: nickname, updated_at: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal");
      if (!updated.ok) return response({ ok: false, error: updated.status === 409 ? "nickname_taken" : "db_error" }, updated.status === 409 ? 409 : 500, origin);
      return response({ ok: true, profile: { public_nickname: nickname } }, 200, origin);
    }
    if (request.method !== "POST" || pathname !== "/submit-flag") return response({ ok: false, error: "not_found" }, 404, origin);
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    // La validación previa a la autenticación permite distinguir una flag correcta
    // sin crear ni modificar datos de usuarios no autenticados.
    if (!(await allowAttempt([ip], env))) return response({ ok: false, error: "rate_limited" }, 429, origin);
    const contentType = request.headers.get("Content-Type") ?? "";
    if (!contentType.toLowerCase().startsWith("application/json")) return response({ ok: false, error: "unsupported_media_type" }, 415, origin);
    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 8192) return response({ ok: false, error: "payload_too_large" }, 413, origin);

    const parsed = await readJsonBody<{ slug?: string; stage?: string; flag?: string; nickname?: string }>(request, 8192);
    if (!parsed.ok) return response({ ok: false, error: parsed.error }, parsed.error === "payload_too_large" ? 413 : 400, origin);
    const body = parsed.value;
    const { slug, stage, flag } = body;
    if (!slug || !flag) return response({ ok: false, error: "bad_request" }, 400, origin);
    if (typeof flag !== "string" || flag.trim().length > 512) return response({ ok: false, error: "bad_request" }, 400, origin);
    if (!FLAG_PATTERN.test(flag.trim())) return response({ ok: false, error: "bad_flag_format" }, 400, origin);
    const challenge = challenges[slug];
    if (!challenge) return response({ ok: false, error: "unknown_challenge" }, 404, origin);
    if (challenge.mode === "single" && stage) return response({ ok: false, error: "bad_stage" }, 400, origin);
    if (challenge.mode !== "single" && (!stage || !challenge.stages.includes(stage))) return response({ ok: false, error: "bad_stage" }, 400, origin);

    let flags: Record<string, string | Record<string, string>>;
    try { flags = JSON.parse(env.FLAGS_JSON || "{}"); } catch { return response({ ok: false, error: "server_config" }, 500, origin); }
    const configured = flags[slug];
    const expected = typeof configured === "string" ? configured : configured?.[stage ?? ""];
    if (!expected || expected !== flag.trim()) return response({ ok: false, error: "wrong_flag" }, 200, origin);

    const user = await authenticate(request, env);
    if (!user) return response({ ok: false, error: "auth_required" }, 401, origin);
    if (body.nickname !== undefined && !normalizeNickname(body.nickname)) return response({ ok: false, error: "bad_nickname" }, 400, origin);

    const profileResult = await supabase(env, `profiles?id=eq.${encodeURIComponent(user.id)}&select=public_nickname&limit=1`);
    if (!profileResult.ok) return response({ ok: false, error: "db_error" }, 500, origin);
    const profiles = await profileResult.json() as Array<{ public_nickname: string }>;
    let nickname = profiles[0]?.public_nickname ?? null;
    if (!nickname && body.nickname) {
      nickname = normalizeNickname(body.nickname);
      if (nickname) {
        const created = await supabase(env, "profiles", "POST", { id: user.id, public_nickname: nickname });
        if (!created.ok) return response({ ok: false, error: created.status === 409 ? "nickname_taken" : "db_error" }, created.status === 409 ? 409 : 500, origin);
      }
    }
    if (!nickname) return response({ ok: false, error: "needs_nickname" }, 200, origin);

    if (challenge.mode === "staged") {
      const progress = await supabase(env, `challenge_stage_solves?challenge_slug=eq.${encodeURIComponent(slug)}&user_id=eq.${encodeURIComponent(user.id)}&select=stage_id`);
      if (!progress.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const solved = new Set((await progress.json() as Array<{ stage_id: string }>).map((row) => row.stage_id));
      const index = challenge.stages.indexOf(stage!);
      if (challenge.stages.slice(0, index).some((id) => !solved.has(id))) return response({ ok: false, error: "stage_locked" }, 200, origin);
    }

    if (challenge.mode !== "single") {
      const key = `challenge_slug=eq.${encodeURIComponent(slug)}&stage_id=eq.${encodeURIComponent(stage!)}&user_id=eq.${encodeURIComponent(user.id)}`;
      const prior = await supabase(env, `challenge_stage_solves?${key}&select=id&limit=1`);
      if (!prior.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      if ((await prior.json() as unknown[]).length) return response({ ok: true, already: true, completed: false, ranked: false }, 200, origin);
      const inserted = await supabase(env, "challenge_stage_solves", "POST", { challenge_slug: slug, stage_id: stage, user_id: user.id });
      if (!inserted.ok && inserted.status !== 409) return response({ ok: false, error: "db_error" }, 500, origin);
      const all = await supabase(env, `challenge_stage_solves?challenge_slug=eq.${encodeURIComponent(slug)}&user_id=eq.${encodeURIComponent(user.id)}&select=stage_id`);
      if (!all.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const solved = new Set((await all.json() as Array<{ stage_id: string }>).map((row) => row.stage_id));
      if (!challenge.stages.every((id) => solved.has(id))) return response({ ok: true, completed: false, ranked: false }, 200, origin);
    }

    const priorSolve = await supabase(env, `challenge_solves?challenge_slug=eq.${encodeURIComponent(slug)}&user_id=eq.${encodeURIComponent(user.id)}&select=id&limit=1`);
    if (!priorSolve.ok) return response({ ok: false, error: "db_error" }, 500, origin);
    if ((await priorSolve.json() as unknown[]).length) return response({ ok: true, already: true, completed: true, ranked: false }, 200, origin);
    const inserted = await supabase(env, "challenge_solves", "POST", { challenge_slug: slug, user_id: user.id });
    if (!inserted.ok) return inserted.status === 409 ? response({ ok: true, already: true, completed: true, ranked: false }, 200, origin) : response({ ok: false, error: "db_error" }, 500, origin);
    return response({ ok: true, completed: true, ranked: true }, 200, origin);
  }
};

function normalizeNickname(value?: string) {
  const nickname = value?.normalize("NFKC").trim().replace(/\s+/g, " ");
  return nickname && nickname.length <= 32 && /^[A-Za-z0-9_ .-]+$/.test(nickname) ? nickname : null;
}

async function allowAttempt(keys: string[], env: Env) {
  if (!env.RATE_LIMITER) return false;
  for (const key of keys) {
    const id = env.RATE_LIMITER.idFromName(key);
    const result = await env.RATE_LIMITER.get(id).fetch("https://rate-limit/allow");
    if (!result.ok) return false;
  }
  return true;
}

const FLAG_PATTERN = /^C4CKER\{[A-Za-z0-9]{32,64}\}$/;

async function readJsonBody<T>(request: Request, maxBytes: number): Promise<{ ok: true; value: T } | { ok: false; error: "payload_too_large" | "bad_request" }> {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, error: "bad_request" };
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return { ok: false, error: "payload_too_large" };
      }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ok: false, error: "bad_request" };
    return { ok: true, value: parsed as T };
  } catch {
    return { ok: false, error: "bad_request" };
  }
}

async function authenticate(request: Request, env: Env) {
  const authorization = request.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ") || !env.SUPABASE_PUBLISHABLE_KEY) return null;
  try {
    const result = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: authorization },
    });
    if (!result.ok) return null;
    const user = await result.json() as { id?: unknown };
    return typeof user.id === "string" && /^[0-9a-f-]{36}$/i.test(user.id) ? { id: user.id } : null;
  } catch {
    return null;
  }
}

function supabase(env: Env, path: string, method = "GET", body?: unknown, prefer = "return=minimal") {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { method, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: prefer }, body: body ? JSON.stringify(body) : undefined }).catch(() => new Response(null, { status: 599 }));
}

function response(body: unknown, status: number, origin: string, cacheControl = "no-store") {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": cacheControl, "Vary": "Origin", "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" });
  if (allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

export class RateLimiter {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(): Promise<Response> {
    const allowed = await this.state.blockConcurrencyWhile(async () => {
      const now = Date.now();
      const current = await this.state.storage.get<{ count: number; resetAt: number }>("window");
      if (!current || current.resetAt <= now) {
        await this.state.storage.put("window", { count: 1, resetAt: now + 60_000 });
        return true;
      }
      if (current.count >= 15) return false;
      await this.state.storage.put("window", { count: current.count + 1, resetAt: current.resetAt });
      return true;
    });
    return new Response(null, { status: allowed ? 204 : 429 });
  }
}
