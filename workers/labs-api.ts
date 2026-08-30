type Env = {
  FLAGS_JSON: string;
  FLAG_HMAC_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const allowedOrigins = new Set(["https://c4cker.github.io"]);
const challenges: Record<string, { mode: "single" | "staged" | "multi-staged"; stages: string[] }> = {
  "header-trace": { mode: "single", stages: [] },
  "case-file-redacted-timeline": { mode: "staged", stages: ["evidence", "final"] },
  "network-observatory": { mode: "staged", stages: ["recon", "internal-api", "final"] },
  "cache-mirage": { mode: "multi-staged", stages: ["headers", "preview", "final"] },
  "broken-deployment": { mode: "multi-staged", stages: ["frontend", "api", "worker"] }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    if (request.method === "OPTIONS") return response(null, 204, origin);
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" && pathname === "/ranking") {
      const result = await supabase(env, "challenge_solves?select=nickname,challenge_slug,solved_at&nickname=not.is.null&order=solved_at.asc");
      if (!result.ok) return response({ ok: false, error: "db_error" }, 500, origin);
      const rows = await result.json() as Array<{ nickname: string; challenge_slug: string; solved_at: string }>;
      const ranking = new Map<string, { nickname: string; points: number; solves: Array<{ challenge_slug: string; solved_at: string }> }>();
      for (const row of rows) {
        const current = ranking.get(row.nickname) ?? { nickname: row.nickname, points: 0, solves: [] };
        current.points += 1;
        current.solves.push({ challenge_slug: row.challenge_slug, solved_at: row.solved_at });
        ranking.set(row.nickname, current);
      }
      return response({ ok: true, ranking: [...ranking.values()].sort((a, b) => b.points - a.points || a.nickname.localeCompare(b.nickname)) }, 200, origin);
    }
    if (request.method !== "POST" || pathname !== "/submit-flag") return response({ ok: false, error: "not_found" }, 404, origin);

    let body: { slug?: string; stage?: string; flag?: string; nickname?: string };
    try { body = await request.json(); } catch { return response({ ok: false, error: "bad_request" }, 400, origin); }
    const { slug, stage, flag } = body;
    if (!slug || !flag) return response({ ok: false, error: "bad_request" }, 400, origin);
    const challenge = challenges[slug];
    if (!challenge) return response({ ok: false, error: "unknown_challenge" }, 404, origin);
    if (challenge.mode === "single" && stage) return response({ ok: false, error: "bad_stage" }, 400, origin);
    if (challenge.mode !== "single" && (!stage || !challenge.stages.includes(stage))) return response({ ok: false, error: "bad_stage" }, 400, origin);

    let flags: Record<string, string | Record<string, string>>;
    try { flags = JSON.parse(env.FLAGS_JSON || "{}"); } catch { return response({ ok: false, error: "server_config" }, 500, origin); }
    const configured = flags[slug];
    const expected = typeof configured === "string" ? configured : configured?.[stage ?? ""];
    if (!expected || expected !== flag.trim()) return response({ ok: false, error: "wrong_flag" }, 200, origin);

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const visitorHash = await hmac(ip, env.FLAG_HMAC_SECRET);
    const existing = await supabase(env, `challenge_solves?visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=nickname&limit=1`);
    const existingRows = await existing.json() as Array<{ nickname: string | null }>;
    let nickname = existingRows[0]?.nickname ?? null;
    if (!nickname) {
      const stageIdentity = await supabase(env, `challenge_stage_solves?visitor_hash=eq.${encodeURIComponent(visitorHash)}&select=nickname&nickname=not.is.null&limit=1`);
      const stageRows = await stageIdentity.json() as Array<{ nickname: string | null }>;
      nickname = stageRows[0]?.nickname ?? body.nickname?.trim().slice(0, 32) ?? null;
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

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function supabase(env: Env, path: string, method = "GET", body?: unknown) {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { method, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: body ? JSON.stringify(body) : undefined });
}

function response(body: unknown, status: number, origin: string) {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
  if (allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}
