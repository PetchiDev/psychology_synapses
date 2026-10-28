import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const dynamic = 'force-static'

export const alt = `${siteConfig.name}: ${siteConfig.disciplines.join(', ')}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/logo/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          padding: '64px 80px 64px 72px',
          background: '#f3e9d8',
          color: '#2b1e1a',
        }}
      >
        <div style={{ display: 'flex', flex: 1, height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, letterSpacing: 2, textTransform: 'uppercase', color: '#6b4f3a' }}>{siteConfig.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontSize: 80, lineHeight: 1.02, letterSpacing: -2, maxWidth: 760 }}>Every mind has more than one story.</div>
            <div style={{ fontSize: 28, color: '#6b4f3a', maxWidth: 760 }}>{siteConfig.disciplines.join(' · ')}</div>
          </div>
          <div style={{ display: 'flex', height: 10, width: '100%', background: '#d7c1a7', borderRadius: 999 }}>
            <div style={{ width: '32%', height: 10, background: '#6a1f26', borderRadius: 999 }} />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={226} height={480} />
      </div>
    ),
    size,
  )
}
