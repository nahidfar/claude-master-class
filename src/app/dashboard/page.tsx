import Link from "next/link";
import { tools } from "@/lib/tools";
import { privatePageGuard } from "@/lib/private-page";

export default async function Dashboard() {
  const blocked = await privatePageGuard();
  if (blocked) return blocked;
  return (
    <>
      <h1>Your next three builds.</h1>
      <p>One verified profile. One target job. Three private tools.</p>
      <p className="notice">Authentication is your first private build. Forms, input validation, and guard call sites are supplied; students implement authentication and all three AI features. Each AI route returns HTTP 501 after authentication until its exercise is completed.</p>
      <div className="grid three">
        {tools.map((tool, index) => <Link key={tool.id} className="panel tool-link" href={`/dashboard/${tool.id}`}>
          <span className="badge">Exercise {index + 1}</span><h2>{tool.title}</h2><p>{tool.description}</p><span>Open exercise workspace</span>
        </Link>)}
      </div>
    </>
  );
}
