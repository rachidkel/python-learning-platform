import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/src/components/dashboard/sidebar";
import { Topbar } from "@/src/components/dashboard/topbar";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar user={session.user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}