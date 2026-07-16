import { Mail, ExternalLink, Building2 } from "lucide-react";
import { CONTACT_EMAIL, IEEE_WEB_URL, ORGANIZER } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Contact() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="contacto"
          title="Contacto"
          subtitle="¿Tienes dudas? Escríbenos."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <NeonCard className="flex items-start gap-4">
            <Building2 className="mt-1 h-6 w-6 shrink-0 text-neon-cyan" />
            <div>
              <h3 className="font-medium">Organiza</h3>
              <p className="mt-1 text-sm text-neon-cyan">{ORGANIZER.branch}</p>
              <p className="mt-1 text-xs text-text-muted">
                {ORGANIZER.university} ({ORGANIZER.shortUniversity})
              </p>
            </div>
          </NeonCard>
          <NeonCard className="flex items-start gap-4">
            <Mail className="mt-1 h-6 w-6 shrink-0 text-neon-cyan" />
            <div>
              <h3 className="font-medium">Correo electrónico</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 block text-neon-cyan hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </NeonCard>
          <NeonCard className="flex items-start gap-4">
            <ExternalLink className="mt-1 h-6 w-6 shrink-0 text-neon-cyan" />
            <div>
              <h3 className="font-medium">Sitio web IEEE ULEAM</h3>
              <a
                href={IEEE_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-neon-cyan hover:underline"
              >
                edu.ieee.org/ec-uleam
              </a>
            </div>
          </NeonCard>
        </div>
      </div>
    </section>
  );
}
