import { FileDown, ShieldCheck } from "lucide-react";
import { BASES_SECTIONS, BANK_DETAILS, EVENT, ORGANIZER } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Bases() {
  return (
    <section id="bases" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Bases del concurso"
          subtitle="Toda la información oficial del I Concurso Nacional IoT ULEAM 2026. Lee el protocolo completo antes de inscribirte."
        />

        <NeonCard className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-neon-cyan" />
            <div>
              <p className="font-medium text-text-primary">Documento oficial</p>
              <p className="mt-1 text-sm text-text-muted">
                Organiza: {ORGANIZER.branch} · {ORGANIZER.university}. Presentación:{" "}
                {EVENT.presentationDate} en {EVENT.presentationLocation}.
              </p>
            </div>
          </div>
          <a
            href="/bases-concurso-iot-uleam-2026.pdf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neon-cyan/40 px-5 py-2.5 text-sm font-medium text-neon-cyan transition-colors hover:bg-neon-cyan/10"
          >
            <FileDown className="h-4 w-4" />
            Descargar PDF
          </a>
        </NeonCard>

        <div className="grid gap-5 lg:grid-cols-2">
          {BASES_SECTIONS.map((section) => (
            <NeonCard key={section.title}>
              <h3 className="font-display text-base font-semibold text-neon-cyan">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </NeonCard>
          ))}
        </div>

        <NeonCard className="mt-6">
          <h3 className="font-display text-base font-semibold text-neon-cyan">
            Datos bancarios (equipos no IEEE)
          </h3>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-text-muted">Valor</dt>
              <dd className="font-medium text-text-primary">{BANK_DETAILS.amount}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Banco</dt>
              <dd className="font-medium text-text-primary">{BANK_DETAILS.bank}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Tipo de cuenta</dt>
              <dd className="font-medium text-text-primary">{BANK_DETAILS.accountType}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Número</dt>
              <dd className="font-mono font-medium text-text-primary">
                {BANK_DETAILS.accountNumber}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-text-muted">Titular</dt>
              <dd className="font-medium text-text-primary">{BANK_DETAILS.holder}</dd>
            </div>
          </dl>
        </NeonCard>
      </div>
    </section>
  );
}
