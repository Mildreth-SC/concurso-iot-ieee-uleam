import { GraduationCap } from "lucide-react";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Audience() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="¿A quién va dirigido?"
          subtitle="Estudiantes de pregrado de universidades e institutos técnicos de todo Ecuador."
        />
        <NeonCard className="mx-auto flex max-w-3xl flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neon-blue/20 text-neon-cyan sm:mb-0 sm:mr-6">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <p className="text-text-muted">
              El concurso está abierto a equipos de <strong className="text-text-primary">2 a 4 integrantes</strong>{" "}
              en nivel de pregrado, con un tutor académico que avala formalmente la participación.
              Cada institución puede inscribir hasta <strong className="text-text-primary">2 equipos por categoría</strong>.
            </p>
          </div>
        </NeonCard>
      </div>
    </section>
  );
}
