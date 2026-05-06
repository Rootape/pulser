//tracks.ts
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'
import ffmpeg from 'fluent-ffmpeg'

export const tracksRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>('/tracks/:id', async (request) => {
    return prisma.track.findUniqueOrThrow({
      where: { id: request.params.id },
      include: { featArtists: { include: { artist: true } } },
    })
  })

  app.get<{ Params: { id: string }; Querystring: { mono?: string } }>(
    '/tracks/:id/stream',
    async (request, reply) => {
      const track = await prisma.track.findUniqueOrThrow({
        where: { id: request.params.id },
      })

      const channels = request.query.mono === 'true' ? 1 : 2

      void reply.header('Content-Type', 'audio/aac')

      const command = ffmpeg(track.filePath)
        .noVideo()
        .audioChannels(channels)
        .audioCodec('aac')
        .audioBitrate(256)
        .format('adts')

      command.on('error', () => {})

      const stream = command.pipe()

      request.raw.on('close', () => command.kill('SIGKILL'))

      return reply.send(stream)
    }
  )

  app.patch<{
    Params: { id: string }
    Body: { title?: string; trackNumber?: number | null }
  }>('/tracks/:id', async (request) => {
    return prisma.track.update({
      where: { id: request.params.id },
      data: request.body,
    })
  })

  app.post<{ Params: { id: string }; Body: { artistId: string } }>(
    '/tracks/:id/artists',
    async (request) => {
      return prisma.trackArtist.create({
        data: { trackId: request.params.id, artistId: request.body.artistId },
        include: { artist: true },
      })
    }
  )

  app.delete<{ Params: { id: string; artistId: string } }>(
    '/tracks/:id/artists/:artistId',
    async (request) => {
      return prisma.trackArtist.delete({
        where: {
          trackId_artistId: {
            trackId: request.params.id,
            artistId: request.params.artistId,
          },
        },
      })
    }
  )
}
