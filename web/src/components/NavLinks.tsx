"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/logs/pain", label: "Pain logs" },
    { href: "/logs/events", label: "PT & activity" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-3 text-sm">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "text-slate-900 font-semibold border-b-2 border-blue-600 pb-3"
                : "text-slate-600 hover:text-slate-900 pb-3 border-b-2 border-transparent"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

