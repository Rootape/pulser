// Troque pelo IP do seu PC na rede local (ex: 192.168.1.100)
export const API_BASE = 'http://192.168.15.13:3000'

export type Artist = {
  id: string
  name: string
  imageUrl: string | null
  bio: string | null
}

export type AlbumSummary = {
  id: string
  title: string
  year: number | null
  coverUrl: string | null
}

export type ArtistRef = { artist: { id: string; name: string } }

export type ArtistDetail = Artist & { albums: AlbumSummary[] }

export type TrackSummary = {
  id: string
  title: string
  duration: number | null
  trackNumber: number | null
  featArtists: ArtistRef[]
}

export type Album = AlbumSummary & {
  artist: { id: string; name: string }
  additionalArtists: ArtistRef[]
  tracks: TrackSummary[]
}

export type SearchTrack = {
  id: string
  title: string
  duration: number | null
  featArtists: ArtistRef[]
  album: AlbumSummary & { artist: { id: string; name: string } }
}

export type Playlist = { id: string; name: string; createdAt: string }

export type PlaylistDetail = Playlist & {
  tracks: { position: number; track: SearchTrack }[]
}

export function coverUri(url: string | null | undefined): string | null {
  if (!url) return null
  return `${API_BASE}${url}`
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json() as Promise<T>
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body != null ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json() as Promise<T>
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: body != null ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  artists: () => get<Artist[]>('/artists'),
  artist: (id: string) => get<ArtistDetail>(`/artists/${id}`),
  patchArtist: (id: string, body: { name?: string; bio?: string; imageUrl?: string }) =>
    patch<Artist>(`/artists/${id}`, body),

  album: (id: string) => get<Album>(`/albums/${id}`),
  patchAlbum: (id: string, body: { title?: string; year?: number | null; coverUrl?: string | null }) =>
    patch<AlbumSummary>(`/albums/${id}`, body),
  addAlbumArtist: (albumId: string, artistId: string) =>
    post<ArtistRef>(`/albums/${albumId}/artists`, { artistId }),
  removeAlbumArtist: (albumId: string, artistId: string) =>
    fetch(`${API_BASE}/albums/${albumId}/artists/${artistId}`, { method: 'DELETE' }),

  search: (q: string) => get<SearchTrack[]>(`/tracks/search?q=${encodeURIComponent(q)}`),
  track: (id: string) => get<TrackSummary>(`/tracks/${id}`),
  patchTrack: (id: string, body: { title?: string; trackNumber?: number | null }) =>
    patch<TrackSummary>(`/tracks/${id}`, body),
  addTrackArtist: (trackId: string, artistId: string) =>
    post<ArtistRef>(`/tracks/${trackId}/artists`, { artistId }),
  removeTrackArtist: (trackId: string, artistId: string) =>
    fetch(`${API_BASE}/tracks/${trackId}/artists/${artistId}`, { method: 'DELETE' }),

  playlists: () => get<Playlist[]>('/playlists'),
  playlist: (id: string) => get<PlaylistDetail>(`/playlists/${id}`),
  createPlaylist: (name: string) => post<Playlist>('/playlists', { name }),
  renamePlaylist: (id: string, name: string) => patch<Playlist>(`/playlists/${id}`, { name }),
  addToPlaylist: (playlistId: string, trackId: string) =>
    post<void>(`/playlists/${playlistId}/tracks`, { trackId }),
  deleteFromPlaylist: (playlistId: string, trackId: string) =>
    fetch(`${API_BASE}/playlists/${playlistId}/tracks/${trackId}`, { method: 'DELETE' }),
  deletePlaylist: (id: string) =>
    fetch(`${API_BASE}/playlists/${id}`, { method: 'DELETE' }),

  trackStreamUri: (id: string, mono = false) =>
    `${API_BASE}/tracks/${id}/stream${mono ? '?mono=true' : ''}`,
}
