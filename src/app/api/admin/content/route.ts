import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-auth";
import {
  getSiteContent,
  saveSiteContent,
  type SiteContent,
} from "@/lib/site-content";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("iot_admin_session")?.value;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteContent;
    if (!Array.isArray(body.organizers) || !Array.isArray(body.sponsors)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    await saveSiteContent({
      organizers: body.organizers,
      sponsors: body.sponsors,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save content error:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el contenido" },
      { status: 500 },
    );
  }
}
