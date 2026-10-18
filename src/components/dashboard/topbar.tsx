"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, Flame, Zap, ChevronDown, Menu } from "lucide-react";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  xp: number;
  streak: number;
  onOpenMenu: () => void;
}

export function Topbar({ user, xp, streak, onOpenMenu }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMenu}
          className="md:hidden rounded-md p-2 text-ink-600 hover:bg-ink-100 transition"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="hidden text-sm font-medium text-ink-500 md:block">
          Welcome back 👋
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* XP Badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <Zap className="h-3.5 w-3.5" />
          {xp} XP
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
          <Flame className="h-3.5 w-3.5" />
          {streak}
        </div>

        {/* User Menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-2 transition hover:bg-ink-50 md:pl-2 md:pr-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-ink-800 md:block">
              {user.name || user.email}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-ink-400 md:block" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-ink-200 bg-white p-1 shadow-lg">
                <div className="border-b border-ink-100 px-3 py-2">
                  <p className="text-sm font-medium text-ink-900 truncate">
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