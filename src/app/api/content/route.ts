import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content";

/** Contenido público: organizadores y sponsors activos */
export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({
    organizers: content.organizers,
    sponsors: content.sponsors.filter((s) => s.active),
  });
}
