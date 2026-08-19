"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/tutor", label: "Tutor" },
  { href: "/progress", label: "Progress" },
  { href: "/experiments", label: "Experiments" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-chalk/10 bg-board/97">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg italic tracking-tight text-chalk">
          Mentara
        </Link>
        <nav className="flex items-center gap-1 font-mono text-[13px] uppercase tracking-wide">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-1.5 transition-colors ${
                  active ? "bg-highlighter text-board" : "text-chalk-dim hover:bg-board-raised"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
