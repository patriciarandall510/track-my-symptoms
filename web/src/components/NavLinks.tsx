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
                ? "text-text-strong font-semibold border-b-2 border-primary pb-3"
                : "text-text-secondary hover:text-text-strong pb-3 border-b-2 border-transparent"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

