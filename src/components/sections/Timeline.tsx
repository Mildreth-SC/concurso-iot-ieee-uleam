"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Radio, Signal } from "lucide-react";
import { TIMELINE } from "@/lib/constants";
import { NeonCard, SectionHeading } from "@/components/ui/primitives";

type TimelineStatus = "completed" | "active" | "upcoming";

export function Timeline() {
  const now = useMemo(() => new Date(), []);
  const statuses = useMemo<TimelineStatus[]>(
    () =>
      TIMELINE.map((item) => {
        if (now > new Date(item.end)) return "completed";
        if (now >= new Date(item.start)) return "active";
        return "upcoming";
      }),
    [now],
  );
  const activeIndex = statuses.findIndex((status) => status === "active");
  const fallbackIndex = statuses.lastIndexOf("completed");
  const initialIndex = activeIndex >= 0 ? activeIndex : Math.max(fallbackIndex, 0);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const completedThrough = Math.max(
    statuses.lastIndexOf("completed"),
    statuses.findIndex((status) => status === "active"),
  );
  const progress = Math.max(0, (completedThrough / (TIMELINE.length - 1)) * 100);
  const nextIndex = statuses.findIndex((status) => status === "upcoming");
  const nextEvent = nextIndex >= 0 ? TIMELINE[nextIndex] : null;
  const daysToNext = nextEvent
    ? Math.max(0, Math.ceil((new Date(nextEvent.start).getTime() - now.getTime()) / 86_400_000))
    : 0;

  return (
    <section id="cronograma" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Cronograma en tiempo real"
          subtitle="La red avanza automáticamente: las etapas completadas cambian de color, la fase actual pulsa y las próximas permanecen en espera."
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <NeonCard>
            <div className="flex items-center gap-2 text-neon-cyan">
              <Radio className="h-4 w-4 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Estado de red</span>
            </div>
            <p className="mt-3 font-display text-lg text-text-primary">
              {statuses.includes("active") ? "MISIÓN ACTIVA" : "PRÓXIMA ACTIVACIÓN"}
            </p>
          </NeonCard>
          <NeonCard>
            <div className="flex items-center gap-2 text-neon-cyan">
              <Signal className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Progreso</span>
            </div>
            <p className="mt-3 font-display text-lg text-text-primary">{Math.round(progress)}%</p>
          </NeonCard>
          <NeonCard>
            <div className="flex items-center gap-2 text-neon-cyan">
              <Clock3 className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Siguiente nodo</span>
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary">
              {nextEvent ? `${nextEvent.title} · ${daysToNext} días` : "Misión completada"}
            </p>
          </NeonCard>
        </div>

        <div className="timeline-zigzag relative mx-auto max-w-5xl py-4">
          <div className="absolute bottom-10 left-[27px] top-10 w-1 rounded-full bg-white/8 md:left-1/2 md:-translate-x-1/2">
            <div
              className="timeline-progress h-full origin-top rounded-full bg-gradient-to-b from-neon-blue via-neon-cyan to-neon-green shadow-[0_0_18px_rgba(0,212,255,.5)]"
              style={{ transform: `scaleY(${progress / 100})` }}
            />
          </div>

          <div className="space-y-7 md:space-y-3">
            {TIMELINE.map((item, index) => {
              const status = statuses[index];
              const isSelected = selectedIndex === index;
              const goesLeft = index % 2 === 0;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="group grid w-full grid-cols-[56px_1fr] items-start gap-4 text-left md:grid-cols-[1fr_76px_1fr] md:gap-6"
                  aria-pressed={isSelected}
                >
                  <span
                    className={`relative z-10 col-start-1 row-start-1 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all md:col-start-2 md:justify-self-center ${
                      status === "completed"
                        ? "border-neon-blue bg-neon-blue text-white shadow-[0_0_18px_rgba(0,102,255,.5)]"
                        : status === "active"
                          ? "timeline-active-node border-neon-cyan bg-neon-cyan text-bg-dark"
                          : "border-white/20 bg-bg-dark text-text-muted"
                    }`}
                  >
                    {status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-mono text-xs">0{index + 1}</span>
                    )}
                  </span>

                  <span
                    className={`col-start-2 row-start-1 rounded-2xl border p-5 transition-all md:col-span-1 ${
                      goesLeft
                        ? "md:col-start-1 md:text-right"
                        : "md:col-start-3 md:text-left"
                    } ${
                      isSelected
                        ? "border-neon-cyan/60 bg-neon-cyan/8 shadow-[0_0_32px_rgba(0,212,255,.12)]"
                        : "border-white/8 bg-white/[0.025] hover:border-neon-cyan/35 hover:bg-neon-cyan/5"
                    }`}
                  >
                    <span
                      className={`flex flex-wrap items-center gap-2 ${
                        goesLeft ? "md:justify-end" : ""
                      }`}
                    >
                      <time
                        className={`text-[10px] font-semibold uppercase tracking-[0.17em] ${
                          status === "upcoming" ? "text-text-muted/60" : "text-neon-cyan"
                        }`}
                      >
                        {item.date}
                      </time>
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider ${
                          status === "completed"
                            ? "bg-neon-blue/15 text-neon-blue"
                            : status === "active"
                              ? "bg-neon-cyan/15 text-neon-cyan"
                              : "bg-white/5 text-text-muted"
                        }`}
                      >
                        {status === "completed"
                          ? "Completado"
                          : status === "active"
                            ? "En curso"
                            : "Próximo"}
                      </span>
                    </span>
                    <span className="mt-3 block font-display text-base font-semibold text-text-primary">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-text-muted">
                      {item.description}
                    </span>
                    {isSelected && (
                      <span className="mt-4 block rounded-lg border border-neon-cyan/15 bg-neon-cyan/5 p-3 text-xs leading-relaxed text-text-muted">
                        <strong className="mb-1 block uppercase tracking-wider text-neon-cyan">
                          Qué sucede
                        </strong>
                        {item.action}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
