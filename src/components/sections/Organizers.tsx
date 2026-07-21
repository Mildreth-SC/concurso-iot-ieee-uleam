import { Building2, Mail, Network } from "lucide-react";
import { IEEE_WEB_URL, ORGANIZER, ORGANIZING_TEAM } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Organizers() {
  return (
    <section id="organizadores" className="bg-white px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Quiénes organizan"
          subtitle="Una red formada por IEEE ULEAM, WIE ULEAM, la Facultad de Ciencias de la Vida y Tecnologías y la Universidad Laica Eloy Alfaro de Manabí."
        />

        <NeonCard className="mb-8 overflow-hidden">
          <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
                Operador principal
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-text-primary">
                {ORGANIZER.branch}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                Comunidad estudiantil IEEE que conecta talento universitario con innovación
                tecnológica. Gestionamos la convocatoria, evaluación, logística y premiación
                del I Concurso Nacional IoT ULEAM 2026.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={`mailto:${ORGANIZER.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 px-4 py-2 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  <Mail className="h-4 w-4" />
                  {ORGANIZER.email}
                </a>
                <a
                  href={IEEE_WEB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 px-4 py-2 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  <Network className="h-4 w-4" />
                  edu.ieee.org/ec-uleam
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-5">
              <Building2 className="h-8 w-8 text-neon-cyan" />
              <p className="mt-4 text-sm text-text-muted">Universidad sede</p>
              <p className="mt-1 font-display text-lg font-semibold text-text-primary">
                {ORGANIZER.university}
              </p>
              <p className="mt-1 text-sm text-neon-cyan">
                {ORGANIZER.shortUniversity} · {ORGANIZER.city}
              </p>
            </div>
          </div>
        </NeonCard>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ORGANIZING_TEAM.map((member) => (
            <NeonCard key={member.name}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                {member.role}
              </p>
              <h3 className="mt-3 font-medium text-text-primary">{member.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{member.detail}</p>
            </NeonCard>
          ))}
        </div>
      </div>
    </section>
  );
}
