import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { env } from "cloudflare:workers";
// @ts-nocheck - validator no expone tipos propios en el runtime Worker.
import validator from "validator";

export const prerender = false;
const json = (message: string, status = 200) => new Response(JSON.stringify({ message }), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") return json("Solicitud rechazada por origen no permitido.", 403);
    const { challenge_slug, flag, nickname } = await request.json();
    if (typeof challenge_slug !== "string" || !/^[a-z0-9-]{1,100}$/.test(challenge_slug) || typeof flag !== "string" || flag.length > 512) return json("Solicitud inválida.", 400);
    const cleanNickname = typeof nickname === "string" ? validator.escape(validator.trim(nickname)).slice(0, 32) : "";
    const flags = JSON.parse(env.FLAGS_JSON || "{}");
    if (!env.FLAG_HMAC_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json("El servicio de flags todavía no está configurado.", 503);
    if (flags[challenge_slug] !== flag) return json("La flag no es válida.", 422);
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) return json("No se pudo identificar la solicitud.", 400);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(env.FLAG_HMAC_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const visitor_hash = hex(await crypto.subtle.sign("HMAC", key, encoder.encode(ip)));
    const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { error } = await db.from("challenge_solves").upsert({ challenge_slug, visitor_hash, nickname: cleanNickname || null }, { onConflict: "challenge_slug,visitor_hash", ignoreDuplicates: true });
    if (error) throw error;
    return json("Flag registrada. Bien hecho.");
  } catch { return json("No se pudo procesar la solicitud.", 500); }
};
