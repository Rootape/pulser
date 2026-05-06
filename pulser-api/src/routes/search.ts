//search.ts
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'

export const searchRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: { q?: string } }>('/tracks/search', async (request) => {
    const q = request.query.q?.trim()
    if (!q) return []

    return prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { album: { title: { contains: q, mode: 'insensitive' } } },
          { album: { artist: { name: { contains: q, mode: 'insensitive' } } } },
          {
            album: {
              additionalArtists: {
                some: { artist: { name: { contains: q, mode: 'insensitive' } } },
              },
            },
          },
          {
            featArtists: {
              some: { artist: { name: { contains: q, mode: 'insensitive' } } },
            },
          },
        ],
      },
      include: {
        album: { include: { artist: true } },
        featArtists: { include: { artist: true } },
      },
      take: 50,
    })
  })
}
