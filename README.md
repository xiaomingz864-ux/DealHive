# DealHive – Amazon Affiliate Deals Website

A minimal, modern, SEO-friendly Amazon affiliate deals & coupons site with a full admin panel.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Auth + Database)

---

## Features

### Public site
- Home with featured + latest deals
- All Deals page (search, category filters, featured)
- Categories listing & category pages
- Blog / Articles
- Static pages: About, Contact, Privacy Policy, Affiliate Disclosure, Terms
- Responsive deal cards (image, price, discount, coupon, expiry)
- "Get Deal" → Amazon with your affiliate tag
- Auto-hides expired deals
- XML sitemap + robots.txt
- SEO-friendly slugs and meta fields

### Admin panel (`/admin`)
- Secure login (Supabase Auth)
- Dashboard stats
- CRUD: Deals, Products, Categories, Articles, Pages
- Site settings (name, logo, contact, Amazon affiliate tag)
- SEO fields on every content type
- Publish / schedule / feature deals

---

## Setup

### 1. Create a Supabase project
1. Go to https://supabase.com and create a project.
2. In the SQL Editor, run the entire contents of `supabase/schema.sql`.
3. (Optional) Create a public Storage bucket named `images` for uploads.
4. Create an admin user: Authentication → Users → Add user (email + password).

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

(Get the keys from Supabase → Project Settings → API.)

### 3. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000  
Admin: http://localhost:3000/admin/login

### 4. First-time content
1. Log in to `/admin`.
2. **Site Settings** → set your Amazon affiliate tag (e.g. `yourtag-20`).
3. Create a few **Categories**.
4. Add **Products** (name, Amazon URL, image URL, price).
5. Create **Deals** linked to products, set price/coupon/expiry, mark Published + Featured.
6. Edit the static **Pages** and write an **Article** if desired.

---

## Amazon Associates compliance
- Affiliate Disclosure page is seeded and linked in the footer.
- "As an Amazon Associate we earn from qualifying purchases" appears in the footer.
- All outbound Amazon links use `rel="sponsored"` and open in a new tab.
- Prices/availability disclaimer is included.

---

## Project structure

```
src/
  app/                  # App Router pages (public + admin)
  components/           # UI + admin forms
  lib/
    supabase/           # Client, server, middleware helpers
    data.ts             # Public data fetching
    types.ts
    utils.ts
supabase/
  schema.sql            # Full DB schema + RLS + seed pages
```

---

## Deploy
Deploy to Vercel (or any Node host). Set the same environment variables.  
After deploy, update `NEXT_PUBLIC_SITE_URL` to your production domain.
