import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Users, LayoutDashboard, ArrowLeft } from "lucide-react";


export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  // 🔒 SECURITY: Block non-admins
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-ink-900">Access Denied</h1>
        <p className="text-ink-500 mt-2">You must be an administrator to view this page.</p>
        <Link href="/dashboard" className="mt-6 text-brand-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-ink-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-brand-600" />
            Admin Control Panel
          </h1>
          <p className="text-sm text-ink-500">Manage users, view platform stats, and monitor activity.</p>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="flex items-center gap-4 border-b border-ink-200 pb-4">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-lg">
          <LayoutDashboard className="h-4 w-4" /> Overview
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900 px-4 py-2 rounded-lg hover:bg-ink-100">
          <Users className="h-4 w-4" /> Users
        </Link>
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}