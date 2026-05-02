import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'
import ffmpeg from 'fluent-ffmpeg'

export const tracksRoutes: FastifyPluginAsync = async (app) => {
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
}
