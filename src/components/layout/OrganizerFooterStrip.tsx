"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { OrganizerItem } from "@/lib/site-content";

function OrganizerLogo({ organizer }: { organizer: OrganizerItem }) {
  const [failed, setFailed] = useState(false);
  const src = organizer.image?.split("?")[0] || "";

  return (
    <div className="organizer-logo-card">
      <div className="relative flex h-20 items-center justify-center">
        {!failed && src ? (
          <Image
            src={src}
            alt={`Logo ${organizer.name}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 45vw, 20vw"
            className="object-contain p-2"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-display text-lg font-bold text-neon-cyan">
            {organizer.short}
          </span>
        )}
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-text-muted">
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

  return (
    <section className="border-t border-neon-cyan/15 bg-white px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-cyan">
            Red organizadora
          </p>
          <h2 className="mt-3 font-display text-xl font-semibold text-text-primary sm:text-2xl">
            Organizan
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {organizers.map((organizer) => (
            <OrganizerLogo key={organizer.id} organizer={organizer} />
          ))}
        </div>
      </div>
    </section>
  );
}
