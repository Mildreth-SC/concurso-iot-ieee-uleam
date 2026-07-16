"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Handshake, Sparkles, Mail } from "lucide-react";
import { CONTACT_EMAIL, SPONSOR_TIERS } from "@/lib/constants";
import { SectionHeading, NeonCard } from "@/components/ui/primitives";
import type { SponsorItem } from "@/lib/site-content";

export function Sponsors() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);

  useEffect(() => {
    void fetch("/api/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSponsors(data.sponsors ?? []))
      .catch(() => setSponsors([]));
  }, []);

  return (
    <section id="sponsors" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Sponsors que se unen"
          subtitle="Marcas e instituciones que impulsan la red IoT del concurso."
        />

        {sponsors.length === 0 ? (
          <NeonCard className="text-center">
            <p className="text-sm text-text-muted">
              Pronto se publicarán aquí los sponsors que se sumen al concurso.
            </p>
            <a
              href="#patrocinar"
              className="mt-4 inline-block text-sm text-neon-cyan hover:underline"
            >
              ¿Quieres ser el primero? Conoce los paquetes →
            </a>
          </NeonCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <NeonCard key={sponsor.id} className="flex items-start gap-4">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-neon-cyan/20 bg-white/5">
                  {sponsor.logo ? (
                    <Image
                      src={sponsor.logo.split("?")[0]}
                      alt={sponsor.name}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold text-neon-cyan">
                      {sponsor.name.slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                    {sponsor.tier}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-text-primary">
                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neon-cyan"
                      >
                        {sponsor.name}
                      </a>
                    ) : (
                      sponsor.name
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">{sponsor.description}</p>
                </div>
              </NeonCard>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-text-muted">
          ¿Tu organización quiere aparecer aquí?{" "}
          <a href="#patrocinar" className="text-neon-cyan hover:underline">
            Elige tu tipo de patrocinio
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export function BecomeSponsor() {
  return (
    <section id="patrocinar" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Tipos de patrocinio"
          subtitle="Cada paquete incluye el valor de un premio por categoría. Elige el modo y adjunta el premio correspondiente."
        />

        <NeonCard className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Handshake className="mt-1 h-6 w-6 shrink-0 text-neon-cyan" />
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  ¿Quieres ser sponsor?
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-text-muted">
                  Cada modo de patrocinio está vinculado a un premio oficial:
                  Oro financia 1° lugar ($300), Plata 2° lugar ($200) y Cian 3° lugar ($100)
                  por categoría. Selecciona el paquete y coordina con nosotros.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Quiero%20ser%20sponsor%20-%20Concurso%20IoT%20ULEAM%202026`}
              className="tech-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-bg-dark"
            >
              Contactar organización
            </a>
          </div>
        </NeonCard>

        <div className="grid gap-5 lg:grid-cols-3">
          {SPONSOR_TIERS.map((tier) => (
            <NeonCard
              key={tier.id}
              className={`sponsor-tier sponsor-${tier.color} relative overflow-hidden`}
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-neon-cyan/10 blur-2xl" />
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/5 px-3 py-1 text-xs text-neon-cyan">
                <Sparkles className="h-3.5 w-3.5" />
                {tier.type}
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{tier.investment}</p>

              <div className="mt-4 rounded-xl border border-current/20 bg-white/[0.04] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                  Premio adjunto
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-text-primary">
                  {tier.prizeAmount}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {tier.prizePlace} · {tier.prizeNote}
                </p>
              </div>

              <ul className="mt-4 space-y-2">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm text-text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-blue" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  `Patrocinio ${tier.name} (${tier.prizePlace} ${tier.prizeAmount}) - IoT ULEAM 2026`,
                )}&body=${encodeURIComponent(
                  `Hola, somos una organización interesada en el paquete ${tier.name} (${tier.type}) del I Concurso Nacional IoT ULEAM 2026.\n\nDeseamos adjuntar el premio de ${tier.prizePlace}: ${tier.prizeAmount} por categoría.\n\nNombre de la empresa:\nContacto:\nTeléfono:\nCategoría de interés (opcional):\nMensaje:\n`,
                )}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-neon-cyan/35 px-4 py-2.5 text-sm font-medium text-neon-cyan transition-colors hover:bg-neon-cyan/10"
              >
                <Mail className="h-4 w-4" />
                Quiero este patrocinio
              </a>
            </NeonCard>
          ))}
        </div>
      </div>
    </section>
  );
}
