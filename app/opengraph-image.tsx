import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site, hero, seo, services } from '@/lib/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = seo.ogAlt

/**
 * OG-превью собирается через satori, а не рисуется в редакторе: заголовок,
 * направления и цифры берутся из lib/content.ts, поэтому карточка в
 * Telegram и в поиске не может разойтись с тем, что написано на странице.
 *
 * Шрифт читается из assets/ — в окружении сборки системных шрифтов нет
 * вообще, satori без переданного файла падает. Inter вместо Oswald с
 * сайта осознанно: у Oswald узкий рисунок, и в 1200×630 заголовок из
 * шести слов на нём читается хуже, чем на обычной пропорции.
 */
export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/Inter-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/Inter-Bold.ttf')),
  ])

  const black = '#161717'
  const yellow = '#ea9807'
  const white = '#fdfcfc'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: black,
        color: white,
        padding: '64px 72px',
        // Жёлтая полоса сверху — единственный декоративный элемент карточки:
        // в ленте Telegram превью показывается уменьшенным, и по этой
        // полосе бренд узнаётся раньше, чем прочитан заголовок
        borderTop: `16px solid ${yellow}`,
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', fontSize: 30, color: yellow, letterSpacing: '0.04em' }}>
          {site.name.toUpperCase()} · {site.areaServed.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: 'flex' }}>{hero.h1Line1}</div>
          <div style={{ display: 'flex' }}>{hero.h1Line2}</div>
        </div>
      </div>

      {/* Направления в две строки — они же ответ на «а это про меня?».
          Список идёт из services, поэтому добавленное направление попадает
          в превью само, без правки этого файла */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {services.map((service) => (
          <div
            key={service.slug}
            style={{
              display: 'flex',
              border: `2px solid ${yellow}`,
              color: white,
              fontSize: 26,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            {service.navTitle}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 44 }}>
          {[
            { value: `${site.experienceYears} лет`, label: 'на рынке' },
            { value: `${site.objectsBuilt}+`, label: 'объектов' },
            { value: `до ${site.warrantyYears} лет`, label: 'гарантия' },
            { value: '0 ₽', label: 'замер' },
          ].map((fact) => (
            <div key={fact.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', fontSize: 46, fontWeight: 700, color: yellow }}>
                {fact.value}
              </div>
              <div style={{ display: 'flex', fontSize: 24, color: '#a3a3a1' }}>{fact.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700 }}>{site.phone}</div>
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
