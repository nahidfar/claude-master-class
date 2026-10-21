export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim()
    ?? url.protocol.slice(0, -1);
  return origin === `${protocol}://${host}`;
}
