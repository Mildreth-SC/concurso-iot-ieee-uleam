import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  ArrowUpRight,
  DollarSign,
  FileBadge,
  Zap,
  Megaphone,
  BadgeCheck,
  Target,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, PRIZE_PLACES } from "@/lib/constants";
import { CategoryIcon } from "@/lib/category-icons";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";
import { HorizontalMarquee } from "@/components/ui/HorizontalMarquee";

const placeIcons = {
  1: Trophy,
  2: Medal,
  3: Award,
} as const;

function prizeItemIcon(text: string): LucideIcon {
  if (text.includes("$")) return DollarSign;
  if (/trofeo/i.test(text)) return Trophy;
  if (/membresía|ieee/i.test(text)) return Zap;
  if (/mención/i.test(text)) return Megaphone;
  if (/reconocimiento/i.test(text)) return BadgeCheck;
  return FileBadge;
}

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
                <div className="pointer-events-none absolute -right-3 -top-3 opacity-[0.12]">
                  <Icon className="h-24 w-24" strokeWidth={1.25} />
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="prize-icon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`prize-rank-pill prize-rank-${prize.accent}`}>
                    {prize.rank}°
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary">
                  {prize.place}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {prize.items.map((item) => {
                    const ItemIcon = prizeItemIcon(item);
                    return (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-text-muted">
                        <span className="prize-item-icon">
                          <ItemIcon className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </NeonCard>
            );
          })}
        </div>

        <NeonCard>
          <p className="mb-5 flex items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
            <Target className="h-3.5 w-3.5" />
            Premiación en las 5 categorías
          </p>

          <HorizontalMarquee duration={42} className="mb-6 lg:hidden">
            {CATEGORIES.map((category, index) => (
              <CategoryPrizeCard key={category.id} category={category} index={index} />
            ))}
          </HorizontalMarquee>

          <div className="hidden gap-3 lg:grid lg:grid-cols-5">
            {CATEGORIES.map((category, index) => (
              <CategoryPrizeCard key={category.id} category={category} index={index} />
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
            <CalendarDays className="h-3.5 w-3.5 text-neon-cyan" />
            Ceremonia de premiación: 11 de noviembre de 2026 · ULEAM, Manta.
          </p>
        </NeonCard>
      </div>
    </section>
  );
}

function CategoryPrizeCard({
  category,
  index,
}: {
  category: (typeof CATEGORIES)[number];
  index: number;
}) {
  return (
    <div className="flex min-w-[220px] flex-col rounded-xl border border-neon-blue/15 bg-[#E8F4FD] p-4 text-center lg:min-w-0">
      <div className="category-icon mx-auto">
        <CategoryIcon iconKey={category.icon} className="h-7 w-7" />
        <span className="category-icon-pulse" />
      </div>
      <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-neon-cyan">
        CAT 0{index + 1}
      </p>
      <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
        {category.shortName}
      </p>
      <p className="mt-2 text-[11px] leading-snug text-text-muted">
        {category.description}
      </p>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <span className="prize-rank-pill prize-rank-gold">1°</span>
        <span className="prize-rank-pill prize-rank-silver">2°</span>
        <span className="prize-rank-pill prize-rank-bronze">3°</span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/experiencia#cat-${category.id}`}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-neon-blue/20 bg-white px-3 py-2 text-[11px] font-medium text-neon-blue transition-colors hover:border-neon-cyan/40 hover:bg-[#F0F8FF]"
        >
          Ver categoría
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        <Link
          href={`/inscripcion?category=${category.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-neon-blue px-3 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Inscribirse aquí
        </Link>
      </div>
    </div>
  );
}
