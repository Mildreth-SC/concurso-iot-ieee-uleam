import { Users, UserCheck, FileText, Building } from "lucide-react";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

const requirements = [
  {
    icon: Users,
    title: "Equipos de 2 a 4 integrantes",
    description: "Todos en nivel de pregrado con matrícula vigente.",
  },
  {
    icon: UserCheck,
    title: "Tutor académico",
    description: "Docente que avala la participación con carta firmada.",
  },
  {
    icon: FileText,
    title: "Informe técnico IEEE",
    description: "Documento PDF de 6 a 10 páginas con el proyecto.",
  },
  {
    icon: Building,
    title: "Límite por institución",
    description: "Máximo 2 equipos por institución en cada categoría.",
  },
];

export function Requirements() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Requisitos"
          subtitle="Documentación y condiciones para participar en el concurso."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {requirements.map((req) => (
            <NeonCard key={req.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/10 text-neon-cyan">
                <req.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">{req.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{req.description}</p>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>
    </section>
  );
}
