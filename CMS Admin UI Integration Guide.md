# CMS Admin: UI Integration Guide

Oct 29, 2026 · @Prasana Balaji Dhanasekarapandian

## Overview

The CMS admin is a set of private screens in the Next.js site where Megha runs everything: bookings, services, her profile and hours, clinic settings, clients and logins. Every screen is a client-side page that calls the live API at **`https://api.paperskinandsynapses.com/api/v1`** with Megha's sign-in token. No backend work is needed: every endpoint below is deployed and tested.

|  |  |
| --- | --- |
| Who signs in | Megha, `megha@paperskinandsynapses.com`: role `admin`, user id 1, linked to practitioner id 7 |
| Auth | `POST /auth/login` → bearer token, valid 8 hours |
| Routes it uses | Everything under `/admin/...`, plus `/auth/me` and `/auth/password` |
| Public site | Already integrated on branch `booking-api-integration` (booking form, `/booking/manage/`) |
| API repo | `KishoreKumar-28/paperskinandsynapses`, `docs/API.md` |

**What the CMS manages today (live, 29 Oct 2026)**

| Area | Live state |
| --- | --- |
| Psychologists | One: Megha (id 7), online only, Mon–Fri 09:00–17:00, 50-minute sessions |
| Services | 5 active, matching the site's enquiry types; 7 old prototype services hidden |
| Slots | 09:00, 10:00, 11:00, 12:00, 14:00, 15:00, 16:00 on weekdays; lunch 13:00–14:00 |
| Bookings | Real requests are arriving: 8 so far, 2 pending, 1 confirmed today |
| Emails | Sent from megha@paperskinandsynapses.com; Megha confirms or declines from her inbox or the dashboard |

Unless noted, every request and response is JSON, times are IST (`+05:30`), and weekdays are numbers with **0 = Sunday**.

## Screen map

&#91;embedded content: CMS screens and their endpoints · 7 screens\]

Megha signs in once. After that, every screen is a thin page over its own `/admin` endpoints, and each section below covers one screen.

## Setting it up in the Next.js site

The site is a **static export** (`output: 'export'`, `trailingSlash: true`) served from Hostinger, so the admin must be client-side only: static page shells whose client components fetch from the API in the browser. Route handlers, middleware, server actions and cookies-based auth are not available in this build.

**Routes.** Dynamic segments like `/admin/appointments/[id]` need `generateStaticParams`, which can't list bookings at build time. Pass ids as query parameters instead:

| Route | Screen |
| --- | --- |
| `/admin/` | Sign-in, then the dashboard |
| `/admin/appointments/` and `/admin/appointments/view/?id=42` | Appointments list and detail |
| `/admin/services/` | Services |
| `/admin/profile/` | Megha's profile, weekly hours, time off |
| `/admin/settings/` | Clinic settings |
| `/admin/clients/` and `/admin/clients/view/?id=7` | Clients list and detail |
| `/admin/users/` | Staff logins |

Read `id` with `new URLSearchParams(window.location.search)` inside an effect, or with `useSearchParams()` inside a `<Suspense>` boundary (Next 16 fails the build without one). `components/booking/manage-booking.tsx` on the integration branch shows the pattern.

**Keep it private and out of search**

```tsx
// app/admin/layout.tsx
import type { Metadata } from 'next'
import { AdminGuard } from '@/components/admin/admin-guard'

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
```

Also leave `/admin` out of `app/sitemap.ts`, add `disallow: ['/admin/']` in `app/robots.ts`, and don't link it from the public header. The pages hold no data themselves: without a valid token, every API call answers `401`.

**API client.** Put the CMS calls in `lib/cms/api.ts`. Reuse the base URL and `BookingApiError` from `lib/booking/api.ts`, and add the bearer token. The typed client is in the appendix.

**Already in place on the integration branch**

- CSP: `public/.htaccess` allows `connect-src https://api.paperskinandsynapses.com`. The dev CSP in `next.config.ts` also allows `http://127.0.0.1:8080` for a local API.
- CORS: the API accepts browser calls from `https://paperskinandsynapses.com`, `https://www.paperskinandsynapses.com` and `http://localhost:3000`. Another origin, such as a preview URL or a different dev port, has to be added to `CORS_ALLOWED_ORIGINS` in the server's `booking-api/.env`.
- `NEXT_PUBLIC_BOOKING_API` selects the API: production by default, or `http://127.0.0.1:8080/api/v1` for a local backend.

**Reuse the site's look.** The booking form already uses the parts the admin needs: `surface-card`, `type-h2`/`type-h3`/`type-eyebrow`, `Button`, `Input`, `Textarea`, `Calendar`, `Dialog`, `Alert`, `Separator` and `TimeSlotPicker`. `react-hook-form` with `zod` handles the forms.

