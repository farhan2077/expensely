# Expensely

Expensely is a collaborative expense management app for shared living and group-based spending. It helps members of a group track daily grocery/meal spending, monthly utilities, member payments, and fair-share breakdowns in one place.

## Highlights

- **Group-based collaboration** with create/join flows using a group name + passcode.
- **Role-aware access** (`admin`, `editor`, `member`) to control who can manage financial records.
- **Daily activity tracking** for meal counts and grocery costs, with month filtering and per-user summaries.
- **Monthly billing workflow** for utility costs and monthly member payments.
- **Bill breakdowns** that calculate personal totals, meal rate, and payable/receivable context.
- **Member order management** with sortable sequences and removable empty slots.
- **Group administration** features such as member removal, role updates, and group details pages.
- **Auth system** with sign-up, sign-in, sign-out, and reset-password email flow.
- **Observability and health endpoints** via Sentry and `/api/health` route.

---

## Tech Stack

### Frontend & App Framework

- **Next.js 14 (App Router)** for routing, layouts, server components, and server actions.
- **React 18 + TypeScript** for UI and type-safe app logic.
- **Tailwind CSS** for styling, with reusable design primitives built on **Radix UI** components.
- **TanStack React Table** for rich table rendering in activity/bill views.
- **dnd-kit** for drag-and-drop sorting in group order workflows.
- **date-fns** for date math and formatting.

### Backend & Data

- **Next.js Server Actions** as the main backend interaction layer.
- **Drizzle ORM + Drizzle Kit** for schema definitions, migrations, and typed database access.
- **Turso/libSQL (SQLite dialect)** as the database backend.
- **Relational schema** for users, sessions, groups, memberships, daily activities, monthly utilities, monthly activities, reset tokens, and ordering metadata.

### Authentication & Security

- **Lucia Auth** with Drizzle adapter.
- Password hashing using **Node `crypto.pbkdf2`**.
- Cookie-backed session validation and rotation.
- Password reset support with token persistence and expiration tracking.

### Validation, Forms, and UX

- **Zod** for schema validation.
- **React Hook Form** + `@hookform/resolvers` for typed form state management.
- **sonner** for toast notifications.
- **next-themes** for theme switching.
- **qrcode.react** and `@yudiel/react-qr-scanner` for invite/share join-code experiences.

### Email, Monitoring, and Analytics

- **Resend** + **React Email** for transactional emails.
- **Sentry (Next.js SDK)** for error/trace monitoring across client/server/edge.
- Optional analytics hook via `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.

### Testing & Quality Tooling

- **Vitest** + Testing Library for unit/component testing with coverage.
- **ESLint** (Next config + import sorting) and **Prettier** (Tailwind plugin).
- **TypeScript compiler checks** via `npm run typecheck`.

---

## Feature Overview

## 1) Authentication and account flows

- Sign-up and sign-in pages under App Router auth segments.
- Session validation utility used across protected routes.
- Sign-out invalidates server-side sessions and clears cookies.
- Forgot/reset password flow with token table support and email template.

## 2) Groups and membership

- Create a new group (creator becomes `admin` and owner).
- Join an existing group via group name + numeric passcode.
- Rejoin inactive memberships without creating duplicate links.
- Fetch all active groups for current user and route users into the correct dashboard.
- Group detail views for members, metadata, and management actions.

## 3) Roles and permissions

- Membership role model: `admin`, `editor`, `member`.
- Owner/admin/editor privileges are used to gate data-entry actions in dashboards and billing flows.
- Role update action for promoting/demoting members (editor/member).

## 4) Daily activities dashboard

- Add/update/delete daily member activity records.
- Per-period totals:
  - total groceries
  - total meals
  - average meal rate
  - personal grocery/meal totals
  - personal meal bill estimate
- Date transformation and sorting logic for grouped table rendering.
- Month picker support and disabled-date logic for data-entry constraints.
- Member-wise breakdown dialog for settlement visibility.

## 5) Monthly billing and utilities

- Add or update group-level monthly utilities (electricity, internet, water, gas, cook, misc).
- Record per-member monthly activity values (e.g., rent paid/paid amount context).
- Bills page with member bill presentation and edit/upsert actions.

## 6) Group order workflow

- Ordered list of members for rotating duties/workflows.
- Drag-and-drop reorder support.
- Add placeholder/empty slots and clean/reset order indexes transactionally.

## 7) Settings and group management

- User settings page for account info updates.
- Group settings with table views and member counts.
- Action dropdowns for role update, member removal, and QR-related actions.

## 8) Platform and operational features

- SEO/metadata routes (`robots`, `sitemap`, OpenGraph assets).
- Global error pages and route-level error/loading states.
- Health check API endpoint for uptime verification.

---

## Project Structure (high level)

- `app/` — Next.js App Router routes, layouts, and server actions.
- `components/` — reusable UI, dialogs, tables, and domain widgets.
- `db/schema/` — Drizzle schema files for all entities.
- `db/migrations/` — SQL migrations and metadata snapshots.
- `libs/` — auth helpers, validators, utilities, type helpers, email helper.
- `emails/` — React Email templates.
- `__tests__/` — Vitest test suites.

---

## Local Development

## Prerequisites

- **Node.js 18.x**
- npm
- Turso/libSQL database credentials

## Setup

```bash
npm install
```

Create a `.env` file with:

```env
DATABASE_URL=
DATABASE_AUTH_TOKEN=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
EMAIL_FROM=
RESEND_API_KEY=
GITHUB_REPO_NAME=
GITHUB_REPO_OWNER=
GITHUB_REPO_PAT=
```

Run the app:

```bash
npm run dev
```

App defaults to: `http://localhost:3000`

---

## Scripts

### Core

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run analyze` — Bundle analysis build

### Quality

- `npm run typecheck`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run test`
- `npm run test:watch`
- `npm run test:ui`

### Database

- `npm run db:local`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:pull`
- `npm run db:check`
- `npm run db:undo`
- `npm run db:studio`
- `npm run db:remove`

### Email

- `npm run dev:email` — Local email template development

---

## Notes

- The app is under active development.
- If you deploy this project, ensure environment variables and Sentry/Resend/Turso credentials are configured for the target environment.
