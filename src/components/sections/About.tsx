import { ORGANIZER } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function About() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="sobre"
          title="La misión"
          subtitle="El I Concurso Nacional IoT ULEAM es una experiencia tecnológica para convertir ideas conectadas en prototipos con impacto nacional."
        />
        <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <NeonCard>
            <p className="leading-relaxed text-text-muted">
              Aquí no solo te inscribes: entras a una red. Diseñas sensores, datos, automatización
              e interfaces; documentas en formato IEEE; y demuestras tu solución ante jurado.
              El objetivo es impulsar IoT aplicado a desafíos reales de Ecuador.
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              La experiencia incluye desarrollo del proyecto, evaluación documental (Rúbrica A),
              selección de finalistas y defensa presencial el 11 de noviembre de 2026 en la{" "}
              {ORGANIZER.university} ({ORGANIZER.shortUniversity}), {ORGANIZER.city}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/bases"
                className="rounded-full border border-neon-cyan/40 px-5 py-2 text-sm font-medium text-neon-cyan hover:bg-neon-cyan/10"
              >
                Ver bases completas
              </a>
              <a
                href="/inscripcion"
                className="tech-button rounded-full px-5 py-2 text-sm font-bold text-white"
              >
                Inscribir equipo
              </a>
            </div>
          </NeonCard>

          <NeonCard className="bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-blue/10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
              Flujo de la misión
            </p>
            <ol className="mt-5 space-y-4">
              {[
                "Elige un nodo (categoría)",
                "Construye tu prototipo IoT",
                "Entrega informe IEEE",
                "Supera evaluación y defiende en Manta",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-text-muted">
                  <span className="font-mono text-neon-cyan">0{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </NeonCard>
        </div>
      </div>
    </section>
  );
}