## Sign-in and session

Sign-in returns a bearer token valid for **8 hours**. Keep it in `sessionStorage`, which clears when the tab closes, never in `localStorage` or a cookie. Send it as `Authorization: Bearer <token>` on every admin call. Any `401` means the session is over: clear the token and show the sign-in form.

| Call | Body | Result |
| --- | --- | --- |
| `POST /auth/login` | `{ email, password }` | `{ data: { token, expiresAt, user } }`; `401` "Email or password is incorrect." |
| `GET /auth/me` | – | `{ data: User }`: `{ id: 1, email, name: "Megha", role: "admin", practitionerId: 7, isActive, lastLoginAt }` |
| `POST /auth/password` | `{ currentPassword, newPassword }` (12–200 chars) | `204`. Every existing token stops working, this one included. A wrong current password gives `422 fields.currentPassword`. |

**Token store.** It's read through `useSyncExternalStore`, which keeps the repo's `react-hooks/set-state-in-effect` lint rule happy:

```ts
// lib/cms/session.ts
'use client'
import { useSyncExternalStore } from 'react'

const KEY = 'pss-admin-token'
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const session = {
  get: () => (typeof window === 'undefined' ? null : window.sessionStorage.getItem(KEY)),
  set(token: string) { window.sessionStorage.setItem(KEY, token); notify() },
  clear() { window.sessionStorage.removeItem(KEY); notify() },
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) },
}

export const useAdminToken = () => useSyncExternalStore(session.subscribe, session.get, () => null)
```

**Guard and sign-in**

```tsx
// components/admin/admin-guard.tsx
'use client'
import { useState, type ReactNode } from 'react'
import { cms } from '@/lib/cms/api'
import { session, useAdminToken } from '@/lib/cms/session'

export function AdminGuard({ children }: { children: ReactNode }) {
  const token = useAdminToken()
  return token ? <>{children}</> : <AdminSignIn />
}

function AdminSignIn() {
  const [error, setError] = useState<string | null>(null)
  async function onSubmit(form: FormData) {
    try {
      const { data } = await cms.login(String(form.get('email')), String(form.get('password')))
      session.set(data.token)   // the guard re-renders and shows the admin
    } catch (e) {
      setError((e as Error).message)   // 401 wrong details, 429 after 10 tries in 15 min
    }
  }
  return <form action={onSubmit}>{/* email, password, error, submit */}</form>
}
```

**Session rules**

- On load, call `GET /auth/me` once to show Megha's name and get `practitionerId` (7) for the profile screen. A `401` there means the stored token is stale.
- `cms.request` (appendix) calls `session.clear()` on any `401`, so every screen falls back to sign-in on its own.
- Warn about 5 minutes before `expiresAt` (an ISO time in IST), then ask her to sign in again.
- **Sign out** = `session.clear()`. The API has no logout call.
- After a successful password change, call `session.clear()`: the old token is already refused.
- Login is limited to 10 attempts per 15 minutes per IP. On `429`, disable the button and wait the `Retry-After` seconds.

## Errors

Every error has the same body. Branch on `code`, show `message` (it's written to be shown), and put `details.fields` under the matching inputs.

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Some details need another look.",
             "details": { "fields": { "durationMinutes": "Enter 15–240 minutes." } },
             "requestId": "9f2c1a7b3d4e5f60" } }
