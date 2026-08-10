/**
 * Считает пики аудиодорожки один раз на этапе разработки.
 *
 * Почему не в браузере: голосовое записано в ogg/opus, а Safari его не декодирует
 * ни через <audio>, ни через decodeAudioData — волна бы просто не нарисовалась.
 * Плюс клиенту не нужно тянуть и декодировать весь файл только ради картинки.
 * Результат вставляется в lib/content.ts как обычный массив чисел.
 *
 * Запуск: node scripts/audio-peaks.mjs public/audio/about-ilya.ogg 64
 */
import { readFile } from 'node:fs/promises'
import decode from 'audio-decode'

const [file = 'public/audio/about-ilya.ogg', barsArg = '64'] = process.argv.slice(2)
const bars = Number(barsArg)

const audio = await decode(await readFile(file))
const samples = audio.channelData[0]
const duration = samples.length / audio.sampleRate
const perBar = Math.floor(samples.length / bars)

const peaks = []
for (let bar = 0; bar < bars; bar += 1) {
  let sumOfSquares = 0
  for (let i = 0; i < perBar; i += 1) {
    const sample = samples[bar * perBar + i]
    sumOfSquares += sample * sample
  }
  // RMS, а не максимум: максимум даёт почти ровный частокол из-за отдельных щелчков,
  // а RMS показывает реальную громкость и в волне читаются слова и паузы.
  peaks.push(Math.sqrt(sumOfSquares / perBar))
}

const loudest = Math.max(...peaks)
const normalized = peaks.map((peak) => Math.round((peak / loudest) * 100) / 100)

console.log(JSON.stringify({ duration: Math.round(duration), peaks: normalized }))
