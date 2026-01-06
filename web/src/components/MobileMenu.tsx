"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard" },
        { href: "/logs/pain", label: "Pain logs" },
        { href: "/logs/events", label: "PT & activity" },
        { href: "/settings", label: "Settings" },
    ];

    return (
        <>
            {/* Hamburger button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 -mr-2 rounded-md text-text bg-muted hover:bg-card-2 active:bg-card touch-manipulation flex-shrink-0"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile menu overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-[52px] sm:top-[64px] left-0 right-0 bg-popover border-b border-border shadow-lg z-50 md:hidden">
                        <nav className="flex flex-col">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={
                                            isActive
                                                ? "px-6 py-3 text-text-strong font-semibold border-l-4 border-primary bg-primary-soft"
                                                : "px-6 py-3 text-text-secondary hover:text-text-strong hover:bg-card"
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}