```

| HTTP | Code | When, in the CMS | UI response |
| --- | --- | --- | --- |
| 401 | `UNAUTHORIZED` | No, expired or revoked token | `session.clear()` → sign-in |
| 403 | `FORBIDDEN` | A non-admin token on `/admin/...` | "No access" |
| 404 | `NOT_FOUND` | Unknown id | Back to the list |
| 409 | `ALREADY_CONFIRMED`, `INVALID_STATUS`, `NOT_STARTED`, `TOO_LATE`, `SLOT_UNAVAILABLE` | Booking action no longer allowed, or the slot was taken | Reload the booking, show the message |
| 409 | `SERVICE_IN_USE` | Deleting a service bookings refer to | Offer **Hide** (`isActive: false`) |
| 409 | `PRACTITIONER_HAS_BOOKINGS` | Deleting a practitioner with upcoming bookings | Show the message |
| 409 | `CLIENT_HAS_BOOKINGS` | Erasing a client with upcoming bookings | Cancel those first |
| 409 | `EMAIL_TAKEN`, `SELF_LOCKOUT`, `LAST_ADMIN` | Staff-login rules | Show the message |
| 422 | `VALIDATION_FAILED` | Bad field values: all are listed at once | Map `details.fields` onto the form |
| 429 | `RATE_LIMITED` | 120 requests a minute per IP; logins 10 per 15 min | Wait `Retry-After` seconds |
| 500 | `INTERNAL_ERROR` | Server bug | Show the message and `requestId` |

**422 onto react-hook-form.** The API's field names match the bodies documented below, so they can go straight into `setError`:

```ts
try {
  await cms.updateService(id, values)
} catch (e) {
  if (e instanceof BookingApiError && e.status === 422) {
    for (const [field, message] of Object.entries(e.fields)) setError(field as keyof ServiceForm, { message })
  } else toast((e as Error).message)
}
```

Settings use their key as the field name (`slotGrid`, `siteUrl`, …). For lists, the name can carry an index, such as `hours.2` for the third working-hours row.

## Dashboard and appointments

The dashboard answers "what needs me today": four counters, then the requests waiting for Megha. Everything she can do from her email (confirm, decline) is also a button here, along with reschedule, cancel, outcomes and notes.

**Counters: `GET /admin/summary`**

```json
{ "data": { "pending": 2, "unassignedPending": 0, "today": 1, "upcomingConfirmed": 0 } }
```

Show `pending` (waiting for her decision), `today` (confirmed sessions today) and `upcomingConfirmed`. `unassignedPending` is always 0 with one psychologist, so hide it.

**List: `GET /admin/appointments`**: all filters optional, results sorted by start time, with `meta: { page, perPage, total }`.

| Query | Example | Meaning |
| --- | --- | --- |
| `status` | `pending` or `pending,confirmed` | `pending`, `confirmed`, `declined`, `cancelled`, `completed`, `no_show` |
| `from`, `to` | `2026-11-01`, `2026-11-30` | Start-date range, both inclusive |
| `q` | `priya`, `98765`, `PSS-GUY` | Name, phone, email or reference |
| `page`, `perPage` | `1`, `25` | `perPage` up to 100 |

Suggested tabs: **Waiting** (`status=pending`), **Upcoming** (`status=confirmed&from=<today>`), **Past** (`to=<yesterday>`) and **All**.

Each item (`StaffAppointment`) holds `id`, `reference`, `status`, `date`, `time`, `startsAt`, `endsAt` and `service { slug, name }` (the enquiry type). It also has `mode` (`video`), `message` (Megha's note to the patient) and `client { id, name, phone, email, address }`, where phone and address are often `null` because the site's form doesn't ask for them. Then `organisation`, `concern` (the patient's message), `source` (`web` or `staff`), `staffNotes`, `cancelReason`, `createdAt` and `confirmedAt`.

**Detail: `GET /admin/appointments/{id}`** adds `history`, a timeline to show under the booking:

```json
[ { "actor": "patient", "action": "requested", "detail": null, "at": "2026-10-28 17:51:40" },
  { "actor": "owner-link:megha@paperskinandsynapses.com", "action": "confirmed", "detail": null, "at": "2026-10-28 17:53:41" },
  { "actor": "patient", "action": "cancelled", "detail": "I need to change the date", "at": "2026-10-28 17:55:53" } ]
