"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "总览" },
  { href: "/principles", label: "原则" },
  { href: "/decisions", label: "决策记录" },
  { href: "/integration", label: "融合协议" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-3">
        <Link
          href="/"
          className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50"
        >
          ZCode Work <span className="text-emerald-600 dark:text-emerald-400">☤</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
