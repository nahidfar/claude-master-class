import { notFound } from "next/navigation";
import Link from "next/link";
import ToolWorkbench from "@/components/ToolWorkbench";
import { tools } from "@/lib/tools";
import { privatePageGuard } from "@/lib/private-page";

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const blocked = await privatePageGuard();
  if (blocked) return blocked;
  const { tool: id } = await params;
  const tool = tools.find((item) => item.id === id);
  if (!tool) notFound();
  return (
    <>
      <p><Link href="/dashboard">Back to workspace</Link></p>
      <h1>{tool.title}</h1>
      <p>{tool.description}</p>
      <p className="notice">Follow the instructor&apos;s guidance during class. This form is wired to a protected placeholder API. Students add the real server-side AI call, validate its output, and improve the result UI.</p>
      <ToolWorkbench id={tool.id} />
    </>
  );
}