```

**Actions**: all `POST`, all return `{ data: StaffAppointment }`. Show each button only when its status allows it:

| Button | Path | Body | Shown when | Patient gets |
| --- | --- | --- | --- | --- |
| Confirm | `/admin/appointments/{id}/confirm` | `{ mode?: "video", message? }` | `pending` | "Your consultation is confirmed" + message |
| Decline | `/admin/appointments/{id}/decline` | `{ message? }` | `pending` | "About your consultation request" + message |
| Reschedule | `/admin/appointments/{id}/reschedule` | `{ date, time }` | `pending`, `confirmed` | "Your consultation has a new time"; a confirmed booking stays confirmed |
| Cancel | `/admin/appointments/{id}/cancel` | `{ reason? }` | `pending`, `confirmed` | "Your consultation has been cancelled" |
| Mark completed | `/admin/appointments/{id}/complete` | – | `confirmed`, after its start time | Nothing |
| Mark no-show | `/admin/appointments/{id}/no-show` | – | `confirmed`, after its start time | Nothing |
| Add note | `/admin/appointments/{id}/notes` | `{ note }` (1–2000) | Any | Nothing; staff only, stamped with time and author |

For Reschedule, reuse the site's `Calendar` and `TimeSlotPicker` with `GET /availability?date=…&service=<slug>` (no auth). The booking's own slot shows as taken, so the patient's current time can't be picked again. `message` reaches the patient; `concern`, `staffNotes` and `organisation` never do. Each action makes the link in Megha's earlier email stop working ("no longer valid"), which is expected.

**Phone bookings.** `POST /admin/appointments` takes the website's body without `consent`: `{ service, date, time, name, email?, phone?, organisation?, message?, mode: "video" }`. It returns `201 { data: { booking, manageToken } }`. The booking starts `pending`, so follow it with Confirm.

## Services screen

Services are the enquiry types on the booking form. The site maps each form choice to a service slug in `lib/booking/api.ts` (`SERVICE_FOR_ENQUIRY`), so **renaming is safe, but changing a slug breaks the form** until that map is updated too.

**Live services (active)**

| id | slug | name | type | minutes | order | form value |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `individual-counselling` | Individual counselling | individual | 50 | 1 | `individual` |
| 11 | `organisations-schools-colleges` | Organisation or institution programme | enquiry | 50 | 2 | `organisation` |
| 12 | `talks-workshops` | Psychoeducation, talk or workshop | enquiry | 50 | 3 | `talk` |
| 13 | `research-collaborations` | Research, publication or conference collaboration | enquiry | 50 | 4 | `research` |
| 14 | `other-enquiry` | Other enquiry | enquiry | 50 | 5 | `other` |

Seven old prototype services (ids 2–8, such as Child Psychology) are hidden with `isActive: false`. They keep their old order numbers, so list active services first and hidden ones in a collapsed "Hidden" group.

| Call | Body | Result |
| --- | --- | --- |
| `GET /admin/services` | – | `{ data: AdminService[] }`, hidden ones included |
| `POST /admin/services` | `{ name, description, suitableFor, durationMinutes?, bookingType?, price?, slug?, sortOrder?, isActive?, practitionerIds? }` | `201 { data: AdminService }`; linked to Megha automatically |
| `PATCH /admin/services/{id}` | Any of those fields | `{ data: AdminService }` |
| `DELETE /admin/services/{id}` | – | `204`, or `409 SERVICE_IN_USE` once any booking used it |

| Field | Rule | Form control |
| --- | --- | --- |
| `name` | 2–120 characters | Text input |
| `description` | 2–2000 | Textarea |
| `suitableFor` | 2–160 | Text input ("Adults, online") |
| `durationMinutes` | 15–240, default 50 | Number. Longer than 60 blocks the next hourly slot too |
| `bookingType` | `individual` or `enquiry` | Select. Label only: both are bookable |
| `price` | Rupees 0–1,000,000, or `null` | Number + "Don't show a price" toggle. Returned as `{ amount, currency: "INR" }` |
| `sortOrder` | 0–10000 | Up/down arrows; lower shows first |
| `isActive` | boolean | "Show on the website" switch |
| `slug` | lowercase-hyphens, unique | Read-only after creation (see above) |
| `practitionerIds` | ids, e.g. `[7]` | Hide while Megha is the only psychologist |

```ts
await cms.updateService(1, { description: 'A space to talk through …', price: 2000 })
await cms.updateService(14, { isActive: false })          // hide "Other enquiry" from the form
```

The booking form's five options are currently hard-coded in the site (`data/content.ts`). Hiding a service in the CMS doesn't remove its option from the form. Instead, booking that option fails with "Unknown service." To make the CMS drive the form, build the options from `GET /services`, the public list of active services.

## Profile, hours and time off

One screen, three panels, all for practitioner **id 7** (`practitionerId` from `/auth/me`).

**Profile: `GET` / `PATCH /admin/practitioners/7`**

Live today: name "Megha", title "Psychologist", languages `["English"]`, `yearsExperience: 0`, modes `["video"]`, 50-minute sessions, all 5 services, `email: megha@paperskinandsynapses.com`. The name, title, summary, languages and years are placeholders that Megha should fill in.

| Field | Rule | Effect |
| --- | --- | --- |
| `name` | 2–120 | Patient emails ("… with Megha") and `GET /practitioners` |
| `title` | 2–160 | Profile |
| `focus` | up to 200 | One-line specialism |
| `summary` | up to 4000, line breaks kept | Profile text |
| `yearsExperience` | 0–80 | Hide on the site when 0 |
| `languages` | 1–20 items, 2–40 chars each | Tag input |
| `modes` | at least one of `in_person`, `video` | Must stay `["video"]` while the site says "online only": the form sends `mode: "video"`, and anything Megha doesn't offer is refused |
| `sessionMinutes` | 15–240 | Default session length |
| `email` | valid email or `null` | Where Confirm/Decline emails go |
| `serviceIds` | existing service ids | Replaces her list. Keep all active services, or the form's missing ones fail |
| `isActive`, `slug`, `sortOrder` | – | Don't expose: deactivating Megha leaves nobody to book |

**Weekly hours: `PUT /admin/practitioners/7/working-hours`**

The body **replaces the whole week**: send every working day, and leave a day out to make it a day off. Rules: `HH:MM`, start before end, up to 21 rows, no overlaps within a day. The response is the saved list, and existing bookings are not moved.

```ts
await cms.putHours(7, [1, 2, 3, 4, 5].map((weekday) => ({ weekday, start: '09:00', end: '17:00' })))
```

**How her hours become slots.** While Megha is the only psychologist, start times come from her hours: one every 60 minutes from her start time, as long as the session (50 min) fits before her end time and doesn't overlap a break in Settings (13:00–14:00 on weekdays). Her 09:00–17:00 gives 09, 10, 11, 12, 14, 15 and 16. If she changes to 10:00–19:00, slots become 10, 11, 12, 14, 15, 16, 17 and 18 with no other change. The Settings **slot grid** still decides which weekdays are open at all: a weekday missing from the grid stays closed even if she has hours that day.

**Time off: holidays and leave**

| Call | Body | Result |
| --- | --- | --- |
| `GET /admin/time-off` | – | Upcoming entries `{ id, practitionerId, startsAt, endsAt, reason }` (`YYYY-MM-DD HH:MM:SS`, IST) |
| `GET /admin/practitioners/7/schedule` | – | `{ practitioner, timeOff }` in one call |
| `POST /admin/time-off` | `{ startsAt: "2026-12-24 00:00", endsAt: "2026-12-26 00:00", reason?, practitionerId?: 7 }` | `201 { data: { id, …, clashingBookings: [{ reference, starts_at }] } }` |
| `DELETE /admin/time-off/{id}` | – | `204` |

`endsAt` is exclusive: a whole day is `D 00:00` → `D+1 00:00`. With `practitionerId` left out, it's a clinic-wide closure, the same thing while Megha is the only psychologist. Time off hides those slots from the booking form at once, but **existing bookings are not cancelled**. Show `clashingBookings` after saving, each linked to its appointment, so Megha can reschedule or cancel them.

## Clinic settings screen

One form for clinic-wide values. `GET /admin/settings` returns all of them. `PATCH /admin/settings` takes any subset and returns the full set again. It's all-or-nothing: one bad key rejects the whole request with `422`, listing each bad key under its own name. Unknown keys are refused too.

| Key | Type and rule | Live value | Used for |
| --- | --- | --- | --- |
| `clinicName` | string 2–300 | Paper, Skin & Synapses | `GET /clinic` |
| `phone` | phone-like, 6–20 chars | +91 98400 52230 | `GET /clinic`, every patient email |
| `email` | email | megha@paperskinandsynapses.com | `GET /clinic`; copied on owner emails |
| `address` | string 2–300 | 14 Banyan Grove Road, Alwarpet, … | In-person confirmations (unused while online only) |
| `openingHoursText` | string 2–300 | Monday to Friday, 9:00 AM to 5:00 PM (IST) · Online | `GET /clinic` display text |
| `languages` | 1–20 strings | English, Tamil, Hindi, Telugu, Malayalam | `GET /clinic` |
| `emergency` | `{ police, teleManas }` | 112 / 14416 | Crisis banner |
| `slotGrid` | `{ "1": ["09:00", …], … }` weekday → times | Mon–Fri: 09, 10, 11, 12, 14, 15, 16 | Which weekdays are open. Times apply when there are several psychologists. |
| `breaks` | `{ "1": [["13:00","14:00"]], … }` | Mon–Fri 13:00–14:00 | No session may overlap |
| `minLeadMinutes` | int 0–10080 | 120 | Earliest bookable slot from now |
| `maxDaysAhead` | int 1–365 | 90 | Booking window |
| `maxPendingPerPhone` | int 1–20 | 3 | Anti-spam: pending requests per phone or email |
| `copyOwnerOnPractitionerBookings` | bool | true | Copy `email` on owner emails (same address today, so one email) |
| `siteUrl` | https URL | https://paperskinandsynapses.com | Builds the patient's link: `<siteUrl>/booking/manage/?ref=…&token=…` |

```ts
const s = await cms.settings()
await cms.updateSettings({
  minLeadMinutes: 1440,                               // book at least a day ahead
  slotGrid: { ...s.slotGrid, 6: ['10:00', '11:00'] },  // open Saturdays too
})
```

**Form tips**

- `slotGrid` and `breaks` **replace the whole map**. Start from the current value and change one day, as above. A day with `[]`, or left out, is closed.
- Keys come back as strings (`"1"`). If all seven days 0–6 are present, the map arrives as a 7-item array, so index by weekday either way.
- Opening a weekday in the grid only gives slots if Megha also has working hours that day (Profile screen). Changing `openingHoursText` changes text only, not availability.
- `siteUrl` must point at the live site: a wrong value breaks the manage links in every new patient email.
- Not editable here: email server settings and secrets, which live in the server's `booking-api/.env`.

## Clients screen

Clients are created by bookings, never by hand. A returning patient is matched by phone, or by email when there is no phone (the usual case from the site), plus the same name. Their details are updated rather than duplicated.

| Call | Body | Result |
| --- | --- | --- |
| `GET /admin/clients?q=` | – | Up to 50, newest first: `{ id, name, phone, email, address, createdAt, appointments }`. `appointments` is a count. |
| `GET /admin/clients/{id}` | – | `{ id, name, phone, email, address, createdAt, updatedAt, appointments: [{ id, reference, status, startsAt, practitioner, service }] }` |
| `PATCH /admin/clients/{id}` | `{ name?, phone?, email?, address? }` | Updated detail. Same rules as the booking form; `""` clears email or address. Phone can be changed but not cleared. |
| `DELETE /admin/clients/{id}` | – | `204` erased, or `409 CLIENT_HAS_BOOKINGS` |

- `q` matches part of a name, phone or email. Phones are stored as `+91XXXXXXXXXX`, so search by the last digits.
- `phone` and `address` are `null` for most site bookings. Show "Not given" rather than empty cells.
- Link each appointment row to `/admin/appointments/view/?id=…`.

**Erase (DPDP right to erasure)** is permanent. The name becomes "Erased client" and the phone `erased-<id>`, and the email, address and every booking's concern, notes, messages and cancel reason are cleared. Booking rows stay, anonymised, for counts. It's refused while the client has an upcoming `pending` or `confirmed` booking: cancel those first. Put it behind a confirmation dialog that names the client and says it can't be undone.

## Staff logins screen

Today the only login is Megha's: user id 1, `admin`, linked to practitioner 7. This screen is for adding a receptionist later and resetting forgotten passwords.

| Call | Body | Result |
| --- | --- | --- |
| `GET /admin/users` | – | `{ data: User[] }`: `{ id, email, name, role, practitionerId, isActive, lastLoginAt }` |
| `POST /admin/users` | `{ email, name, password, role: "admin" \| "practitioner", practitionerId? }` | `201 { data: User }` |
| `PATCH /admin/users/{id}` | `{ name?, email?, role?, practitionerId?, isActive? }` | `{ data: User }` |
| `POST /admin/users/{id}/password` | `{ newPassword }` | `204`; that user's existing sessions end |

| Rule | Error |
| --- | --- |
| Passwords are 12–200 characters | `422 fields.password` (create) / `fields.newPassword` (reset) |
| Emails are unique, stored lower-case | `409 EMAIL_TAKEN` |
| A `practitioner` login must have `practitionerId` | `422 fields.practitionerId` |
| You can't deactivate yourself or drop your own admin role | `409 SELF_LOCKOUT` |
| At least one active admin must remain | `409 LAST_ADMIN` |

- There is no delete: **Deactivate** (`isActive: false`) blocks sign-in at once.
- `role: "admin"` sees everything. `practitioner` only reaches `/practitioner/...` routes for its own bookings, which is for a future colleague, not a receptionist.
- When creating a login, generate a strong temporary password in the UI, show it once, and ask the person to change it with `POST /auth/password` after signing in.
- Put Megha's own **Change password** form here too (or under her name in the header), using `POST /auth/password` from the sign-in section.

## Appendix: types and a typed CMS client

The types match the live responses as of the date above. Nullable fields are always present and `null`, never missing. Booking timestamps (`startsAt`, `createdAt`, …) are ISO with `+05:30`. Client, time-off and history times are IST `YYYY-MM-DD HH:MM:SS` strings, so parse them as IST.

```ts
// lib/cms/types.ts
import type { ApiBooking, BookingStatus } from '@/lib/booking/api'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6   // 0 = Sunday
export type Mode = 'in_person' | 'video'
export type Paged<T> = { data: T[]; meta: { page: number; perPage: number; total: number } }

