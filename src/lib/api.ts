import { NextResponse } from "next/server";
import { AuthenticationNotImplementedError, authConfiguration, isAuthenticated } from "./auth";
import { isSameOrigin } from "./origin";

export async function requireApiSession(): Promise<NextResponse | null> {
  try {
    authConfiguration();
  } catch (error) {
    if (error instanceof AuthenticationNotImplementedError) {
      return NextResponse.json({ error: error.message }, { status: 501 });
    }
    console.error("Private API configuration error:", error);
    return NextResponse.json({ error: "Login is not configured. Follow the starter setup instructions." }, { status: 503 });
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Sign in before using private tools." }, { status: 401 });
  }
  return null;
}

export async function readJson(request: Request): Promise<
  { ok: true; value: unknown } | { ok: false; response: NextResponse }
> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: NextResponse.json({ error: "Send JSON with Content-Type: application/json." }, { status: 415 }) };
  }
  if (!isSameOrigin(request)) {
    return { ok: false, response: NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 }) };
  }
  const text = await request.text();
  if (text.length > 20000) {
    return { ok: false, response: NextResponse.json({ error: "Request is too large." }, { status: 413 }) };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return { ok: false, response: NextResponse.json({ error: "Request body is not valid JSON." }, { status: 400 }) };
  }
}
