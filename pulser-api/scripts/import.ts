import 'dotenv/config'
import path from 'node:path'
import fs from 'node:fs'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })
const MUSIC_PATH = process.env['MUSIC_PATH'] ?? ''
const COVERS_PATH = process.env['COVERS_PATH'] ?? './public/covers'
const AUDIO_EXT = new Set(['.flac', '.mp3', '.m4a', '.ogg', '.wav', '.aac'])

function findAudioFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...findAudioFiles(full))
    else if (AUDIO_EXT.has(path.extname(entry.name).toLowerCase())) files.push(full)
  }
  return files
}

async function importFile(filePath: string): Promise<void> {
  const { parseFile } = await import('music-metadata')
  const { common, format } = await parseFile(filePath)

  const artistName = common.artist ?? 'Unknown Artist'
  const albumTitle = common.album ?? 'Unknown Album'
  const title = common.title ?? path.basename(filePath, path.extname(filePath))

  const artist = await prisma.artist.upsert({
    where: { name: artistName },
    create: { name: artistName },
    update: {},
  })

  let coverUrl: string | null = null
  const pic = common.picture?.[0]
  if (pic) {
    fs.mkdirSync(COVERS_PATH, { recursive: true })
    const slug = albumTitle.replace(/[^a-z0-9]/gi, '_')
    const filename = `${artist.id}_${slug}.jpg`
    const dest = path.join(COVERS_PATH, filename)
    if (!fs.existsSync(dest)) fs.writeFileSync(dest, pic.data)
    coverUrl = `/public/covers/${filename}`
  }

  const album = await prisma.album.upsert({
    where: { title_artistId: { title: albumTitle, artistId: artist.id } },
    create: { title: albumTitle, year: common.year ?? null, coverUrl, artistId: artist.id },
    update: { year: common.year ?? null, coverUrl },
  })

  await prisma.track.upsert({
    where: { filePath },
    create: {
      title,
      duration: format.duration ?? null,
      filePath,
      trackNumber: common.track.no ?? null,
      albumId: album.id,
    },
    update: {
      title,
      duration: format.duration ?? null,
      trackNumber: common.track.no ?? null,
    },
  })
}

async function main(): Promise<void> {
  if (!MUSIC_PATH) {
    console.error('MUSIC_PATH not set in .env')
    process.exit(1)
  }

  const files = findAudioFiles(MUSIC_PATH)
  console.log(`Found ${files.length} audio files in ${MUSIC_PATH}`)

  let ok = 0
  let fail = 0
  for (const file of files) {
    try {
      await importFile(file)
      ok++
      if (ok % 10 === 0) process.stdout.write(`${ok}/${files.length}\r`)
    } catch (err) {
      console.error(`\nFailed: ${file}`, err)
      fail++
    }
  }

  console.log(`\nDone: ${ok} imported, ${fail} failed`)
  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
