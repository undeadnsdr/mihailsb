import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site, hero, seo } from '@/lib/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = seo.ogTitle

/**
 * OG-превью собирается через satori, а не в графическом редакторе:
 * цена и срок берутся из lib/content.ts, поэтому карточка в Telegram
 * не может разойтись с ценой на странице.
 * Шрифт читается из assets/ — в системе sandbox шрифтов нет вообще.
 */
export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/Inter-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/Inter-Bold.ttf')),
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f5f6f8',
        color: '#111827',
        padding: '72px 80px',
        borderTop: '14px solid #163a5f',
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', fontSize: 30, color: '#667085' }}>
          {site.domain} · {site.city}
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {hero.h1}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
        <div style={{ display: 'flex', fontSize: 148, fontWeight: 700, color: '#163a5f', letterSpacing: '-0.04em', lineHeight: 1 }}>
          {hero.tiles[1].value} {hero.tiles[1].unit}
        </div>
        <div style={{ display: 'flex', fontSize: 34, paddingBottom: 18, color: '#111827' }}>
          вместе с доменом и хостингом
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {['Оплата после сдачи', 'Готово за 24 часа', 'Домен в подарок'].map((text) => (
          <div
            key={text}
            style={{
              display: 'flex',
              backgroundColor: '#163a5f',
              color: '#f5f6f8',
              fontSize: 27,
              fontWeight: 500,
              padding: '18px 30px',
              borderRadius: 14,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      ],
    },
  )
}
