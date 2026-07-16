# I Concurso Nacional IoT ULEAM 2026

Landing page y formulario de inscripción para el concurso nacional IoT de la Rama Estudiantil IEEE ULEAM.

## Stack

- **Next.js 16** + Tailwind CSS 4
- **React Hook Form** + Zod
- **Supabase** — inscripciones (Postgres), contenido del sitio y archivos (Storage)
- **Resend** — emails de confirmación
- **Vercel** (recomendado) o Cloudflare Workers — hosting

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

1. Crea un proyecto en [supabase.com](https://supabase.com) (o usa el que ya tienes).
2. **SQL Editor → New query**: pega y ejecuta todo `supabase/schema.sql`.
   Esto crea la tabla `registrations`, la tabla `site_content` y el bucket público `site-assets`.
3. Copia **Project URL** y **service_role key** (Project Settings → API) a `.env.local` y a Vercel.

## Deploy en Vercel (recomendado)

Misma base de datos Supabase. Build: `npm run build` (= `next build`).

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con **GitHub**.
2. **Add New… → Project**.
3. Importa el repo: `Mildreth-SC/concurso-iot-ieee-uleam` (o el que uses).
4. Framework: **Next.js** (lo detecta solo).
5. En **Environment Variables** añade todas las variables de la tabla de arriba
   (las mismas de tu `.env.local`).
6. **Deploy**.

URL típica: `https://concurso-iot-ieee-uleam.vercel.app`  
(ese dominio **no** muestra tu cuenta de GitHub).

### Dominio personalizado en Vercel

1. Proyecto → **Settings → Domains**.
2. Agrega tu dominio (comprado o gratuito externo).

## Deploy en Cloudflare Workers (opcional)

1. En Cloudflare → Import repository.
2. **Build command:** `npm run cf:build`
3. **Deploy command:** `npx wrangler deploy`
4. Añade las mismas variables de entorno.

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
