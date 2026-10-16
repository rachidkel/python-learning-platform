import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/src/lib/auth";
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
import { Button } from "@/src/components/ui/button";

async function DashboardContent() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "learner";

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

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Total XP"
          value="0"
          tint="bg-amber-50 text-amber-700"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value="0 days"
          tint="bg-rose-50 text-rose-700"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Lessons done"
          value="0 / 30"
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/courses">
              All courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-ink-300 bg-ink-50 p-8 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-ink-400" />
            <p className="text-sm font-medium text-ink-700">
              No courses started yet
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Head to the Courses section to begin your first lesson.
            </p>
            <Button asChild className="mt-4">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
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