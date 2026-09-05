# SafeVoyage

SafeVoyage is a tourist safety platform foundation for location-aware safety assistance, emergency response coordination, incident reporting, and intelligent safety insights.

This repository extends an existing Next.js frontend prototype. Phase 1 establishes the application foundation while preserving the current browser-based demonstration at `/`.

## Current Status

The current application is a frontend prototype. It includes:

- SafeVoyage branding and metadata
- A Next.js App Router foundation
- Reusable shadcn-style UI components
- Prototype tourist and administrator screens
- Browser geolocation and map presentation
- Local emergency contact and SOS demonstrations
- A keyword-based safety assistant UI
- Route shells for future tourist and authority workflows
- A structured health endpoint at `/api/health`
- Centralized application error, response, validation, environment, and logging foundations

The following are not production capabilities yet:

- Secure authentication and role enforcement
- Backend persistence and database storage
- Real emergency contact or authority notification
- Real-time location streaming or geofencing
- Incident reporting and evidence workflows
- AI/ML risk intelligence
- Provider-backed chatbot responses
- Production notification delivery
- A real blockchain or immutable audit ledger

Prototype data is currently held in browser `localStorage`. It must not be treated as secure storage or production authentication.

### Demo accounts

The current demo authentication flow accepts these accounts and redirects each role to its dashboard:

| Role | Email | Password |
| --- | --- | --- |
| Tourist | `tourist@demo.safevoyage.app` | `demo-tourist-2026` |
| Authority | `authority@demo.safevoyage.app` | `demo-authority-2026` |

These credentials are for the browser demo only. Passwords are checked against SHA-256 digests and are never stored in the session; this is not production authentication.

## Technology Stack

- Next.js 14.2.25
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI and reusable shadcn-style components
- Lucide icons
- React Hook Form and Zod are available for future validation work
- npm is the preferred package manager for this repository

## Application Structure

```text
app/
  page.tsx                    Existing prototype entry flow
  layout.tsx                  SafeVoyage metadata and root layout
  api/health/route.ts         Server-side health endpoint
  (auth)/                     Authentication route shells
  (tourist)/tourist/          Tourist route shells
  (authority)/authority/      Authority route shells
  error.tsx                   Application error boundary
  not-found.tsx               Not-found boundary
components/
  ui/                         Reusable design-system components
  foundation/                 Foundation-only route presentation
  auth/                       Existing authentication UI prototype
  dashboard/                  Existing safety dashboard prototype
  emergency/                  Existing SOS and emergency UI prototypes
  location/                   Existing GPS and map UI prototypes
  contacts/                   Existing emergency contacts UI prototype
  support/                    Existing chatbot UI prototype
  admin/                      Existing administrator UI prototype
lib/
  api/                        API response helpers
  config/                     Environment and public configuration
  errors/                     Application error model and handlers
  logging/                    Structured logging abstraction
  auth.ts                     Existing local prototype auth service
  emergency.ts                Existing local prototype emergency service
  location.ts                 Existing browser location service
```

## Getting Started

Prerequisites:

- Node.js 18 or newer
- npm

Install dependencies from the application directory:

```bash
cd touristsafetywebsite
npm install
```

Copy the environment contract and add only configuration appropriate to your local setup:

```bash
copy .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Configuration

`.env.example` documents the current public application settings and future server-only integrations. Do not commit `.env` or `.env.local`.

`NEXT_PUBLIC_MAPS_API_KEY` is intentionally browser-visible when used. Any real map key must be restricted by domain and API, and any previously exposed key should be rotated or restricted by the project owner.

Server-only values such as `DATABASE_URL`, `AUTH_SECRET`, provider credentials, and future AI credentials must never use the `NEXT_PUBLIC_` prefix.

## Validation

Run the available checks from `touristsafetywebsite/`:

```bash
npm run typecheck
npm run build
npm run lint
```

The build is configured to fail on TypeScript errors. ESLint is configured with the Next.js 14 ruleset and passes cleanly for the current prototype components.

## API Foundation

`GET /api/health` returns a server-generated response in this shape:

```json
{
  "status": "ok",
  "service": "safevoyage",
  "timestamp": "2026-09-04T00:00:00.000Z"
}
```

Future route handlers should use the shared API response and error foundations rather than exposing stack traces or internal details.

## Roadmap

1. Foundation and architecture
2. Secure authentication and user roles
3. Tourist profiles and persistent dashboards
4. Real-time location and geofencing
5. SOS and emergency response coordination
6. Incident reporting
7. Authority and responder operations
8. Risk intelligence and controlled AI assistance
9. Notifications and delivery tracking
10. Security, testing, observability, and deployment

## Phase 1 Technical Debt

The following items are intentionally deferred:

- LocalStorage replacement with server persistence
- Secure authentication and authorization
- Consolidation of duplicate browser location watchers
- Replacement of mock authority data
- Provider-backed emergency and notification delivery
- Database and migration tooling
- Production map-provider integration
- AI service integration
- Test runner and end-to-end test setup
- Real append-only audit logging

Do not interpret prototype labels or UI demonstrations as evidence that emergency services, authorities, contacts, or AI systems have been contacted.
