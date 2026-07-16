# I Concurso Nacional IoT ULEAM 2026

Landing page y formulario de inscripción para el concurso nacional IoT de la Rama Estudiantil IEEE ULEAM.

## Stack

- **Next.js 16** + Tailwind CSS 4
- **React Hook Form** + Zod
- **Supabase** — inscripciones (Postgres), contenido del sitio y archivos (Storage)
- **Resend** — emails de confirmación
- **Cloudflare Workers** (adaptador OpenNext) — hosting

## Desarrollo local

```bash
npm install
# Crea .env.local con las variables de abajo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crea un archivo `.env.local` (no se sube al repo):

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo servidor, secreto) |
| `RESEND_API_KEY` | API key de Resend (emails) |
| `RESEND_FROM_EMAIL` | Remitente verificado (ej. `concurso@tudominio.com`) |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` |
| `ADMIN_SESSION_SECRET` | Cadena aleatoria para firmar la sesión admin |

## Supabase (base de datos + storage)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: pega y ejecuta todo `supabase/schema.sql`.
   Esto crea la tabla `registrations`, la tabla `site_content` y el bucket público `site-assets`.
3. Copia **Project URL** y **service_role key** (Project Settings → API) a `.env.local`.

## Deploy en Cloudflare Workers

El proyecto usa el adaptador [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

### Opción A — Desde el dashboard (recomendado)

1. Sube este repo a GitHub.
2. En [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Import a repository**.
3. Framework: **Next.js**. Deja que detecte la configuración (`wrangler.jsonc`).
4. Comandos de build (importante):
   - **Build command:** `npm run cf:build` (OpenNext llama internamente a `next build`)
   - **Deploy command:** `npx wrangler deploy`
   - No uses `npm run build` como comando de Cloudflare: OpenNext también ejecuta `npm run build` y se crea un bucle infinito.
5. En **Build variables and secrets** añade TODAS las variables de entorno
   (incluida `NEXT_PUBLIC_SUPABASE_URL` para que el build las tenga).
6. Deploy. Obtendrás una URL `*.workers.dev` gratuita.

### Opción B — Desde tu máquina

```bash
npx wrangler login
npm run deploy
```

### Comandos útiles

- `npm run preview` — corre la app en el runtime de Workers localmente (más fiel a producción).
- `npm run deploy` — build + deploy a Cloudflare.

## Panel administrativo

- Ruta: `/admin` (protegida por `ADMIN_PASSWORD`).
- Gestiona inscritos, logos de organizadores y sponsors.
- Los logos/sponsors y comprobantes se guardan en Supabase Storage (bucket `site-assets`).

## Checklist de contenido

- [x] Fecha presentación: 11 de noviembre 2026
- [x] Costo no IEEE: $15.00 USD
- [x] Datos bancarios en formulario
- [x] Comprobante obligatorio para no IEEE
- [x] Número IEEE obligatorio para miembros
- [x] Contacto: uleamieee@gmail.com
- [x] Diseño neón/cyberpunk
- [ ] PDF de bases en `public/` (pendiente archivo oficial)
- [ ] Emails de confirmación (requiere Resend configurado)
