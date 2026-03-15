# Sun Peek Insight — Setup Guide

This project has been migrated from Lovable to a self-hosted stack:
- **Auth**: Clerk (replaces Supabase Auth)
- **Database**: Supabase (your existing project — already migrated)
- **Hosting**: Cloudflare Pages

---

## 1. Clerk Setup

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application → choose **Email + Password** (and any social providers you want)
3. Go to **API Keys** → copy your **Publishable Key** (starts with `pk_live_...`)
4. Add it to your `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
   ```

### Connect Clerk → Supabase JWT

5. In Clerk Dashboard → **JWT Templates** → **New template** → choose **Supabase**
6. Leave the default claims — they include `sub: {{ user.id }}`
7. Copy the **JWKS Endpoint URL** shown on the template page
8. In Supabase Dashboard → **Settings** → **API** → **JWT Settings**
9. Scroll to **"Third-party auth providers"** → **Add provider**
10. Paste your Clerk JWKS URL → Save

---

## 2. Supabase RLS Migration

Apply the Clerk RLS migration to update Row Level Security policies:

```bash
supabase login
supabase link --project-ref debnyhafwifqjtfzqxsy
supabase db push
```

This runs the migration at:
`supabase/migrations/20260315000000_switch_to_clerk_rls.sql`

---

## 3. Local Development

```bash
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

---

## 4. Cloudflare Pages Deployment

### Option A — Connect GitHub (recommended)

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → **Create a project** → **Connect to Git**
3. Select your repo
4. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Settings → Environment Variables**, add:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   VITE_SUPABASE_PROJECT_ID
   VITE_CLERK_PUBLISHABLE_KEY
   ```
6. Click **Save and Deploy**

### Option B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name sun-peek-insight
```

### Custom Domain (DNS)

1. In Cloudflare dashboard → **Pages** → your project → **Custom domains**
2. Click **Set up a custom domain** → enter e.g. `sunpeekinsight.com`
3. Cloudflare will automatically add the required DNS records (CNAME pointing to `<project>.pages.dev`)
4. Wait ~5 minutes for DNS propagation

> If your domain is **already on Cloudflare** (nameservers pointing to Cloudflare), the DNS record is added instantly and you're done.
> If your domain is **elsewhere**, update your domain's nameservers to Cloudflare's, or add a CNAME record manually at your registrar.

---

## 5. Summary of Changes from Original

| Area | Before | After |
|---|---|---|
| Auth | Supabase Auth (email/password form) | Clerk (hosted sign-in UI) |
| Auth guard | `supabase.auth.getSession()` | `useAuth()` from `@clerk/clerk-react` |
| User ID | `supabase.auth.getUser()` | `useUser()` from `@clerk/clerk-react` |
| DB calls | `supabase` client directly | `getSupabaseClient(getToken)` — injects Clerk JWT |
| Supabase RLS | `auth.uid()` | `auth.clerk_user_id()` (custom SQL function) |
| Hosting config | Lovable / none | `wrangler.toml` + `public/_headers` + `public/_redirects` |
| Lovable references | `index.html`, `vite.config.ts`, `package.json` | All removed |
