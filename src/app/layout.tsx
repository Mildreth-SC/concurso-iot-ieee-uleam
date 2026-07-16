import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizerFooterStrip } from "@/components/layout/OrganizerFooterStrip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I Concurso Nacional IoT ULEAM 2026 | Experiencia IoT",
  description:
    "Experiencia tecnológica nacional de proyectos IoT organizada por la Rama Estudiantil IEEE ULEAM. Bases, inscripción, sponsors y premiación en Manta.",
  keywords: ["IoT", "ULEAM", "IEEE", "concurso", "Ecuador", "Manta", "sponsors"],
  openGraph: {
    title: "I Concurso Nacional IoT ULEAM 2026",
    description: "Entra a la experiencia IoT: bases, nodos de impacto, inscripción y patrocinio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <OrganizerFooterStrip />
        <Footer />
      </body>
    </html>
  );
}
