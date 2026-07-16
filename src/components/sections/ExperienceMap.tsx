import { EXPERIENCE_NODES } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function ExperienceMap() {
  return (
    <section id="mision" className="relative px-4 py-20 scroll-mt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Experiencia IoT"
          subtitle="Esto no es solo una landing: es una misión conectada. Explora cada nodo de la red para conocer el concurso, las reglas y cómo unirte."
        />

        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-neon-cyan via-neon-blue to-transparent md:left-1/2 md:block" />
          <div className="grid gap-4 md:grid-cols-5">
            {EXPERIENCE_NODES.map((node, index) => (
              <a key={node.id} href={node.href} className="group block">
                <NeonCard className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.2em] text-neon-cyan">
                      NODE {node.code}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_12px_#00d4ff] group-hover:animate-pulse" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {node.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {node.description}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-neon-cyan/80">
                    Acceder →
                  </p>
                  {index < EXPERIENCE_NODES.length - 1 && (
                    <span className="mt-3 block font-mono text-[10px] text-text-muted/50 md:hidden">
                      signal → next node
                    </span>
                  )}
                </NeonCard>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <NeonCard>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
              Señal de entrada
            </p>
            <p className="mt-3 text-sm text-text-muted">
              Diseña un prototipo IoT funcional, documenta en formato IEEE y compite a nivel nacional.
            </p>
          </NeonCard>
          <NeonCard>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
              Red de impacto
            </p>
            <p className="mt-3 text-sm text-text-muted">
              Cinco categorías, evaluación técnica y defensa presencial en ULEAM, Manta.
            </p>
          </NeonCard>
          <NeonCard>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
              Operador
            </p>
            <p className="mt-3 text-sm text-text-muted">
              Organiza la Rama Estudiantil IEEE ULEAM de la Universidad Laica Eloy Alfaro de Manabí.
            </p>
          </NeonCard>
        </div>
      </div>
    </section>
  );
}
