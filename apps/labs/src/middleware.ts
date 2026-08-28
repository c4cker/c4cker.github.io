import { defineMiddleware } from "astro:middleware";
import { translatePage } from "./scripts/i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (context.cookies.get("c4cker-language")?.value !== "en" || !response.headers.get("content-type")?.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("Content-Language", "en");
  headers.append("Vary", "Cookie");
  return new Response(translatePage(await response.text()), { status: response.status, statusText: response.statusText, headers });
});
