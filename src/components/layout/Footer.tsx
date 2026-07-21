import { CONTACT_EMAIL, ORGANIZER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-neon-cyan/15 bg-white/75 py-12 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-sm text-neon-blue">I Concurso Nacional IoT ULEAM 2026</p>
          <p className="mt-3 max-w-md text-sm text-text-muted">
            Experiencia tecnológica organizada por la {ORGANIZER.branch} de la{" "}
            {ORGANIZER.university}.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-blue">Navegación</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-text-muted">
            <a href="/experiencia" className="hover:text-neon-blue">Experiencia</a>
            <a href="/bases" className="hover:text-neon-blue">Bases</a>
            <a href="/inscripcion" className="hover:text-neon-blue">Inscripción</a>
            <a href="/organizacion" className="hover:text-neon-blue">Organización y sponsors</a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-blue">Contacto</p>
          <p className="mt-3 text-sm text-text-muted">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-neon-blue">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {ORGANIZER.shortUniversity} · {ORGANIZER.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
