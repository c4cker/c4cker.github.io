type Env = {
  FLAGS_JSON: string;
  FLAG_HMAC_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};
import { challenges as challengeCatalog } from "../apps/labs/src/data/challenges.published";

const allowedOrigins = new Set(["https://c4cker.github.io", "http://localhost:4322", "http://labs.localhost:4322"]);
const challenges = Object.fromEntries(challengeCatalog.map((item) => [item.slug, { mode: item.flagMode, stages: item.stages.map((stage) => stage.id) }]));
const attempts = new Map<string, { count: number; resetAt: number }>();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    if (request.method === "OPTIONS") return response(null, 204, origin);
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" && pathname === "/health") return response({ ok: true, service: "labs-api" }, 200, origin, "no-store");
    if (request.method === "GET" && pathname === "/visitor-ip") {
      return response({ ok: true, ip: request.headers.get("CF-Connecting-IP") ?? "unknown" }, 200, origin, "no-store");
    }
    if (request.method === "GET" && pathname === "/ranking") {
      const result = await supabase(env, "challenge_solves?select=nickname,challenge_slug&nickname=not.is.null&order=solved_at.asc&limit=1000");
      if (!result.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const rows = await result.json() as Array<{ nickname: string; challenge_slug: string }>;
      const ranking = new Map<string, { nickname: string; points: number }>();
      for (const row of rows) {
        const current = ranking.get(row.nickname) ?? { nickname: row.nickname, points: 0 };
        current.points += 1;
        ranking.set(row.nickname, current);
      }
      return response({ ok: true, ranking: [...ranking.values()].sort((a, b) => b.points - a.points || a.nickname.localeCompare(b.nickname)).slice(0, 100) }, 200, origin, "public, max-age=30");
    }
    if (request.method !== "POST" || pathname !== "/submit-flag") return response({ ok: false, error: "not_found" }, 404, origin);
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!allowAttempt(ip)) return response({ ok: false, error: "rate_limited" }, 429, origin);
    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 8192) return response({ ok: false, error: "payload_too_large" }, 413, origin);

    let body: { slug?: string; stage?: string; flag?: string; nickname?: string };
    try {
      const raw = await request.arrayBuffer();
      if (raw.byteLength > 8192) return response({ ok: false, error: "payload_too_large" }, 413, origin);
      body = JSON.parse(new TextDecoder().decode(raw));
    } catch { return response({ ok: false, error: "bad_request" }, 400, origin); }
    const { slug, stage, flag } = body;
    if (!slug || !flag) return response({ ok: false, error: "bad_request" }, 400, origin);
    if (typeof flag !== "string" || flag.trim().length > 512) return response({ ok: false, error: "bad_request" }, 400, origin);
    if (body.nickname !== undefined && !normalizeNickname(body.nickname)) return response({ ok: false, error: "bad_nickname" }, 400, origin);
    const challenge = challenges[slug];
    if (!challenge) return response({ ok: false, error: "unknown_challenge" }, 404, origin);
    if (challenge.mode === "single" && stage) return response({ ok: false, error: "bad_stage" }, 400, origin);
    if (challenge.mode !== "single" && (!stage || !challenge.stages.includes(stage))) return response({ ok: false, error: "bad_stage" }, 400, origin);

    let flags: Record<string, string | Record<string, string>>;
    try { flags = JSON.parse(env.FLAGS_JSON || "{}"); } catch { return response({ ok: false, error: "server_config" }, 500, origin); }
    const configured = flags[slug];
    const expected = typeof configured === "string" ? configured : configured?.[stage ?? ""];
    if (!expected || expected !== flag.trim()) return response({ ok: false, error: "wrong_flag" }, 200, origin);

    const visitorHash = await hmac(ip, env.FLAG_HMAC_SECRET);
    const existing = await supabase(env, `challenge_solves?visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=nickname&limit=1`);
    const existingRows = await existing.json() as Array<{ nickname: string | null }>;
    let nickname = existingRows[0]?.nickname ?? null;
    if (!nickname) {
      const stageIdentity = await supabase(env, `challenge_stage_solves?visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=nickname&nickname=not.is.null&limit=1`);
      const stageRows = await stageIdentity.json() as Array<{ nickname: string | null }>;
      nickname = stageRows[0]?.nickname ?? normalizeNickname(body.nickname) ?? null;
    }
    if (!nickname) return response({ ok: false, error: "needs_nickname" }, 200, origin);

    if (challenge.mode === "staged") {
      const progress = await supabase(env, `challenge_stage_solves?challenge_slug=eq.${encodeURIComponent(slug)}&visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=stage_id`);
      const solved = new Set((await progress.json() as Array<{ stage_id: string }>).map((row) => row.stage_id));
      const index = challenge.stages.indexOf(stage!);
      if (challenge.stages.slice(0, index).some((id) => !solved.has(id))) return response({ ok: false, error: "stage_locked" }, 200, origin);
    }

    if (challenge.mode !== "single") {
      const key = `challenge_slug=eq.${encodeURIComponent(slug)}&stage_id=eq.${encodeURIComponent(stage!)}&visitor_hash=eq.${encodeURIComponent(visitorHash)}`;
      const prior = await supabase(env, `challenge_stage_solves?${key}&select=id&limit=1`);
      if ((await prior.json() as unknown[]).length) return response({ ok: true, already: true, completed: false, ranked: false }, 200, origin);
      const inserted = await supabase(env, "challenge_stage_solves", "POST", { challenge_slug: slug, stage_id: stage, visitor_hash: visitorHash, nickname });
      if (!inserted.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const all = await supabase(env, `challenge_stage_solves?challenge_slug=eq.${encodeURIComponent(slug)}&visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=stage_id`);
      const solved = new Set((await all.json() as Array<{ stage_id: string }>).map((row) => row.stage_id));
      if (!challenge.stages.every((id) => solved.has(id))) return response({ ok: true, completed: false, ranked: false }, 200, origin);
    }

    const priorSolve = await supabase(env, `challenge_solves?challenge_slug=eq.${encodeURIComponent(slug)}&visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=id&limit=1`);
    if ((await priorSolve.json() as unknown[]).length) return response({ ok: true, already: true, completed: true, ranked: false }, 200, origin);
    const inserted = await supabase(env, "challenge_solves", "POST", { challenge_slug: slug, nickname, visitor_hash: visitorHash });
    if (!inserted.ok) return response({ ok: false, error: "db_error" }, 500, origin);
    return response({ ok: true, completed: true, ranked: true }, 200, origin);
  }
};

function normalizeNickname(value?: string) {
  const nickname = value?.trim().replace(/\s+/g, " ");
  return nickname && nickname.length <= 32 && /^[\p{L}\p{N}_ .-]+$/u.test(nickname) ? nickname : null;
}

function allowAttempt(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) { attempts.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (current.count >= 15) return false;
  current.count += 1;
  return true;
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function supabase(env: Env, path: string, method = "GET", body?: unknown) {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { method, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: body ? JSON.stringify(body) : undefined });
}

function response(body: unknown, status: number, origin: string, cacheControl = "no-store") {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": cacheControl, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
  if (allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}
