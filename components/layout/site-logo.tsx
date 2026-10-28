import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

type Tone = 'dark' | 'light'

const MARK = {
  dark: '/images/logo/logo-mark.png',
  light: '/images/logo/logo-mark-light.png',
} as const

export function LogoMark({ className, tone = 'dark' }: { className?: string; tone?: Tone }) {
  return <Image src={MARK[tone]} alt="" width={62} height={132} priority={tone === 'dark'} className={cn('h-10 w-auto', className)} />
}

export function SiteLogo({ className, tone = 'dark' }: { className?: string; tone?: Tone }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className={cn('group inline-flex min-w-0 items-center gap-2 rounded-full outline-offset-4 sm:gap-2.5', className)}
    >
      <LogoMark
        tone={tone}
        className="-my-1 h-11 shrink-0 origin-bottom transition-transform duration-700 ease-(--ease-paper) group-hover:-rotate-6 sm:h-[3.25rem]"
      />
      <span
        className={cn(
          'truncate py-[0.22em] font-serif text-[clamp(1rem,0.55rem+2.2vw,1.35rem)] leading-[1.15] font-semibold tracking-[0.01em] whitespace-nowrap',
          tone === 'dark' ? 'text-shadow' : 'text-paper',
        )}
      >
        Paper Skin <span className={tone === 'dark' ? 'text-burgundy' : 'text-gold'}>&amp;</span> Synapses
      </span>
    </Link>
  )
}
