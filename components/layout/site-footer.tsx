import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { doctors } from '@/data/doctors'
import { fullAddress, mainNav, siteConfig } from '@/lib/site'
import { SiteLogo } from './site-logo'

export function SiteFooter() {
  return (
    <footer className="relative mt-24 bg-shadow text-paper/85">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="grid content-start gap-5">
          <SiteLogo tone="light" />
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-paper/75">{siteConfig.tagline}. Confidential psychological support for adults, children, couples and families.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="type-eyebrow mb-5 font-sans text-latte">Explore</h2>
          <ul className="grid gap-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[0.95rem] text-paper/85 transition-colors hover:text-paper hover:underline hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="type-eyebrow mb-5 font-sans text-latte">Specialists</h2>
          <ul className="grid gap-3">
            {doctors.map((doctor) => (
              <li key={doctor.slug}>
                <Link
                  href={`/specialists/${doctor.slug}`}
                  className="text-[0.95rem] text-paper/85 transition-colors hover:text-paper hover:underline hover:underline-offset-4"
                >
                  {doctor.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="type-eyebrow mb-5 font-sans text-latte">Visit or call</h2>
          <address className="grid gap-4 text-[0.95rem] not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {fullAddress()}
            </p>
            <a href={siteConfig.phoneHref} className="flex gap-3 hover:text-paper hover:underline hover:underline-offset-4">
              <Phone className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex gap-3 break-all hover:text-paper hover:underline hover:underline-offset-4">
              <Mail className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.email}
            </a>
            <p className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.hoursLabel}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-editorial grid gap-4 py-8 text-sm text-paper/65 md:grid-cols-[1fr_auto] md:items-center">
          <p>
            <strong className="font-semibold text-paper">Not for emergencies.</strong> If you or someone else is in immediate danger, call{' '}
            <a href={`tel:${siteConfig.crisis.emergency}`} className="font-semibold text-paper underline underline-offset-4">
              {siteConfig.crisis.emergency}
            </a>
            . For 24×7 emotional support, call Tele-MANAS on{' '}
            <a href={siteConfig.crisis.href} className="font-semibold text-paper underline underline-offset-4">
              {siteConfig.crisis.number}
            </a>
            .
          </p>
          <p>
            © {siteConfig.legalName} · Caring since {siteConfig.foundingYear}
          </p>
        </div>
      </div>
    </footer>
  )
}
