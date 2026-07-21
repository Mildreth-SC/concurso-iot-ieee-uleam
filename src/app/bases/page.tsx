import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/ui/PageBanner";
import { Bases } from "@/components/sections/Bases";
import { Pricing } from "@/components/sections/Pricing";

export const metadata: Metadata = {
  title: "Bases oficiales | IoT ULEAM 2026",
  description: "Bases, documentación, evaluación, costos y datos oficiales del concurso.",
};

export default function BasesPage() {
  return (
    <>
      <PageBanner
        node="NODE 02 · PROTOCOLO"
        title="Bases oficiales del concurso"
        description="Consulta toda la información, documentación obligatoria, evaluación, premios y política de inscripción."
      />
      <Bases />
      <Pricing />
      <div className="px-4 pb-20 text-center">
        <Link
          href="/inscripcion"
          className="tech-button inline-flex rounded-full px-8 py-3.5 text-sm font-bold text-white"
        >
          Continuar a inscripción
        </Link>
      </div>
    </>
  );
}
