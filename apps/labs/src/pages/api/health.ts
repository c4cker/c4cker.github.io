import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
export const prerender = false;
export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ status: "ok", services: { flags: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.FLAG_HMAC_SECRET) } }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
};
