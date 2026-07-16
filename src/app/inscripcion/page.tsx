import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/PageBanner";
import { RegistrationForm } from "@/components/form/RegistrationForm";

export const metadata: Metadata = {
  title: "Inscripción | IoT ULEAM 2026",
  description: "Formulario oficial de inscripción al I Concurso Nacional IoT ULEAM 2026.",
};

export default function RegistrationPage() {
  return (
    <>
      <PageBanner
        node="NODE 03 · CONEXIÓN"
        title="Conecta tu equipo"
        description="Completa la inscripción y transmite los documentos de tu proyecto a la red oficial del concurso."
      />
      <RegistrationForm />
    </>
  );
}
