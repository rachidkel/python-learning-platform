"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Code2, LayoutDashboard, BookOpen, Target, RefreshCw, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/revision", label: "Revision", icon: RefreshCw },
  { href: "/projects", label: "Projects", icon: Trophy },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-200 px-6">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">PyLearn</span>
          </Link>
          <button onClick={onClose} className="md:hidden text-ink-500 hover:text-ink-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
              >
                <item.icon className={cn("h-4 w-4", active && "text-brand-600")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}