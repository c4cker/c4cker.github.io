import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { hallOfFameSeed } from "../../data/hall-of-fame";
import { env } from "cloudflare:workers";

export const prerender = false;
const MAX_RANKING_ENTRIES = 20;
const response = (entries: unknown[], source: "database" | "seed") => new Response(JSON.stringify({ entries: entries.slice(0, MAX_RANKING_ENTRIES), source }), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" } });

export const GET: APIRoute = async () => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return response(hallOfFameSeed, "seed");
  try {
    const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data, error } = await db.from("challenge_solves").select("challenge_slug,visitor_hash,nickname,solved_at").order("solved_at", { ascending: false }).limit(MAX_RANKING_ENTRIES);
    if (error) throw error;
    return response(data.map((entry) => ({ alias: entry.nickname || `probe-${entry.visitor_hash.slice(0, 6)}`, challenge_slug: entry.challenge_slug, solved_at: entry.solved_at })), "database");
  } catch { return response(hallOfFameSeed, "seed"); }
};
