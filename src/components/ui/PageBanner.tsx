import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageBanner({
  node,
  title,
  description,
}: {
  node: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-neon-cyan/15 bg-white/55 px-4 py-14 sm:py-20">
      <div className="hero-aurora pointer-events-none absolute inset-0 opacity-55" />
      <div className="relative mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-muted transition-colors hover:text-neon-cyan"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a la red
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
          {node}
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-3xl font-bold text-text-primary sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
