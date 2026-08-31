import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { challenges } from "../../data/challenges";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as any).runtime?.env;
  const getEnv = (key: string): string => runtimeEnv?.[key] ?? import.meta.env[key] ?? "";

  let body: { slug?: string; stage?: string; flag?: string; nickname?: string };
  try {
    const raw = await request.arrayBuffer();
    if (raw.byteLength > 16_384) return json({ ok: false, error: "payload_too_large" }, 413);
    body = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const { slug, stage, flag, nickname } = body;
  const invalidType =
    typeof slug !== "string" ||
    typeof flag !== "string" ||
    typeof stage !== "undefined" && typeof stage !== "string" ||
    typeof nickname !== "undefined" && typeof nickname !== "string";
  const normalizedNickname = nickname === undefined ? undefined : normalizeNickname(nickname);
  if (!slug || !flag || invalidType || (nickname !== undefined && !normalizedNickname)) return json({ ok: false, error: "bad_request" }, 400);
  if (slug.length > 120 || flag.length > 512 || (stage?.length ?? 0) > 120 || (nickname?.length ?? 0) > 32) return json({ ok: false, error: "payload_too_large" }, 413);

  const challenge = challenges.find((item) => item.slug === slug);
  if (!challenge) return json({ ok: false, error: "unknown_challenge" }, 404);
  const stageIds = challenge.stages?.map((item) => item.id) ?? [];
  if (challenge.flagMode === "single" && stage) return json({ ok: false, error: "bad_stage" }, 400);
  if (challenge.flagMode !== "single" && (!stage || !stageIds.includes(stage))) return json({ ok: false, error: "bad_stage" }, 400);

  let flags: Record<string, string | Record<string, string>>;
  try {
    flags = JSON.parse(getEnv("FLAGS_JSON") || "{}");
  } catch {
    return json({ ok: false, error: "server_misconfigured" }, 500);
  }
  const configured = flags[slug];
  const expected = typeof configured === "string" ? configured : configured?.[stage ?? ""];
  if (expected !== flag.trim()) return json({ ok: false, error: "wrong_flag" });

  const ip =
    request.headers.get("CF-Connecting-IP") ?? "unknown";

  const secret = getEnv("FLAG_HMAC_SECRET");
  if (secret.length < 32 || secret.includes("REEMPLAZAR")) return json({ ok: false, error: "server_misconfigured" }, 500);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  const ipHash = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const supabase = createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));

  if (challenge.flagMode === "staged") {
    const currentIndex = stageIds.indexOf(stage!);
    const { data: previous, error: previousError } = await supabase
      .from("challenge_stage_solves")
      .select("stage_id")
      .eq("challenge_slug", slug)
      .eq("visitor_hash", ipHash);
    if (previousError) return json({ ok: false, error: "db_error" }, 500);
    const solved = new Set((previous ?? []).map((item) => item.stage_id));
    if (stageIds.slice(0, currentIndex).some((id) => !solved.has(id))) return json({ ok: false, error: "stage_locked" });
  }

  if (challenge.flagMode !== "single") {
    const { data: existingStage, error: existingStageError } = await supabase
      .from("challenge_stage_solves")
      .select("id")
      .eq("challenge_slug", slug)
      .eq("stage_id", stage!)
      .eq("visitor_hash", ipHash)
      .maybeSingle();

    if (existingStageError) return json({ ok: false, error: "db_error" }, 500);
    if (existingStage) return json({ ok: true, already: true, completed: false, ranked: false });

    const { error: stageError } = await supabase.from("challenge_stage_solves").insert({
      challenge_slug: slug,
      stage_id: stage!,
      visitor_hash: ipHash,
    });
    if (stageError && stageError.code !== "23505") return json({ ok: false, error: "db_error" }, 500);

    const { data: solvedStages, error: solvedStagesError } = await supabase
      .from("challenge_stage_solves")
      .select("stage_id")
      .eq("challenge_slug", slug)
      .eq("visitor_hash", ipHash);
    if (solvedStagesError) return json({ ok: false, error: "db_error" }, 500);
    const solved = new Set((solvedStages ?? []).map((item) => item.stage_id));
    if (!stageIds.every((id) => solved.has(id))) return json({ ok: true, completed: false, ranked: false });
  }

  const { data: existingSolve, error: existingSolveError } = await supabase
    .from("challenge_solves")
    .select("id")
    .eq("challenge_slug", slug)
    .eq("visitor_hash", ipHash)
    .maybeSingle();
  if (existingSolveError) return json({ ok: false, error: "db_error" }, 500);
  if (existingSolve) return json({ ok: true, already: true, completed: true, ranked: false });

  const { error: solveError } = await supabase.from("challenge_solves").insert({
    challenge_slug: slug,
      nickname: normalizedNickname || null,
    visitor_hash: ipHash,
  });
  if (solveError) return solveError.code === "23505"
    ? json({ ok: true, already: true, completed: true, ranked: false })
    : json({ ok: false, error: "db_error" }, 500);

  return json({ ok: true, completed: true, ranked: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function normalizeNickname(value: string) {
  const nickname = value.trim().replace(/\s+/g, " ");
  return nickname && nickname.length <= 32 && /^[\p{L}\p{N}_ .-]+$/u.test(nickname) ? nickname : null;
}
