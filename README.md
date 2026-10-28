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
| `NEXT_PUBLIC_BOOKING_API` | Booking API base URL; defaults to `https://api.paperskinandsynapses.com/api/v1` |
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | Optional `.splinecode` URL; without it the hero uses the built-in GSAP synapse animation |

### Booking

The booking form (`components/booking/booking-flow.tsx`) reads live availability from the booking API and creates a request with `POST /bookings`. The API holds the slot, emails Megha a confirm/decline link and emails the visitor a link to `/booking/manage/`, where they can view, move or cancel it. Each enquiry type maps to a service in the API (`lib/booking/api.ts`). API reference: `docs/API.md` in the booking-api repository.

## Content

- Organisation details: `lib/site.ts`
- Specialists: `data/doctors.ts` (portraits in `public/images/specialists/`)
- Services, concerns, process, FAQs: `data/content.ts`

All organisation details, specialists and portraits are placeholders — replace them with verified information and real photography before launch.

## SEO / AEO / GEO

Per-page metadata and canonicals, Open Graph image, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `llms.txt`, and JSON-LD (`MedicalClinic`, `WebSite`, `Person`, `FAQPage`, `BreadcrumbList`).