export interface User { id: number; email: string; name: string; role: 'admin' | 'practitioner'; practitionerId: number | null; isActive: boolean; lastLoginAt: string | null }
export interface Summary { pending: number; unassignedPending: number; today: number; upcomingConfirmed: number }

export interface StaffAppointment extends ApiBooking {
  id: number
  client: { id: number; name: string; phone: string | null; email: string | null; address: string | null }
  concern: string | null; organisation: string | null; source: 'web' | 'staff'
  staffNotes: string | null; cancelReason: string | null; createdAt: string; confirmedAt: string | null
  history?: { actor: string; action: string; detail: string | null; at: string }[]   // detail endpoint only
}
export type AppointmentAction = 'confirm' | 'decline' | 'reschedule' | 'cancel' | 'complete' | 'no-show' | 'notes'

export interface AdminService {
  id: number; slug: string; name: string; description: string; suitableFor: string; durationMinutes: number
  bookingType: 'individual' | 'enquiry'; price: { amount: number; currency: 'INR' } | null
  sortOrder: number; isActive: boolean; practitionerIds: number[]
}
export type ServiceInput = Partial<Omit<AdminService, 'id' | 'price'>> & { price?: number | null }

export interface WorkingHours { weekday: Weekday; start: string; end: string }
export interface AdminPractitioner {
  id: number; slug: string; name: string; title: string; focus: string; summary: string; yearsExperience: number
  languages: string[]; modes: Mode[]; sessionMinutes: number; services: string[]
  workingHours: (WorkingHours & { day: string })[]; email: string | null; isActive: boolean; sortOrder: number
}
export type PractitionerInput = Partial<Omit<AdminPractitioner, 'id' | 'services' | 'workingHours'>> & { serviceIds?: number[] }

