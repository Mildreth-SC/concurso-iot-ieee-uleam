import {
  Building2,
  HeartPulse,
  Sprout,
  Factory,
  Leaf,
  ArrowUpRight,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/primitives";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  "heart-pulse": HeartPulse,
  sprout: Sprout,
  factory: Factory,
  leaf: Leaf,
};

const categoryVisuals = [
  {
    theme: "cyan",
    signal: "SMART CITY",
    tags: ["Ciudades", "Infraestructura", "Autonomía"],
  },
  {
    theme: "green",
    signal: "BLUE + AGROTECH",
    tags: ["Economía azul", "Acuicultura", "AgroTech 5.0"],
  },
  {
    theme: "orange",
    signal: "INDUSTRY + AIoT",
    tags: ["Industria 4.0", "AIoT", "Gemelos"],
  },
  {
    theme: "magenta",
    signal: "IoMT HEALTH",
    tags: ["IoMT", "Salud", "Predictiva"],
  },
  {
    theme: "violet",
    signal: "CIRCULAR IoT",
    tags: ["Circular", "Residuos", "Minería urbana"],
  },
] as const;

export function Categories() {
  return (
    <section id="categorias" className="categories-zone overflow-hidden px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="5 nodos de impacto"
          subtitle="Categorías oficiales del I Concurso Nacional IoT ULEAM 2026. Elige el nodo donde tu prototipo genera mayor valor."
        />
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <span className="category-legend">
            <Radio className="h-3.5 w-3.5" />
            5 redes oficiales
          </span>
          <span className="category-legend">Prototipos IoT</span>
          <span className="category-legend">Impacto nacional</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? Building2;
            const visual = categoryVisuals[index];
            return (
              <article
                key={cat.id}
                data-theme={visual.theme}
                className={`category-card group ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              >
                <div className="category-card-grid" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="category-icon">
                      <Icon className="h-7 w-7" />
                      <span className="category-icon-pulse" />
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-[9px] tracking-[0.22em] text-neon-blue/50">
                        NODE
                      </span>
                      <strong className="category-number font-display text-2xl">
                        0{index + 1}
                      </strong>
                    </div>
                  </div>

                  <p className="category-signal mt-7 font-mono text-[9px] uppercase tracking-[0.25em]">
                    {visual.signal}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-neon-blue sm:text-xl">
                    {cat.shortName}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">{cat.name}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                    {cat.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {visual.tags.map((tag) => (
                      <span key={tag} className="category-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="category-link mt-6 flex items-center justify-between border-t pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Nodo habilitado
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
