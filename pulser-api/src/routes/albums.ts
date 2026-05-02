import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'

export const albumsRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>('/albums/:id', async (request) => {
    return prisma.album.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        artist: true,
        tracks: { orderBy: { trackNumber: 'asc' } },
      },
    })
  })
}
