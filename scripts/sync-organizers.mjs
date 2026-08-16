/**
 * Sincroniza organizadores oficiales en Supabase (incluye IEEE Sección Ecuador
 * y corrige logo incorrecto de FCVT). Ejecutar: node scripts/sync-organizers.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const CANONICAL = [
  {
    id: "ieee-uleam",
    name: "Rama Estudiantil IEEE ULEAM",
    short: "IEEE ULEAM",
    image: "/logos/ieee-uleam.png",
  },
  {
    id: "wie-uleam",
    name: "WIE ULEAM",
    short: "WIE ULEAM",
    image: "/logos/wie-uleam.png",
  },
  {
    id: "ieee-seccion-ecuador",
    name: "IEEE Sección Ecuador",
    short: "IEEE Ecuador",
    image: "/logos/ieee-seccion-ecuador.png",
  },
  {
    id: "fcvt",
    name: "Facultad de Ciencias de la Vida y Tecnologías",
    short: "FCVT ULEAM",
    image: "/logos/facultad-ciencias-vida-tecnologias.png",
  },
  {
    id: "uleam",
    name: "Universidad Laica Eloy Alfaro de Manabí",
    short: "ULEAM",
    image: "/logos/uleam.png",
  },
];

const INVALID_FCVT = "fcvt-1786671055707";

function merge(stored) {
  const map = new Map((stored ?? []).map((item) => [item.id, item]));
  return CANONICAL.map((canonical) => {
    const saved = map.get(canonical.id);
    if (!saved) return { ...canonical };

    let image = saved.image?.trim() || canonical.image;
    if (canonical.id === "fcvt" && image.includes(INVALID_FCVT)) {
      image = canonical.image;
    }
    if (canonical.id === "ieee-seccion-ecuador" && !saved.image?.trim()) {
      image = canonical.image;
    }

    return {
      id: canonical.id,
      name: canonical.name,
      short: canonical.short,
      image,
    };
  });
}

const supabase = createClient(url, key);

const { data, error: readError } = await supabase
  .from("site_content")
  .select("organizers, sponsors")
  .eq("id", "main")
  .maybeSingle();

if (readError) {
  console.error("Error leyendo site_content:", readError.message);
  process.exit(1);
}

const organizers = merge(data?.organizers);
const sponsors = data?.sponsors ?? [];

const { error: writeError } = await supabase.from("site_content").upsert({
  id: "main",
  organizers,
  sponsors,
  updated_at: new Date().toISOString(),
});

if (writeError) {
  console.error("Error guardando:", writeError.message);
  process.exit(1);
}

console.log("Organizadores sincronizados:");
for (const org of organizers) {
  console.log(`- ${org.short}: ${org.image || "(sin logo)"}`);
}
