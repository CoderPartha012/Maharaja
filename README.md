# Maharaja — Authentic Indian Restaurant Website

A full-stack restaurant website: a public-facing site for browsing the menu, booking tables, and ordering food, plus a dedicated admin panel for staff to manage reservations and customer messages. Built with React + TypeScript on the frontend and Supabase (Postgres, Auth, Edge Functions) on the backend.

## Live Demos

- **Vercel:** [maharaja-orpin.vercel.app](https://maharaja-orpin.vercel.app/)
- **Netlify:** [maharaja-by-partha.netlify.app](https://maharaja-by-partha.netlify.app/)

## Overview

Maharaja is an Indian restaurant's online presence covering the full customer journey — discover the menu, reserve a table or place an order, get confirmation — backed by a real database and serverless functions, plus a private admin area for the restaurant's staff to run day-to-day operations (reservations, upcoming bookings, contact messages).

---

## Features

### Customer-facing

- **Home page** — hero section, highlights, and calls to action
- **Interactive menu** (`/menu`)
  - North and South Indian dishes, categorized (Starters, Main Course, etc.)
  - Filter by cuisine, vegetarian/non-vegetarian, and spice level
  - "Add to Cart" on every dish
- **Cart & checkout** (`/order/checkout`)
  - Slide-over cart drawer with quantity controls
  - Dine-in / Takeaway / Delivery order types
  - Automatic GST (5%) and delivery fee calculation
  - Razorpay payment integration, with a built-in **demo mode** (simulated payment flow) when no live Razorpay key is configured
  - Order confirmation page with a reference number and order-tracking timeline
- **Table reservations** (`/reservations`)
  - Date, lunch/dinner time slot, and party size (up to 8 guests) selection
  - hCaptcha spam protection
  - Confirmation page with a reference number, "Add to Calendar," and "Get Directions" actions
  - Confirmation email sent automatically (via a Supabase Edge Function + Resend)
- **Gallery** (`/gallery`) — Interior, Dishes, and Events photo categories with zoomable images
- **Contact page** (`/contact`) — validated contact form (hCaptcha-protected), embedded map, business hours
- **Help & FAQs** (`/help`) — accordion FAQ covering reservations, ordering/payment, delivery, and general questions
- Fully responsive, accessible (skip links, ARIA labels, keyboard navigation), and SEO-optimized (per-route meta tags via `react-helmet-async`, sitemap, robots.txt)

### Admin panel (staff-only, `/admin/*`)

- **Login** (`/admin/login`) — email/password auth via Supabase Auth (no public sign-up; accounts are created directly in the Supabase dashboard)
- **Reservations** (`/admin/reservations`) — full list of bookings with a detail drawer to view/edit/cancel
- **Upcoming reservations** (`/admin/upcoming`) — filterable, paginated view (search by name/email, filter by status and date range) with quick status actions (Confirm / No-show / Cancel)
- **Messages** (`/admin/messages`) — inbox for contact-form submissions
- Route-protected via an auth guard; unauthenticated visitors are redirected to login

---

## Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling
- **React Router** — client-side routing, with route-level code splitting (`React.lazy`)
- **React Hook Form** + **Zod** — form state and schema validation
- **Framer Motion** — animations
- **react-helmet-async** — per-page SEO metadata
- **Lucide React** — icons
- **@sentry/react** — error monitoring (optional; disabled unless `VITE_SENTRY_DSN` is set)

### Backend / Infrastructure

- **Supabase**
  - **Postgres database** — `reservations`, `contact_messages`, `orders` tables with row-level security policies
  - **Supabase Auth** — admin authentication
  - **Edge Functions** (Deno) — `submit-reservation`, `submit-contact`, `create-razorpay-order`, `confirm-order`; these use the service-role key to bypass RLS, verify hCaptcha tokens, and send transactional emails via Resend
- **Razorpay** — payment processing (test/live keys)
- **hCaptcha** — bot protection on public forms
- **Resend** — transactional email delivery

### Tooling

- **ESLint** + **typescript-eslint** — linting
- **Prettier** — formatting
- **Husky** + **lint-staged** — pre-commit checks
- **GitHub Actions** — CI (typecheck → lint → build on every push/PR to `main`)
- **rollup-plugin-visualizer** — bundle size report (`docs/bundle-report.html`)
- Deploy-ready for both **Vercel** and **Netlify** (`vercel.json` / `netlify.toml` included, with SPA routing rewrites)

---

## Project Structure

```text
Maharaja/
├── src/
│   ├── components/          # Shared UI (Navbar, Footer, CartDrawer, SEO, ErrorBoundary, ...)
│   │   └── admin/           # Admin-only components (layout, auth guard, reservation drawer)
│   ├── pages/                # Route-level pages (Home, Menu, Reservations, Checkout, Help, ...)
│   │   └── admin/            # Admin pages (Login, Reservations, Upcoming, Messages)
│   ├── lib/                  # Supabase client, auth context, cart context, DB types
│   ├── App.tsx                # Route definitions
│   └── main.tsx                # Application entry point
├── supabase/
│   ├── functions/             # Edge Functions (Deno)
│   └── migrations/            # SQL schema migrations
├── public/                    # Static assets (favicon, manifest, robots.txt, sitemap.xml)
├── vercel.json                # Vercel deploy config (SPA rewrites)
├── netlify.toml                # Netlify deploy config (SPA redirects)
└── .github/workflows/ci.yml    # CI pipeline
```

---

## Getting Started

### Prerequisites

- Node.js 20.x
- npm
- A Supabase project (for the backend — see [Environment Variables](#environment-variables))

### Installation

```bash
git clone https://github.com/CoderPartha012/Maharaja.git
cd Maharaja
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable                 | Required | Purpose                                                  |
| ------------------------ | -------- | -------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Yes      | Your Supabase project URL                                |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Supabase anon/publishable key                            |
| `VITE_HCAPTCHA_SITE_KEY` | No       | hCaptcha site key (defaults to hCaptcha's test key)      |
| `VITE_RAZORPAY_KEY_ID`   | No       | Enables live payments; omit to run checkout in demo mode |
| `VITE_SENTRY_DSN`        | No       | Enables error monitoring                                 |

The `VITE_*` variables are inlined into the client bundle at **build time** — if deploying to Vercel/Netlify, set them in the platform's project settings _before_ building, not just locally.

Edge Function secrets (`HCAPTCHA_SECRET_KEY`, `RESEND_API_KEY`, `RAZORPAY_KEY_SECRET`, etc.) are set separately via the Supabase CLI or dashboard — see comments in `.env.example`.

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with `npm run preview`.

### Other Scripts

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run analyze     # production build + bundle size report
```

---

## Backend Setup (Supabase)

1. Create a Supabase project.

2. Link the CLI and push migrations:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

3. Deploy the Edge Functions:

   ```bash
   npx supabase functions deploy submit-reservation
   npx supabase functions deploy submit-contact
   npx supabase functions deploy create-razorpay-order
   npx supabase functions deploy confirm-order
   ```

4. Set function secrets (`npx supabase secrets set KEY=value`) as needed.

5. Create an admin user via **Supabase Dashboard → Authentication → Users → Add user** (there's no public sign-up flow — admin accounts are provisioned manually).

## Deployment

The repo is preconfigured for both platforms — `vercel.json` and `netlify.toml` handle the build command, output directory, and SPA routing rewrites (without these, client-side routes like `/menu` would 404 on a direct visit or refresh).

For either platform: import the GitHub repo, then set the required environment variables (see table above) in the project's dashboard before the first build.

---

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

1. Install dependencies
2. Typecheck (`tsc --noEmit`)
3. Lint (`eslint .`)
4. Build (`vite build`)

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions), and mobile browsers.

## Acknowledgments

- Icons from [Lucide](https://lucide.dev/)
- Fonts from Google Fonts (Playfair Display, Poppins)
