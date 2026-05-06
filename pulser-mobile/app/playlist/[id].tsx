import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../lib/api'
import type { PlaylistDetail } from '../../lib/api'
import type { PlayerTrack } from '../../lib/player'
import { usePlayer } from '../../lib/player'
import { TrackRow } from '../../components/TrackRow'
import { MiniPlayer } from '../../components/MiniPlayer'
import { colors, fonts, spacing } from '../../lib/theme'

function toPlayerTrack(pt: PlaylistDetail['tracks'][number]): PlayerTrack {
  const t = pt.track
  return {
    id: t.id,
    title: t.title,
    duration: t.duration,
    featArtists: t.featArtists.length > 0 ? t.featArtists.map((e) => e.artist.name).join(', ') : undefined,
    album: {
      id: t.album.id,
      title: t.album.title,
      coverUrl: t.album.coverUrl,
      artist: t.album.artist,
    },
  }
}

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { play } = usePlayer()

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    api.playlist(id)
      .then(setPlaylist)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const queue = useMemo(() => (playlist?.tracks ?? []).map(toPlayerTrack), [playlist])

  function removeTrack(trackId: string) {
    Alert.alert('Remover faixa', 'Remover desta lista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await api.deleteFromPlaylist(id!, trackId).catch(console.error)
          setPlaylist((prev) =>
            prev ? { ...prev, tracks: prev.tracks.filter((pt) => pt.track.id !== trackId) } : prev
          )
        },
      },
    ])
  }

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.header}>
        <Text style={s.name} numberOfLines={1}>{playlist?.name ?? '...'}</Text>
        <Text style={s.count}>{playlist?.tracks.length ?? 0} faixas</Text>
      </View>
      {!loading && queue.length > 0 && (
        <Pressable style={s.playAll} onPress={() => play(queue, 0)}>
          <Text style={s.playAllText}>▶  tocar tudo</Text>
        </Pressable>
      )}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(t) => t.id}
          renderItem={({ item, index }) => (
            <TrackRow
              track={item}
              index={index}
              queue={queue}
              showNumber={false}
              onLongPress={() => removeTrack(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={s.empty}>nenhuma faixa</Text>}
          contentContainerStyle={s.list}
        />
      )}
      <MiniPlayer />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  name: { fontFamily: fonts.grotesk, fontSize: 28, letterSpacing: -1, color: colors.ink },
  count: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, marginTop: 2 },
  playAll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  playAllText: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  loader: { flex: 1 },
  list: { paddingBottom: spacing.xl },
  empty: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkMute,
    textAlign: 'center',
    padding: spacing.xl,
  },
})
