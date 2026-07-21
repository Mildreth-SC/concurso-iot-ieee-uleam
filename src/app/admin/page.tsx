import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PageBanner } from "@/components/ui/PageBanner";

export const metadata: Metadata = {
  title: "Panel administrativo | IoT ULEAM 2026",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <PageBanner
        node="CONTROL CENTER · ACCESO RESTRINGIDO"
        title="Panel de inscritos"
        description="Consulta, busca por código único, edita tema/tutor/paper y exporta las inscripciones recibidas por el comité organizador."
      />
      <AdminPanel />
    </>
  );
}
