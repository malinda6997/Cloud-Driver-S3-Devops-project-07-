"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CloudLightning, FolderPlus } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", name: "Dashboard", icon: LayoutDashboard },
    { href: "/manage", name: "Manage Items", icon: FolderPlus },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <CloudLightning className="text-violet-400 h-6 w-6 animate-pulse" />
        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          NEXUS DRIVE
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-violet-600/20 text-violet-400 border border-violet-500/30 shadow-inner"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}