"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  xp: number;
  streak: number;
  children: React.ReactNode;
}

export function DashboardShell({ user, xp, streak, children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAdmin={isAdmin}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          user={user}
          xp={xp}
          streak={streak}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}