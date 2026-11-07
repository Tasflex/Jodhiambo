# Dr. Joab Odhiambo — website & e-learning store

Next.js 16 (App Router) + TypeScript site for Dr. Joab Odhiambo: profile, publications, gallery, and an
e-learning store where students buy courses or a time-limited All-Access pass and read the PDF materials
in a view-only online reader.

**Stack:** Next.js · Supabase (auth, Postgres, private file storage) · Paystack (M-Pesa & card) · pdf.js · Resend (email)

## How it works

| Piece | Where |
| ----- | ----- |
| Catalogue (courses, passes, prices) | `src/data/courses.ts`, `src/data/plans.ts`. Prices are only ever read on the server |
| Cart | Browser storage (`src/lib/cart-store.ts`), no account needed to browse |
| Sign-in | Emailed magic link via Supabase (`/sign-in`, `/auth/callback`) |
| Checkout | `/api/checkout` creates a pending order and sends the user to Paystack |
| Payment confirmation | `/checkout/verify` (redirect back) **and** `/api/paystack/webhook` both call `fulfilOrder`, which is idempotent |
| Access | `entitlements` table: `all` (pass) or `course:<slug>`, each with an expiry. Repeat purchases extend from the current expiry |
| Reading | `/learn/[course]/[material]` renders pages to canvas with a per-user watermark; `/api/materials/[id]` streams the file only to entitled users, from a private bucket |

**About "view only":** the PDFs never have a public or shareable URL, the file endpoint refuses direct
navigation, and the reader has no download, print, copy or right-click. No website can stop screenshots or a
determined technical user; the watermark (the buyer's email) makes leaked pages traceable.

## Setup

### 1. Install and configure

```bash
npm install
cp .env.example .env.local     # fill in the values (see comments in the file)
```

### 2. Supabase

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run `supabase/migrations/0001_init.sql`. This creates the tables, security rules, the
   private `materials` bucket and the `fulfil_order` function.
3. **Authentication → URL Configuration**: set *Site URL* to your domain and add
   `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback` to *Redirect URLs*.
4. Copy the project URL, anon key and service role key into `.env.local`.

### 3. Paystack

1. Copy your **test** secret key (`sk_test_…`) into `PAYSTACK_SECRET_KEY`.
2. **Settings → API Keys & Webhooks**: set the webhook URL to `https://<your-domain>/api/paystack/webhook`.
   (Locally, the redirect back to `/checkout/verify` confirms payments without a webhook.)
3. Make sure KES and M-Pesa are enabled on your Paystack account.

### 4. Content and the admin dashboard

1. In **SQL Editor**, also run `supabase/migrations/0002_admin_content.sql` (content tables + image bucket).
2. Load the starting content once: `node scripts/seed-content.mjs` (safe to re-run; never overwrites edits).
3. Put your email in `ADMIN_EMAILS`, sign in on the site, and open **/admin**.

Everything is managed from the dashboard:

| Section | What you can do |
| ------- | --------------- |
| Dashboard | Revenue, orders, students, best sellers |
| Orders | Filter by status, re-check a payment with Paystack |
| Students | See who has access; grant or revoke access (e.g. offline M-Pesa payments) |
| Courses & PDFs | Add/edit courses and prices, publish/unpublish, upload, rename, reorder and delete PDFs |
| Plans | All-Access pass prices and lengths |
| Research, Articles, Books, Gallery | Add, edit and delete, with image uploads |

Saving anything refreshes the public site immediately.

### 5. Run

```bash
npm run dev          # http://localhost:3000
```

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Development server                             |
| `npm run build`     | Production build                               |
| `npm start`         | Serve the production build                     |
| `npm run lint`      | ESLint                                         |
| `npm run typecheck` | TypeScript check                               |

`dev` and `build` first copy the pdf.js worker into `public/vendor/` (generated, not committed).

## Where things live

```
src/
  app/            Routes (one folder per page) and API routes
  components/     UI grouped by feature (layout, courses, cart, learn, publications, gallery, contact, auth)
  data/           Site content: edit these files to update the site
  lib/            Cart, catalogue, pricing, access checks, Paystack, Supabase clients, validation, mailer
  proxy.ts        Keeps the Supabase session fresh on signed-in routes (Next 16's "middleware")
supabase/         Database migration
public/img/       Images (hero, about, books/, gallery/)
```

### Updating content

| To change…              | Edit                    |
| ----------------------- | ----------------------- |
| Research papers         | `src/data/research.ts`  |
| Media articles          | `src/data/articles.ts`  |
| Books                   | `src/data/books.ts`     |
| Courses, prices, access period | `src/data/courses.ts` |
| All-Access passes       | `src/data/plans.ts`     |
| Gallery photos          | `src/data/gallery.ts` + the file in `public/img/gallery/` |
| Contact details, social | `src/data/site.ts`      |

## Before launch

- [ ] **Prices**: courses are placeholder KES 5,000 with 12 months' access; passes are placeholder
      KES 1,500 / 4,000 / 12,000 for 1 / 3 / 12 months.
- [ ] Switch Paystack to the live secret key and set the live webhook URL.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain (Paystack redirects back to it).
- [ ] Set up Resend (or swap `src/lib/mailer.ts`) so contact messages and payment notifications are delivered.
- [ ] Customise the Supabase sign-in email template with your branding.
- [ ] Confirm the Bluesky handle in `src/data/site.ts`.
- [ ] In the dashboard, check research venues (some read like subject areas, not journal names) and the date of
      "Actuaries can play a huge role in solving our economic woes" (probably late January 2024, not 25 February).
