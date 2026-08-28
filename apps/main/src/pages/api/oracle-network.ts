import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  const address = request.headers.get("CF-Connecting-IP");
  return new Response(JSON.stringify({ address, local: !address }), {
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8" }
  });
};
