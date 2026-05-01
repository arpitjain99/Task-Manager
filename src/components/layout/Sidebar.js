import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CheckSquare, FolderKanban, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-60 shrink-0 border-r border-bg-border bg-bg-surface lg:flex lg:flex-col">
      <div className="border-b border-bg-border px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-white">
          <CheckSquare className="text-accent" size={22} />
          TeamFlow
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-[#8888aa] transition hover:bg-bg-hover hover:text-white">
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-bg-border p-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}
