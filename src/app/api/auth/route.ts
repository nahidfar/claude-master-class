import { NextResponse } from "next/server";
import { readJson } from "@/lib/api";
import { AuthenticationNotImplementedError } from "@/lib/auth";
import { isSameOrigin } from "@/lib/origin";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body.ok) return body.response;
  return NextResponse.json({ error: new AuthenticationNotImplementedError().message }, { status: 501 });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }
  return NextResponse.json({ error: new AuthenticationNotImplementedError().message }, { status: 501 });
}
