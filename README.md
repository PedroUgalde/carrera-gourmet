# Carrera Gourmet MVP

Plataforma bilateral para conectar turistas internacionales con puestos de comida local durante la Copa Mundial 2026 en México (CDMX, Guadalajara, Monterrey).

## Stack

- **Next.js 15+** (App Router) + React + TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (PostgreSQL + Auth + RLS)
- **OpenAI** via Vercel AI SDK (traducción de menús)
- **Leaflet** + OpenStreetMap (mapas)

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Habilita **Email/Password** en Authentication → Providers
3. Ejecuta el SQL en `supabase/migrations/001_initial_schema.sql` en el SQL Editor
4. (Opcional) Seed demo: `POST http://localhost:3000/api/seed` después de configurar env

### 4. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Flujos

| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/register?role=tourist` | Turista | Registro |
| `/register?role=vendor` | Comerciante | Registro |
| `/vendor/dashboard` | Comerciante | Registrar negocio, menú, mapa, traducción IA |
| `/tourist/search` | Turista | Preferencias + geolocalización |
| `/tourist/results` | Turista | Top 3 locales + reserva instantánea |

## API Routes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/recommend` | POST | Motor híbrido: distancia + tags + aforo |
| `/api/translate-menu` | POST | Traducción IA español → inglés + tags |
| `/api/reservations` | POST/GET | Reserva atómica con RPC `book_reservation` |
| `/api/seed` | POST | Insertar 6 vendors demo |

## Modo demo (sin Supabase)

Sin `.env.local` configurado, la app usa **modo demo**:

- Banner amarillo en la parte superior
- En `/register` y `/login`: botones **Demo Tourist** / **Demo Vendor**
- En la landing: **Try Demo** → `/tourist/search` sin registro
- Búsqueda con 6 vendors en memoria; vendor dashboard guarda en `localStorage`

## Auth real (Supabase)

Copia `.env.example` a `.env.local` con credenciales reales de tu proyecto Supabase y **reinicia** `npm run dev`.

## Demo vendors (seed)

Tras ejecutar `/api/seed`, usa estas credenciales:

- Email: `demo-vendor-1@carrera-gourmet.demo` … `demo-vendor-6@carrera-gourmet.demo`
- Password: `DemoVendor123!`
# carrera-gourmet
