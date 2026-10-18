import { Suspense } from "react";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/dashboard/dashboard-shell";
import { AITutor } from "@/src/components/ai-tutor";

export const instant = false;

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch real XP for the topbar
  const xpAggregate = await prisma.xpEvent.aggregate({
    where: { userId: session.user.id },
    _sum: { amount: true },
  });
  const totalXp = xpAggregate._sum.amount || 0;

  // Simplified streak calculation
  const activities = await prisma.xpEvent.findMany({
    where: { userId: session.user.id },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const uniqueDays = new Set(activities.map((a) => a.createdAt.toDateString())).size;

  return (
    <>
      <DashboardShell
        user={session.user}
        xp={totalXp}
        streak={uniqueDays}
      >
        {children}
      </DashboardShell>
      
      {/* The floating AI Tutor button */}
      <AITutor />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-ink-500">Loading…</div>}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}