import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Evaluation() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Evaluación"
          subtitle="Sistema de puntuación en dos fases."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <NeonCard>
            <div className="mb-2 text-3xl font-display font-bold text-neon-cyan">20 pts</div>
            <h3 className="font-display text-lg font-semibold">Rúbrica A — Informe</h3>
            <p className="mt-2 text-sm text-text-muted">
              Evaluación documental del informe técnico IEEE entre el 12 y 25 de octubre de 2026.
              Determina la selección de finalistas.
            </p>
          </NeonCard>
          <NeonCard>
            <div className="mb-2 text-3xl font-display font-bold text-neon-blue">10 pts</div>
            <h3 className="font-display text-lg font-semibold">Rúbrica B — Defensa</h3>
            <p className="mt-2 text-sm text-text-muted">
              Presentación y defensa presencial el 11 de noviembre de 2026 en ULEAM, Manta.
              Incluye demostración del prototipo y respuesta a jurado.
            </p>
          </NeonCard>
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          Puntuación total máxima: <span className="font-semibold text-neon-cyan">30 puntos</span>
        </p>
      </div>
    </section>
  );
}
