import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticPlugin from '@fastify/static'
import path from 'node:path'
import { tracksRoutes } from './routes/tracks.js'
import { artistsRoutes } from './routes/artists.js'
import { albumsRoutes } from './routes/albums.js'
import { playlistsRoutes } from './routes/playlists.js'
import { searchRoutes } from './routes/search.js'

async function start() {
  const app = Fastify({ logger: true })

  await app.register(cors, { origin: '*' })
  await app.register(staticPlugin, {
    root: path.resolve('public'),
    prefix: '/public/',
  })

  await app.register(tracksRoutes)
  await app.register(artistsRoutes)
  await app.register(albumsRoutes)
  await app.register(playlistsRoutes)
  await app.register(searchRoutes)

  const port = Number(process.env['PORT'] ?? 3000)
  await app.listen({ port, host: '0.0.0.0' })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
