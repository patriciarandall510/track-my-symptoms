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
                className="md:hidden p-2 -mr-2 rounded-md text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 touch-manipulation flex-shrink-0"
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
                    <div className="fixed top-[52px] sm:top-[64px] left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 md:hidden">
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
                                                ? "px-6 py-3 text-slate-900 font-semibold border-l-4 border-blue-600 bg-blue-50"
                                                : "px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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

