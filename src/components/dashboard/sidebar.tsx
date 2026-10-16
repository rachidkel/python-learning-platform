"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  RefreshCw,
  Trophy,
  Sparkles,
  Code2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/revision", label: "Revision", icon: RefreshCw },
  { href: "/projects", label: "Projects", icon: Trophy },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white md:flex md:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-ink-200 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight">PyLearn</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-brand-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-ink-200 p-4">
        <p className="text-xs text-ink-400">Python Learning Platform</p>
      </div>
    </aside>
  );
}