import Link from 'next/link'
import { Clock, Mail, Monitor, Phone } from 'lucide-react'
import { legalNav, mainNav, siteConfig } from '@/lib/site'
import { WaveDivider } from '@/components/animations/wave-divider'
import { TakeBreathButton } from './take-breath-button'
import { SiteLogo } from './site-logo'

const exploreNav = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Ways to Work With Me', href: '/work-with-me' },
  ...mainNav.filter((item) => ['/library', '/#faq', '/contact'].includes(item.href)),
]

export function SiteFooter() {
  return (
    <footer className="relative mt-24 bg-shadow text-paper/85">
      <WaveDivider variant="cloud" className="absolute inset-x-0 bottom-[calc(100%-1px)] text-shadow" />
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-2 lg:py-20 xl:grid-cols-[1.3fr_0.9fr_1.3fr_1fr]">
        <div className="grid content-start gap-5">
          <SiteLogo tone="light" />
          <p className="-mt-2 text-[0.95rem] text-paper/85">
            {siteConfig.psychologist.name}, {siteConfig.psychologist.role}
          </p>
          <p className="max-w-sm text-[0.92rem] leading-relaxed text-paper/70">{siteConfig.disciplines.join(' · ')}</p>
          <p className="type-eyebrow text-gold">Psychology since {siteConfig.foundingYear}</p>
          <TakeBreathButton />
        </div>

        <nav aria-label="Footer">
          <h2 className="type-eyebrow mb-5 text-latte">Explore</h2>
          <ul className="grid gap-3">
            {exploreNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[0.95rem] text-paper/85 transition-colors hover:text-paper hover:underline hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="type-eyebrow mb-5 text-latte">Contact</h2>
          <address className="grid gap-4 text-[0.95rem] not-italic">
            <a href={`mailto:${siteConfig.email}`} className="flex gap-3 whitespace-nowrap hover:text-paper hover:underline hover:underline-offset-4">
              <Mail className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.email}
            </a>
            <a href={siteConfig.phoneHref} className="flex gap-3 hover:text-paper hover:underline hover:underline-offset-4">
              <Phone className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </address>
        </div>

        <div>
          <h2 className="type-eyebrow mb-5 text-latte">Availability</h2>
          <ul className="grid gap-4 text-[0.95rem]">
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.hoursLabel}
            </li>
            <li className="flex gap-3">
              <Monitor className="mt-0.5 size-4 shrink-0 text-latte" aria-hidden="true" />
              {siteConfig.modeNote}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-editorial grid gap-5 py-8 text-sm text-paper/65 lg:grid-cols-[1fr_auto] lg:items-center">
          <p>
            <strong className="font-semibold text-paper">Not for emergencies.</strong> If you or someone else is in immediate danger, contact your local
            emergency service. In India, call{' '}
            <a href="tel:112" className="font-semibold text-paper underline underline-offset-4">
              112
            </a>{' '}
            or Tele-MANAS on{' '}
            <a href="tel:14416" className="font-semibold text-paper underline underline-offset-4">
              14416
            </a>
            .
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-paper hover:underline hover:underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="lg:col-span-2">
            © {siteConfig.legalName} · Psychology since {siteConfig.foundingYear}
          </p>
        </div>
      </div>
    </footer>
  )
}
