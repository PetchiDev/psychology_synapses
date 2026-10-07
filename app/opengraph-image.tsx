import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const alt = `${siteConfig.name} — psychology and mental health hospital`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f7eedc',
          color: '#2b1e1a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: '#6a1f26', display: 'flex' }} />
          <div style={{ fontSize: 30, letterSpacing: 2, textTransform: 'uppercase', color: '#6b4f3a' }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>A quieter mind begins with being heard.</div>
          <div style={{ fontSize: 30, color: '#6b4f3a', maxWidth: 900 }}>
            {`Confidential psychological care in ${siteConfig.address.locality} — counselling, assessment, child psychology, couples and trauma support.`}
          </div>
        </div>
        <div style={{ display: 'flex', height: 10, width: '100%', background: '#d7c1a7', borderRadius: 999 }}>
          <div style={{ width: '32%', height: 10, background: '#6a1f26', borderRadius: 999 }} />
        </div>
      </div>
    ),
    size,
  )
}
