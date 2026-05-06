//albums.ts
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../db.js'

export const albumsRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>('/albums/:id', async (request) => {
    return prisma.album.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        artist: true,
        additionalArtists: { include: { artist: true } },
        tracks: {
          orderBy: { trackNumber: 'asc' },
          include: { featArtists: { include: { artist: true } } },
        },
      },
    })
  })

  app.patch<{
    Params: { id: string }
    Body: { title?: string; year?: number | null; coverUrl?: string | null }
  }>('/albums/:id', async (request) => {
    return prisma.album.update({
      where: { id: request.params.id },
      data: request.body,
    })
  })

  app.post<{ Params: { id: string }; Body: { artistId: string } }>(
    '/albums/:id/artists',
    async (request) => {
      return prisma.albumArtist.create({
        data: { albumId: request.params.id, artistId: request.body.artistId },
        include: { artist: true },
      })
    }
  )

  app.delete<{ Params: { id: string; artistId: string } }>(
    '/albums/:id/artists/:artistId',
    async (request) => {
      return prisma.albumArtist.delete({
        where: {
          albumId_artistId: {
            albumId: request.params.id,
            artistId: request.params.artistId,
          },
        },
      })
    }
  )
}
