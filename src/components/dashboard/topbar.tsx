"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, Flame, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-ink-500">Welcome back 👋</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* XP */}
        <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 md:flex">
          <Zap className="h-3.5 w-3.5" />
          0 XP
        </div>

        {/* Streak */}
        <div className="hidden items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 md:flex">
          <Flame className="h-3.5 w-3.5" />
          0 days
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-2 py-1 transition hover:bg-ink-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-ink-800 md:block">
              {user.name || user.email}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-ink-200 bg-white p-1 shadow-lg">
                <div className="border-b border-ink-100 px-3 py-2">
                  <p className="text-sm font-medium text-ink-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-ink-500">{user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}