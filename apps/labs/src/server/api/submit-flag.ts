import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { challenges } from "../../data/challenges";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as any).runtime?.env;
  const getEnv = (key: string): string => runtimeEnv?.[key] ?? import.meta.env[key] ?? "";

  let body: { slug?: string; stage?: string; flag?: string; nickname?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const { slug, stage, flag, nickname } = body;
  if (!slug || !flag) return json({ ok: false, error: "bad_request" }, 400);

  const challenge = challenges.find((item) => item.slug === slug);
  if (!challenge) return json({ ok: false, error: "unknown_challenge" }, 404);
  const stageIds = challenge.stages?.map((item) => item.id) ?? [];
  if (challenge.flagMode === "single" && stage) return json({ ok: false, error: "bad_stage" }, 400);
  if (challenge.flagMode !== "single" && (!stage || !stageIds.includes(stage))) return json({ ok: false, error: "bad_stage" }, 400);

  const flags: Record<string, string | Record<string, string>> = JSON.parse(getEnv("FLAGS_JSON") || "{}");
  const configured = flags[slug];
  const expected = typeof configured === "string" ? configured : configured?.[stage ?? ""];
  if (expected !== flag.trim()) return json({ ok: false, error: "wrong_flag" });

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ??
    "unknown";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getEnv("FLAG_HMAC_SECRET")),
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
    const { data: previous } = await supabase
      .from("challenge_stage_solves")
      .select("stage_id")
      .eq("challenge_slug", slug)
      .eq("visitor_hash", ipHash);
    const solved = new Set((previous ?? []).map((item) => item.stage_id));
    if (stageIds.slice(0, currentIndex).some((id) => !solved.has(id))) return json({ ok: false, error: "stage_locked" });
  }

  if (challenge.flagMode !== "single") {
    const { data: existingStage } = await supabase
      .from("challenge_stage_solves")
      .select("id")
      .eq("challenge_slug", slug)
      .eq("stage_id", stage!)
      .eq("visitor_hash", ipHash)
      .maybeSingle();

    if (existingStage) return json({ ok: true, already: true, completed: false, ranked: false });

    const { error: stageError } = await supabase.from("challenge_stage_solves").insert({
      challenge_slug: slug,
      stage_id: stage!,
      visitor_hash: ipHash,
    });
    if (stageError) return json({ ok: false, error: "db_error" }, 500);

    const { data: solvedStages } = await supabase
      .from("challenge_stage_solves")
      .select("stage_id")
      .eq("challenge_slug", slug)
      .eq("visitor_hash", ipHash);
    const solved = new Set((solvedStages ?? []).map((item) => item.stage_id));
    if (!stageIds.every((id) => solved.has(id))) return json({ ok: true, completed: false, ranked: false });
  }

  const { data: existingSolve } = await supabase
    .from("challenge_solves")
    .select("id")
    .eq("challenge_slug", slug)
    .eq("visitor_hash", ipHash)
    .maybeSingle();
  if (existingSolve) return json({ ok: true, already: true, completed: true, ranked: false });

  const { error: solveError } = await supabase.from("challenge_solves").insert({
    challenge_slug: slug,
    nickname: nickname?.trim().slice(0, 32) || null,
    visitor_hash: ipHash,
  });
  if (solveError) return json({ ok: false, error: "db_error" }, 500);

  return json({ ok: true, completed: true, ranked: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
