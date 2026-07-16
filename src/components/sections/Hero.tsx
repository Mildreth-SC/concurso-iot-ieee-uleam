"use client";

import { useRef, type PointerEvent } from "react";
import {
  Bluetooth,
  CalendarDays,
  Cloud,
  Cpu,
  Database,
  MapPin,
  Radio,
  RadioTower,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { ORGANIZER } from "@/lib/constants";
import { TechMantaRay } from "@/components/mascot/TechMantaRay";

const particles = [
  [8, 18, 0], [16, 72, 1.4], [28, 34, 2.8], [39, 82, 0.8],
  [52, 16, 3.2], [63, 68, 1.9], [74, 28, 4.1], [84, 78, 2.3],
  [92, 42, 0.5], [47, 48, 3.8], [21, 55, 4.5], [69, 90, 1.1],
] as const;

const iotNodes: Array<{ icon: LucideIcon; label: string; className: string }> = [
  { icon: Wifi, label: "WiFi", className: "iot-node-1" },
  { icon: Cloud, label: "Cloud", className: "iot-node-2" },
  { icon: Cpu, label: "AIoT", className: "iot-node-3" },
  { icon: RadioTower, label: "5G", className: "iot-node-4" },
  { icon: Database, label: "Data", className: "iot-node-5" },
  { icon: Bluetooth, label: "BLE", className: "iot-node-6" },
];

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current?.style.setProperty("--pointer-x", `${x * 72}px`);
    stageRef.current?.style.setProperty("--pointer-y", `${y * 46}px`);
    stageRef.current?.style.setProperty("--pointer-rx", `${y * -8}deg`);
    stageRef.current?.style.setProperty("--pointer-ry", `${x * 11}deg`);
  }

  function resetPointer() {
    stageRef.current?.style.setProperty("--pointer-x", "0px");
    stageRef.current?.style.setProperty("--pointer-y", "0px");
    stageRef.current?.style.setProperty("--pointer-rx", "0deg");
    stageRef.current?.style.setProperty("--pointer-ry", "0deg");
  }

  return (
    <section
      className="hero-tech relative min-h-[calc(100vh-73px)] overflow-hidden px-4 py-14 sm:py-20"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="hero-aurora pointer-events-none absolute inset-0" />
      <div className="hero-scanline pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        {particles.map(([left, top, delay], index) => (
          <i
            key={index}
            className="data-particle absolute h-1 w-1 rounded-full bg-neon-cyan"
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-6">
        <div className="hero-copy text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/35 bg-neon-cyan/8 px-4 py-2 text-xs font-medium text-neon-cyan backdrop-blur-md sm:text-sm">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            Organiza: {ORGANIZER.branch}
          </span>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.32em] text-neon-cyan/75">
            // Conectando ideas con el futuro
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-wide sm:text-6xl lg:text-[4.4rem]">
            <span className="glow-text text-neon-cyan">I Concurso</span>
            <br />
            <span className="text-text-primary">Nacional IoT</span>
            <span className="mt-2 block bg-gradient-to-r from-neon-cyan via-white to-neon-blue bg-clip-text text-2xl text-transparent sm:text-4xl">
              ULEAM 2026
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg lg:mx-0">
            Entra a la experiencia IoT: conoce las bases, elige tu nodo de impacto,
            conecta tu equipo y compite a nivel nacional.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="/inscripcion"
              className="tech-button group relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-bold text-bg-dark sm:text-base"
            >
              <span className="relative z-10">Inscribirse</span>
            </a>
            <a
              href="/experiencia"
              className="rounded-full border border-neon-cyan/35 bg-white/[0.02] px-8 py-3.5 text-sm font-medium text-neon-cyan backdrop-blur-sm transition-all hover:border-neon-cyan hover:bg-neon-cyan/10 sm:text-base"
            >
              Explorar la experiencia
            </a>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 text-left sm:max-w-xl">
            <div className="hero-stat">
              <CalendarDays className="h-4 w-4 text-neon-cyan" />
              <div><span>Gran final</span><strong>11 NOV 2026</strong></div>
            </div>
            <div className="hero-stat">
              <MapPin className="h-4 w-4 text-neon-cyan" />
              <div><span>Sede</span><strong>ULEAM · MANTA</strong></div>
            </div>
          </div>
        </div>

        <div ref={stageRef} className="manta-stage relative mx-auto w-full max-w-2xl">
          <div className="hud-ring hud-ring-outer" />
          <div className="hud-ring hud-ring-inner" />
          <div className="hud-crosshair" />
          <div className="iot-orbit" aria-hidden>
            {iotNodes.map(({ icon: Icon, label, className }) => (
              <div key={label} className={`iot-orbit-node ${className}`}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="hud-label left-2 top-[22%] sm:left-8">
            <span>STATUS</span><strong>ONLINE</strong>
          </div>
          <div className="hud-label right-2 top-[65%] text-right sm:right-8">
            <span>RED IoT</span><strong>5 CATEGORÍAS</strong>
          </div>
          <div className="manta-interactive manta-video-shell relative z-10 mx-auto w-full">
            <TechMantaRay className="code-manta h-auto w-full" />
            <span className="manta-video-scan" />
            <span className="manta-lens manta-lens-a" />
            <span className="manta-lens manta-lens-b" />
            <span className="manta-video-noise" />
          </div>
          <div className="mx-auto -mt-5 flex w-fit items-center gap-2 rounded-full border border-neon-cyan/20 bg-bg-dark/70 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-neon-cyan backdrop-blur-md">
            <Wifi className="h-3.5 w-3.5" />
            MANTA NODE · ACTIVE
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-text-muted/60">
        Descubre
        <span className="scroll-indicator h-8 w-px bg-gradient-to-b from-neon-cyan to-transparent" />
      </div>
    </section>
  );
}
