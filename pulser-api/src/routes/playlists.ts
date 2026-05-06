//playlist.ts
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'

export const playlistsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/playlists', async () => {
    return prisma.playlist.findMany({ orderBy: { createdAt: 'desc' } })
  })

  app.post<{ Body: { name: string } }>('/playlists', async (request) => {
    return prisma.playlist.create({ data: { name: request.body.name } })
  })

  app.patch<{ Params: { id: string }; Body: { name: string } }>(
    '/playlists/:id',
    async (request) => {
      return prisma.playlist.update({
        where: { id: request.params.id },
        data: { name: request.body.name },
      })
    }
  )

  app.get<{ Params: { id: string } }>('/playlists/:id', async (request) => {
    return prisma.playlist.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        tracks: {
          orderBy: { position: 'asc' },
          include: {
            track: {
              include: {
                album: { include: { artist: true } },
                featArtists: { include: { artist: true } },
              },
            },
          },
        },
      },
    })
  })

  app.post<{ Params: { id: string }; Body: { trackId: string } }>(
    '/playlists/:id/tracks',
    async (request) => {
      const last = await prisma.playlistTrack.findFirst({
        where: { playlistId: request.params.id },
        orderBy: { position: 'desc' },
      })
      return prisma.playlistTrack.create({
        data: {
          playlistId: request.params.id,
          trackId: request.body.trackId,
          position: (last?.position ?? 0) + 1,
        },
      })
    }
  )

  app.delete<{ Params: { id: string; trackId: string } }>(
    '/playlists/:id/tracks/:trackId',
    async (request) => {
      return prisma.playlistTrack.delete({
        where: {
          playlistId_trackId: {
            playlistId: request.params.id,
            trackId: request.params.trackId,
          },
        },
      })
    }
  )

  app.delete<{ Params: { id: string } }>('/playlists/:id', async (request) => {
    await prisma.playlistTrack.deleteMany({
      where: { playlistId: request.params.id },
    })
    return prisma.playlist.delete({ where: { id: request.params.id } })
  })
}
