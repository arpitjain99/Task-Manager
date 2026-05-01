"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CheckSquare, FolderKanban, LayoutDashboard } from "lucide-react";

export function MobileNav() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-bg-border bg-bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold">
        <CheckSquare className="text-accent" size={20} />
        TeamFlow
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" aria-label="Dashboard" className="rounded-lg p-2 text-[#8888aa] hover:bg-bg-hover hover:text-white">
          <LayoutDashboard size={20} />
        </Link>
        <Link href="/projects" aria-label="Projects" className="rounded-lg p-2 text-[#8888aa] hover:bg-bg-hover hover:text-white">
          <FolderKanban size={20} />
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
