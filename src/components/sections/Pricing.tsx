import { BANK_DETAILS, EVENT } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";

export function Pricing() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="inscripcion"
          title="Inscripción y costos"
          subtitle="Política oficial de inscripción al concurso."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <NeonCard className="border-neon-cyan/50">
            <h3 className="font-display text-lg font-semibold text-neon-cyan">
              Miembros IEEE vigentes
            </h3>
            <p className="mt-2 text-3xl font-bold text-text-primary">{EVENT.ieeeCost}</p>
            <p className="mt-3 text-sm text-text-muted">
              Presenta tu número de membresía IEEE vigente. Verificaremos tu membresía.
              No se requiere comprobante de pago.
            </p>
          </NeonCard>
          <NeonCard className="border-neon-blue/50">
            <h3 className="font-display text-lg font-semibold text-neon-blue">
              Equipos sin miembros IEEE
            </h3>
            <p className="mt-2 text-3xl font-bold text-text-primary">{EVENT.nonIeeeCost}</p>
            <p className="mt-3 text-sm text-text-muted">
              Realiza el depósito o transferencia y adjunta el comprobante en el formulario.
            </p>
          </NeonCard>
        </div>

        <NeonCard className="mt-6">
          <h4 className="font-medium text-neon-cyan">Datos bancarios</h4>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-text-muted">Valor de inscripción</dt>
              <dd className="font-medium">{BANK_DETAILS.amount}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Banco</dt>
              <dd className="font-medium">{BANK_DETAILS.bank}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Tipo de cuenta</dt>
              <dd className="font-medium">{BANK_DETAILS.accountType}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Número de cuenta</dt>
              <dd className="font-mono font-medium">{BANK_DETAILS.accountNumber}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-text-muted">Titular</dt>
              <dd className="font-medium">{BANK_DETAILS.holder}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-amber-400">
            Es obligatorio adjuntar el comprobante de pago para validar la inscripción.
          </p>
        </NeonCard>
      </div>
    </section>
  );
}
