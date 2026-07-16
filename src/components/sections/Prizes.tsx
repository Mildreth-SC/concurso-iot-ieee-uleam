import { Trophy, Medal, Award } from "lucide-react";
import { CATEGORIES, PRIZE_PLACES } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

const placeIcons = {
  1: Trophy,
  2: Medal,
  3: Award,
} as const;

export function Prizes() {
  return (
    <section id="premios" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Premios por categoría y lugar"
          subtitle="Se premian 1°, 2° y 3° lugar en cada una de las 5 categorías oficiales del concurso."
        />

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {PRIZE_PLACES.map((prize) => {
            const Icon = placeIcons[prize.rank as 1 | 2 | 3];
            return (
              <NeonCard
                key={prize.place}
                className={`prize-card prize-${prize.accent} relative overflow-hidden`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="prize-icon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                    Por categoría
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary">
                  {prize.place}
                </h3>
                <ul className="mt-4 space-y-2">
                  {prize.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </NeonCard>
            );
          })}
        </div>

        <NeonCard>
          <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
            Premiación en las 5 categorías
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
              >
                <p className="font-mono text-[9px] tracking-[0.2em] text-neon-cyan">
                  CAT 0{index + 1}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
                  {category.shortName}
                </p>
                <p className="mt-3 text-[11px] text-text-muted">
                  1° · 2° · 3° lugar
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-text-muted">
            Ceremonia de premiación: 11 de noviembre de 2026 · ULEAM, Manta.
          </p>
        </NeonCard>
      </div>
    </section>
  );
}
