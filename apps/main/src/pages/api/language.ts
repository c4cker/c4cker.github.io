import type { APIRoute } from "astro";

const isSharedHost = (hostname: string) => hostname === "c4cker.com" || hostname.endsWith(".c4cker.com");

export const GET: APIRoute = ({ request, redirect, cookies }) => {
  const url = new URL(request.url);
  const language = url.searchParams.get("lang") === "en" ? "en" : "es";
  const returnTo = url.searchParams.get("returnTo") ?? "/";
  const destination = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  cookies.set("c4cker-language", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: url.protocol === "https:",
    ...(isSharedHost(url.hostname) ? { domain: ".c4cker.com" } : {})
  });
  return redirect(destination, 302);
};