export interface TimeOff { id: number; practitionerId: number | null; startsAt: string; endsAt: string; reason: string | null }
export interface ClientListItem { id: number; name: string; phone: string | null; email: string | null; address: string | null; createdAt: string; appointments: number }
export interface ClientDetail extends Omit<ClientListItem, 'appointments'> {
  updatedAt: string
  appointments: { id: number; reference: string; status: BookingStatus; startsAt: string; practitioner: string | null; service: string | null }[]
}
export interface Settings {
  clinicName: string; phone: string; email: string; address: string; openingHoursText: string; languages: string[]
  emergency: { police: string; teleManas: string }
  slotGrid: Record<number, string[]>; breaks: Record<number, [string, string][]>
  minLeadMinutes: number; maxDaysAhead: number; maxPendingPerPhone: number
  copyOwnerOnPractitionerBookings: boolean; siteUrl: string
}
```

```ts
// lib/cms/api.ts
import { BookingApiError } from '@/lib/booking/api'
import { session } from '@/lib/cms/session'
import type * as T from '@/lib/cms/types'

const API = (process.env.NEXT_PUBLIC_BOOKING_API ?? 'https://api.paperskinandsynapses.com/api/v1').replace(/\/$/, '')

async function request<R>(path: string, init: { method?: string; body?: unknown } = {}): Promise<R> {
  const token = session.get()
  let res: Response
  try {
    res = await fetch(`${API}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new BookingApiError(0, 'NETWORK', 'Can’t reach the booking service. Check the connection and try again.')
  }
  if (res.status === 204) return undefined as R
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && token) session.clear()   // back to sign-in
    const e = json?.error
    throw new BookingApiError(res.status, e?.code ?? 'HTTP_ERROR', e?.message ?? 'Something went wrong.', e?.details?.fields ?? {})
  }
  return json as R
}

const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)]))
  return s.size ? `?${s}` : ''
}
const data = <R,>(p: Promise<{ data: R }>) => p.then((r) => r.data)

export const cms = {
  // session
  login: (email: string, password: string) =>
    request<{ data: { token: string; expiresAt: string; user: T.User } }>('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => data(request<{ data: T.User }>('/auth/me')),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/auth/password', { method: 'POST', body: { currentPassword, newPassword } }),

  // dashboard + appointments
  summary: () => data(request<{ data: T.Summary }>('/admin/summary')),
  appointments: (f: { status?: string; from?: string; to?: string; q?: string; page?: number; perPage?: number } = {}) =>
    request<T.Paged<T.StaffAppointment>>(`/admin/appointments${qs(f)}`),
  appointment: (id: number) => data(request<{ data: T.StaffAppointment }>(`/admin/appointments/${id}`)),
  act: (id: number, action: T.AppointmentAction, body: Record<string, unknown> = {}) =>
    data(request<{ data: T.StaffAppointment }>(`/admin/appointments/${id}/${action}`, { method: 'POST', body })),
  createAppointment: (body: Record<string, unknown>) => request<{ data: unknown }>('/admin/appointments', { method: 'POST', body }),

  // services
  services: () => data(request<{ data: T.AdminService[] }>('/admin/services')),
  createService: (body: T.ServiceInput) => data(request<{ data: T.AdminService }>('/admin/services', { method: 'POST', body })),
  updateService: (id: number, body: T.ServiceInput) => data(request<{ data: T.AdminService }>(`/admin/services/${id}`, { method: 'PATCH', body })),
  deleteService: (id: number) => request<void>(`/admin/services/${id}`, { method: 'DELETE' }),

  // profile, hours, time off
  practitioner: (id: number) => data(request<{ data: T.AdminPractitioner }>(`/admin/practitioners/${id}`)),
  updatePractitioner: (id: number, body: T.PractitionerInput) =>
    data(request<{ data: T.AdminPractitioner }>(`/admin/practitioners/${id}`, { method: 'PATCH', body })),
  putHours: (id: number, hours: T.WorkingHours[]) =>
    data(request<{ data: T.WorkingHours[] }>(`/admin/practitioners/${id}/working-hours`, { method: 'PUT', body: { hours } })),
  timeOff: () => data(request<{ data: T.TimeOff[] }>('/admin/time-off')),
  addTimeOff: (body: { startsAt: string; endsAt: string; reason?: string; practitionerId?: number }) =>
    data(request<{ data: T.TimeOff & { clashingBookings: { reference: string; starts_at: string }[] } }>('/admin/time-off', { method: 'POST', body })),
  deleteTimeOff: (id: number) => request<void>(`/admin/time-off/${id}`, { method: 'DELETE' }),

  // settings
  settings: () => data(request<{ data: T.Settings }>('/admin/settings')),
  updateSettings: (patch: Partial<T.Settings>) => data(request<{ data: T.Settings }>('/admin/settings', { method: 'PATCH', body: patch })),

  // clients
  clients: (q = '') => data(request<{ data: T.ClientListItem[] }>(`/admin/clients${qs({ q })}`)),
  client: (id: number) => data(request<{ data: T.ClientDetail }>(`/admin/clients/${id}`)),
  updateClient: (id: number, body: Partial<Pick<T.ClientDetail, 'name' | 'phone' | 'email' | 'address'>>) =>
    data(request<{ data: T.ClientDetail }>(`/admin/clients/${id}`, { method: 'PATCH', body })),
  eraseClient: (id: number) => request<void>(`/admin/clients/${id}`, { method: 'DELETE' }),

  // staff logins
  users: () => data(request<{ data: T.User[] }>('/admin/users')),
  createUser: (body: { email: string; name: string; password: string; role: T.User['role']; practitionerId?: number }) =>
    data(request<{ data: T.User }>('/admin/users', { method: 'POST', body })),
  updateUser: (id: number, body: Partial<Pick<T.User, 'name' | 'email' | 'role' | 'practitionerId' | 'isActive'>>) =>
    data(request<{ data: T.User }>(`/admin/users/${id}`, { method: 'PATCH', body })),
  resetPassword: (id: number, newPassword: string) =>
    request<void>(`/admin/users/${id}/password`, { method: 'POST', body: { newPassword } }),
}
```

## Testing

Build and click through the CMS against a **local API**. Production now holds real patients' bookings and emails Megha on every change.

**Local API (recommended for development)**

1. Clone `KishoreKumar-28/paperskinandsynapses` and follow its README: `composer install`, copy `.env.example` to `.env`, then `php bin/migrate.php --seed`. This gives SQLite with emails written to `storage/logs/mail.log`, not sent.
2. Create a local admin linked to Megha's profile (so `/auth/me` returns a `practitionerId`) with `php bin/create-user.php admin you@example.com "Local Admin"` megha.
3. Run `composer serve` for the API at `http://127.0.0.1:8080`.
4. In the site, set `NEXT_PUBLIC_BOOKING_API=http://127.0.0.1:8080/api/v1` in `.env.local` and run `npm run dev` on port **3000**. The local API's CORS allows `localhost:3000`, and the dev CSP allows `127.0.0.1:8080`.

The local seed is the original prototype data (8 services, different hours). Use the CMS screens you're building to match production, which is a good first test anyway.

**Checking the live API.** `php bin/live-check.php https://api.paperskinandsynapses.com/api/v1 megha@paperskinandsynapses.com .env.production.secrets` runs about 55 checks across every CMS screen's endpoints. It reverts everything it changes and sends no emails. It needs the git-ignored secrets file, so the backend owner runs it.

**If you must test on production**

- Book only with Megha's own address as the patient email, and cancel the booking straight after.
- Revert settings and profile edits you make. Hide, don't delete, real services.
- Never erase a real client. Erasure is permanent.
- Never paste a staff token or a patient's manage link into tickets, chats or screenshots.

**Acceptance checklist**

- [ ] Signing in, an expired token, and a `401` all land on the sign-in form; signing out clears the token
- [ ] Dashboard counters match `GET /admin/summary`
- [ ] Confirm, decline, reschedule and cancel each show the new status, and the action buttons follow the rules in the table
- [ ] Service edits show on the site's form and `GET /services`. Hiding asks for confirmation, and delete offers Hide on `409`
- [ ] A profile edit shows in `GET /practitioners/megha`. An hours change shows in the booking calendar
- [ ] Time off closes those days in the booking calendar, and `clashingBookings` are shown
- [ ] Settings show `422` messages per field. `slotGrid` edits keep the other days
- [ ] Client erase is behind a named confirmation dialog
- [ ] `/admin/` pages are `noindex` and absent from the sitemap
