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

export const DEFAULT_SITE_CONTENT: SiteContent = {
  organizers: [
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
      id: "fcvt",
      name: "Facultad de Ciencias de la Vida y Tecnologías",
      short: "FCVT",
      image: "/logos/facultad-ciencias-vida-tecnologias.png",
    },
    {
      id: "uleam",
      name: "Universidad Laica Eloy Alfaro de Manabí",
      short: "ULEAM",
      image: "/logos/uleam.png",
    },
  ],
  sponsors: [],
};

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

    const organizers = (data.organizers as OrganizerItem[] | null) ?? [];
    const sponsors = (data.sponsors as SponsorItem[] | null) ?? [];

    return {
      organizers: organizers.length
        ? organizers
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
    organizers: content.organizers,
    sponsors: content.sponsors,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
