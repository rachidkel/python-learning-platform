import { Suspense } from "react";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/dashboard/dashboard-shell";
import { AITutor } from "@/src/components/ai-tutor";
import Link from "next/link";
import { Code2 } from "lucide-react";

export const instant = false;

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // 👇 NEW: If no session, render a Guest Layout
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col bg-ink-50">
        {/* Guest Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-6 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">PyLearn</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Get started</Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, role: true },
  });

  if (!user) redirect("/login");

  const xpAggregate = await prisma.xpEvent.aggregate({
    where: { userId: session.user.id },
    _sum: { amount: true },
  });
  const totalXp = xpAggregate._sum.amount || 0;

  const activities = await prisma.xpEvent.findMany({
    where: { userId: session.user.id },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const uniqueDays = new Set(activities.map((a) => a.createdAt.toDateString())).size;

  return (
    <>
      <DashboardShell user={user} xp={totalXp} streak={uniqueDays}>
        {children}
      </DashboardShell>
      <AITutor />
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-ink-500">Loading…</div>}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}