import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/PageBanner";
import { Organizers } from "@/components/sections/Organizers";
import { BecomeSponsor, Sponsors } from "@/components/sections/Sponsors";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Organización y sponsors | IoT ULEAM 2026",
  description: "Organizadores, aliados y oportunidades de patrocinio del concurso IoT ULEAM.",
};

export default function OrganizationPage() {
  return (
    <>
      <PageBanner
        node="NODE 04 · ALIANZAS"
        title="La red detrás de la experiencia"
        description="Conoce a la organización, nuestros aliados y cómo conectar tu marca con el talento tecnológico del Ecuador."
      />
      <Organizers />
      <Sponsors />
      <BecomeSponsor />
      <Contact />
    </>
  );
}
