import { CONTACT_EMAIL, ORGANIZER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-neon-cyan/20 bg-bg-dark/80 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-sm text-neon-cyan">I Concurso Nacional IoT ULEAM 2026</p>
          <p className="mt-3 max-w-md text-sm text-text-muted">
            Experiencia tecnológica organizada por la {ORGANIZER.branch} de la{" "}
            {ORGANIZER.university}.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Navegación</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-text-muted">
            <a href="/experiencia" className="hover:text-neon-cyan">Experiencia</a>
            <a href="/bases" className="hover:text-neon-cyan">Bases</a>
            <a href="/inscripcion" className="hover:text-neon-cyan">Inscripción</a>
            <a href="/organizacion" className="hover:text-neon-cyan">Organización y sponsors</a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Contacto</p>
          <p className="mt-3 text-sm text-text-muted">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-neon-cyan">
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
