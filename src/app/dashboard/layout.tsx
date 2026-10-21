import { privatePageGuard } from "@/lib/private-page";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const blocked = await privatePageGuard();
  if (blocked) return blocked;
  return (
    <main id="main" className="workspace">
      <div className="workspace-header"><p className="eyebrow">Private career workspace</p><LogoutButton /></div>
      {children}
    </main>
  );
}
