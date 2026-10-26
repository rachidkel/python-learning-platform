import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Target,
  Trophy,
  RefreshCw,
  LayoutDashboard,
  Code2,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

// ─── Data ─────────────────────────────────────────────────────
const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description:
      "Learn Python step by step — variables, loops, functions, OOP — with hands-on examples and instant feedback.",
  },
  {
    icon: Terminal,
    title: "Real-Time Code Execution",
    description:
      "Write and run Python code directly in your browser. No installation, no setup — just code and learn.",
  },
  {
    icon: Sparkles,
    title: "AI Python Tutor",
    description:
      "Stuck on a concept or an error? Ask the AI tutor. Get explanations, hints, and code walkthroughs adapted to your level.",
  },
  {
    icon: Target,
    title: "Coding Missions",
    description:
      "Build real programs — calculators, games, quizzes — and earn XP as you complete practical challenges.",
  },
  {
    icon: RefreshCw,
    title: "Smart Revision",
    description:
      "Our spaced-repetition system resurfaces questions you missed at the right time so you never forget a concept.",
  },
  {
    icon: Trophy,
    title: "Projects & Certificates",
    description:
      "Complete real-world projects, pass the final assessment, and earn a certificate of completion.",
  },
];

const courses = [
  {
    level: "BEGINNER" as const,
    title: "Python Fundamentals",
    description: "Variables, data types, conditions, loops, and functions.",
    lessons: 12,
  },
  {
    level: "INTERMEDIATE" as const,
    title: "Data Structures & OOP",
    description: "Lists, dictionaries, sets, classes, and object-oriented design.",
    lessons: 10,
  },
  {
    level: "ADVANCED" as const,
    title: "Real-World Python",
    description: "File I/O, error handling, modules, and building full applications.",
    lessons: 8,
  },
];

// ─── Page ─────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-ink-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">PyLearn</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-ink-600 hover:text-ink-900">
              Features
            </Link>
            <Link href="#courses" className="text-sm font-medium text-ink-600 hover:text-ink-900">
              Courses
            </Link>

          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-ink-50 to-ink-50" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: copy */}
            <div className="animate-fade-up">
              <Badge className="mb-4">🎉 New — AI Python Tutor is live</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-6xl">
                Learn Python{" "}
                <span className="text-gradient">interactively</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-600">
                From your first <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-sm">print()</code>{" "}
                to full applications. Read lessons, solve quizzes, run real Python code in
                your browser, and get AI help whenever you're stuck.
              </p>

              {/* 👇 UPDATED: Added the guest mode button */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg">
                    Start learning free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline">
                    Try without an account
                  </Button>
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  No installation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Learn at your own pace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Free to start
                </li>
              </ul>
            </div>

            {/* Right: code preview */}
            <div className="animate-fade-up">
              <Card className="overflow-hidden border-ink-200/80 shadow-xl">
                <div className="flex items-center gap-2 border-b border-ink-200 bg-ink-50 px-4 py-2.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-ink-500">main.py</span>
                </div>
                <pre className="overflow-x-auto bg-ink-900 p-5 text-sm leading-relaxed text-ink-100">
{`def greet(name):
    return f"Hello, {name}!"


def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result


print(greet("Python learner"))
print(fibonacci(8))
# → [0, 1, 1, 2, 3, 5, 8, 13]`}
                </pre>
                <div className="flex items-center justify-between border-t border-ink-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-ink-500">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Ready
                  </div>
                  <Button size="sm" variant="success">
                    ▶ Run
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section id="features" className="border-t border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="default" className="mb-3">Everything you need</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
              A complete learning platform
            </h2>
            <p className="mt-4 text-ink-600">
              Six powerful features working together to help you master Python —
              not just memorize it.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Courses ────────────────────────────────────────── */}
      <section id="courses" className="border-t border-ink-200">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="default" className="mb-3">Learning paths</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
              From beginner to job-ready
            </h2>
            <p className="mt-4 text-ink-600">
              Follow a structured path. Each course builds on the previous one.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.title} className="flex flex-col">
                <CardHeader>
                  <Badge variant={c.level.toLowerCase() as "beginner" | "intermediate" | "advanced"} className="mb-3 w-fit">
                    {c.level}
                  </Badge>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between text-sm text-ink-500">
                    <span>{c.lessons} lessons</span>
                    <Link href="/courses" className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
                      Start <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="border-t border-ink-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center text-white">
          <LayoutDashboard className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to start your Python journey?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-50/90">
            Join thousands of learners building real skills. Track progress, earn XP, and
            complete projects — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white/30 bg-white text-brand-700 hover:bg-brand-50">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">PyLearn</span>
          </div>
          <p className="text-xs text-ink-500">
            © 2026 PyLearn. Learn Python interactively.
          </p>
        </div>
      </footer>
    </div>
  );
}