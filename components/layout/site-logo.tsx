import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-10', className)} aria-hidden="true" focusable="false">
      <path d="M20 3c9.6 0 16.6 6.4 17 15.8.4 10.4-6 18-17 18.2C9.4 37.2 3 30 3.2 19.6 3.4 9.8 10.4 3 20 3Z" fill="#6a1f26" />
      <path
        d="M12 23.5c2.4-5 5.4-7.6 8-7.6s5.6 2.6 8 7.6M15 14.5l5 1.4 5-1.4M20 15.9v9.6"
        fill="none"
        stroke="#f7eedc"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="23.5" r="2" fill="#f7eedc" />
      <circle cx="28" cy="23.5" r="2" fill="#f7eedc" />
      <circle cx="15" cy="14.5" r="1.6" fill="#d7c1a7" />
      <circle cx="25" cy="14.5" r="1.6" fill="#d7c1a7" />
      <circle cx="20" cy="26.5" r="2.2" fill="#d7c1a7" />
    </svg>
  )
}

export function SiteLogo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className={cn('group inline-flex items-center gap-3 rounded-full outline-offset-4', className)}
    >
      <LogoMark className="transition-transform duration-700 ease-(--ease-paper) group-hover:rotate-[-8deg]" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif text-[1.4rem] tracking-tight', tone === 'dark' ? 'text-shadow' : 'text-paper')}>
          Paper, Skin
        </span>
        <span className={cn('type-eyebrow mt-1 text-[0.6rem]', tone === 'dark' ? 'text-coffee' : 'text-latte')}>
          &amp; Synapses
        </span>
      </span>
    </Link>
  )
}
