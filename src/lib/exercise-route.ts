import { NextResponse } from "next/server";
import { readJson, requireApiSession } from "./api";
import { tools, validateToolInput, type ToolId } from "./tools";

export async function exerciseRoute(request: Request, id: ToolId): Promise<NextResponse> {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;
  const body = await readJson(request);
  if (!body.ok) return body.response;
  const input = validateToolInput(body.value);
  if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });

  const tool = tools.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown exercise route: ${id}`);
  return NextResponse.json(
    { error: `${tool.title} is not implemented yet. Complete exercises/${tool.exercise}. No AI request was made.` },
    { status: 501 },
  );
}
