//artists.ts
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'

export const artistsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/artists', async () => {
    return prisma.artist.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { albums: true } } },
    })
  })

  app.get<{ Params: { id: string } }>('/artists/:id', async (request) => {
    return prisma.artist.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        albums: {
          orderBy: { year: 'desc' },
          include: { _count: { select: { tracks: true } } },
        },
      },
    })
  })

  app.patch<{
    Params: { id: string }
    Body: { name?: string; bio?: string; imageUrl?: string }
  }>('/artists/:id', async (request) => {
    return prisma.artist.update({
      where: { id: request.params.id },
      data: request.body,
    })
  })
}
