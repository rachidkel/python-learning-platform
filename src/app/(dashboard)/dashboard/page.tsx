import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import {
  BookOpen,
  Target,
  Zap,
  Flame,
  ArrowRight,
  Trophy,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] || "learner";

  // ── Fetch Real Stats from Database ──
  
  // 1. Total XP
  const xpAggregate = await prisma.xpEvent.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const totalXp = xpAggregate._sum.amount || 0;

  // 2. Completed Lessons
  const completedLessons = await prisma.progress.count({
    where: { userId, completed: true },
  });
  const totalLessons = await prisma.lesson.count();

  // 3. Streak (Simplified: count of days with activity)
  const activities = await prisma.xpEvent.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  // Group by unique date string
  const uniqueDays = new Set(activities.map(a => a.createdAt.toDateString())).size;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-ink-600">
          Ready to continue your Python journey?
        </p>
      </div>

      {/* Real Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Total XP"
          value={totalXp.toString()}
          tint="bg-amber-50 text-amber-700"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={`${uniqueDays} days`}
          tint="bg-rose-50 text-rose-700"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Lessons done"
          value={`${completedLessons} / ${totalLessons}`}
          tint="bg-brand-50 text-brand-700"
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Achievements"
          value="0"
          tint="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Continue learning */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Continue learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            All courses <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {completedLessons > 0 ? (
             <div className="rounded-lg border border-brand-100 bg-brand-50 p-6 flex items-center justify-between">
               <div>
                 <p className="font-semibold text-brand-800">You're making progress!</p>
                 <p className="text-sm text-brand-600">You have completed {completedLessons} lessons.</p>
               </div>
               <Link href="/courses" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                 Keep going
               </Link>
             </div>
          ) : (
            <div className="rounded-lg border border-dashed border-ink-300 bg-ink-50 p-8 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-ink-400" />
              <p className="text-sm font-medium text-ink-700">
                No courses started yet
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Head to the Courses section to begin your first lesson.
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Browse courses
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction
          href="/missions"
          icon={<Target className="h-5 w-5" />}
          title="Coding Missions"
          description="Solve practical Python challenges"
        />
        <QuickAction
          href="/revision"
          icon={<Clock className="h-5 w-5" />}
          title="Smart Revision"
          description="Review missed questions"
        />
        <QuickAction
          href="/tutor"
          icon={<Zap className="h-5 w-5" />}
          title="AI Tutor"
          description="Ask for help any time"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tint}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            {label}
          </p>
          <p className="text-xl font-bold text-ink-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">{title}</p>
            <p className="mt-0.5 text-xs text-ink-500">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-400" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="h-8 w-64 animate-pulse rounded bg-ink-200" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-ink-200" />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}