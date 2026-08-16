import { generateBasesPdfBytes } from "@/lib/bases-pdf";

export const runtime = "nodejs";

export async function GET() {
  try {
    const pdfBytes = await generateBasesPdfBytes();

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="bases-concurso-iot-uleam-2026.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Error al generar el PDF", { status: 500 });
  }
}
