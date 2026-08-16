import { getSupabaseAdmin } from "./supabase";

export type OrganizerItem = {
  id: string;
  name: string;
  short: string;
  image: string;
};

export type SponsorItem = {
  id: string;
  name: string;
  tier: string;
  description: string;
  logo: string;
  website?: string;
  active: boolean;
};

export type SiteContent = {
  organizers: OrganizerItem[];
  sponsors: SponsorItem[];
};

const CONTENT_ID = "main";

/** Lista oficial de organizadores (orden de visualización). */
export const CANONICAL_ORGANIZERS: OrganizerItem[] = [
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

/** Imagen incorrecta subida (logo de asociación agronomía, no de la facultad). */
const INVALID_ORGANIZER_IMAGES: Partial<Record<string, string[]>> = {
  fcvt: ["fcvt-1786671055707"],
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  organizers: CANONICAL_ORGANIZERS,
  sponsors: [],
};

function isInvalidOrganizerImage(id: string, image: string) {
  const patterns = INVALID_ORGANIZER_IMAGES[id];
  if (!patterns?.length || !image) return false;
  return patterns.some((pattern) => image.includes(pattern));
}

/** Combina lo guardado en Supabase con la lista oficial y corrige logos erróneos. */
export function mergeOrganizers(stored: OrganizerItem[]): OrganizerItem[] {
  const storedMap = new Map(stored.map((item) => [item.id, item]));

  return CANONICAL_ORGANIZERS.map((canonical) => {
    const saved = storedMap.get(canonical.id);
    if (!saved) return { ...canonical };

    let image = saved.image?.trim() || canonical.image;
    if (isInvalidOrganizerImage(canonical.id, image)) {
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

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("your-project") &&
      key !== "your-service-role-key",
  );
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return DEFAULT_SITE_CONTENT;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_content")
      .select("organizers, sponsors")
      .eq("id", CONTENT_ID)
      .maybeSingle();

    if (error) throw error;
    if (!data) return DEFAULT_SITE_CONTENT;

    const storedOrganizers = (data.organizers as OrganizerItem[] | null) ?? [];
    const sponsors = (data.sponsors as SponsorItem[] | null) ?? [];

    return {
      organizers: storedOrganizers.length
        ? mergeOrganizers(storedOrganizers)
        : DEFAULT_SITE_CONTENT.organizers,
      sponsors,
    };
  } catch (error) {
    console.error("getSiteContent error:", error);
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContent) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("site_content").upsert({
    id: CONTENT_ID,
    organizers: mergeOrganizers(content.organizers),
    sponsors: content.sponsors,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
