"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/experiencia", label: "Experiencia" },
  { href: "/bases", label: "Bases" },
  { href: "/inscripcion", label: "Inscripción" },
  { href: "/#premios", label: "Premios" },
  { href: "/organizacion", label: "Organiza y sponsors" },
  { href: "/portal", label: "Mi Panel" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neon-cyan/15 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-sm font-bold tracking-wider text-neon-blue sm:text-base">
          IoT ULEAM <span className="text-text-primary">2026</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-neon-cyan ${
                pathname === link.href ? "text-neon-blue" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/inscripcion"
            className="neon-gradient rounded-full px-4 py-2 text-xs font-semibold text-white sm:text-sm"
          >
            Inscribirse
          </Link>
          <button
            type="button"
            className="rounded-lg border border-neon-cyan/25 p-2 text-neon-cyan lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-neon-cyan/15 bg-white/95 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm hover:bg-neon-cyan/10 hover:text-neon-cyan ${
                  pathname === link.href ? "bg-neon-cyan/10 text-neon-cyan" : "text-text-muted"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
