# Paper, Skin & Synapses

Editorial psychology hospital website — Next.js 16 (App Router, Cache Components), Tailwind CSS v4, shadcn/ui (Radix), GSAP + ScrollTrigger, optional Spline 3D, EmailJS booking.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata, sitemap and JSON-LD |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key (restrict allowed origins in the EmailJS dashboard) |
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | Optional `.splinecode` URL; without it the hero uses the built-in GSAP synapse animation |

### EmailJS template

Set the template's **To Email** to `petchidev22@gmail.com` (or `{{to_email}}`) and use these variables:

`{{appointment_date}}`, `{{appointment_time}}`, `{{name}}`, `{{address}}`, `{{concern}}`, `{{phone}}`, `{{email}}`, `{{reply_to}}`, `{{submitted_at}}`

## Content

- Organisation details: `lib/site.ts`
- Specialists: `data/doctors.ts` (portraits in `public/images/specialists/`)
- Services, concerns, process, FAQs: `data/content.ts`

All organisation details, specialists and portraits are placeholders — replace them with verified information and real photography before launch.

## SEO / AEO / GEO

Per-page metadata and canonicals, Open Graph image, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `llms.txt`, and JSON-LD (`MedicalClinic`, `WebSite`, `Person`, `FAQPage`, `BreadcrumbList`).
