import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/PageBanner";
import { About } from "@/components/sections/About";
import { Categories } from "@/components/sections/Categories";
import { Audience } from "@/components/sections/Audience";
import { Requirements } from "@/components/sections/Requirements";
import { Timeline } from "@/components/sections/Timeline";
import { Prizes } from "@/components/sections/Prizes";
import { Evaluation } from "@/components/sections/Evaluation";

export const metadata: Metadata = {
  title: "Experiencia y cronograma | IoT ULEAM 2026",
  description: "Categorías, requisitos y cronograma interactivo del Concurso Nacional IoT ULEAM.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageBanner
        node="NODE 01 · EXPERIENCIA"
        title="Tu misión IoT comienza aquí"
        description="Explora categorías, requisitos, premios y el estado en tiempo real de cada etapa del concurso."
      />
      <About />
      <Categories />
      <Audience />
      <Requirements />
      <Timeline />
      <Prizes />
      <Evaluation />
    </>
  );
}
