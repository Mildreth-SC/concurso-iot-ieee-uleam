"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { OrganizerItem } from "@/lib/site-content";
import { HorizontalMarquee } from "@/components/ui/HorizontalMarquee";

function OrganizerLogo({ organizer }: { organizer: OrganizerItem }) {
  const [failed, setFailed] = useState(false);
  const src = organizer.image?.split("?")[0] || "";

  return (
    <div className="organizer-logo-card organizer-marquee-card">
      <div className="relative flex h-28 w-full items-center justify-center">
        {!failed && src ? (
          <Image
            src={src}
            alt={`Logo ${organizer.name}`}
            fill
            unoptimized
            sizes="260px"
            className="object-contain p-1"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-display text-lg font-bold text-neon-cyan">
            {organizer.short}
          </span>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-semibold leading-snug text-text-primary">
        {organizer.name}
      </p>
    </div>
  );
}

export function OrganizerFooterStrip() {
  const [organizers, setOrganizers] = useState<OrganizerItem[]>([]);

  useEffect(() => {
    void fetch("/api/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setOrganizers(data.organizers ?? []))
      .catch(() => setOrganizers([]));
  }, []);

  if (organizers.length === 0) return null;

  return (
    <section className="organizer-marquee-section border-t border-neon-cyan/15 bg-white py-14">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-cyan">
          Red organizadora
        </p>
        <h2 className="mt-3 font-display text-xl font-semibold text-text-primary sm:text-2xl">
          Organizan
        </h2>
        <p className="mt-2 text-xs text-text-muted">
          Desplazamiento automático · pasa el cursor para pausar
        </p>
      </div>

      <HorizontalMarquee duration={24} repeat={3} className="organizer-marquee-viewport">
        {organizers.map((organizer) => (
          <OrganizerLogo key={organizer.id} organizer={organizer} />
        ))}
      </HorizontalMarquee>
    </section>
  );
}
