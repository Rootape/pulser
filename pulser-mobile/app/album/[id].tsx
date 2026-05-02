import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api, coverUri } from '../../lib/api'
import type { Album } from '../../lib/api'
import type { PlayerTrack } from '../../lib/player'
import { TrackRow } from '../../components/TrackRow'
import { MiniPlayer } from '../../components/MiniPlayer'
import { Icon } from '../../components/Icon'
import { usePlayer } from '../../lib/player'
import { colors, fonts, spacing } from '../../lib/theme'

const COVER_SIZE = Math.min(220, Dimensions.get('window').width * 0.56)

function albumToQueue(album: Album): PlayerTrack[] {
  return album.tracks.map((t) => ({
    id: t.id,
    title: t.title,
    duration: t.duration,
    album: { id: album.id, title: album.title, coverUrl: album.coverUrl, artist: album.artist },
  }))
}

type HeroProps = { album: Album; queue: PlayerTrack[]; uri: string | null }

function AlbumHero({ album, queue, uri }: HeroProps) {
  const { play, shuffle, toggleShuffle } = usePlayer()
  return (
    <View style={s.hero}>
      <View style={s.coverWrap}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={uri} />
        ) : (
          <View style={[StyleSheet.absoluteFill, s.nocover]} />
        )}
      </View>
      <Text style={s.albumTitle}>{album.title}</Text>
      <Text style={s.artistName}>{album.artist.name}</Text>
      {album.year != null && <Text style={s.year}>{album.year}</Text>}
      <View style={s.actions}>
        <Pressable style={s.playAll} onPress={() => play(queue, 0)}>
          <Text style={s.playAllText}>▶  tocar tudo</Text>
        </Pressable>
        <Pressable style={[s.shuffleBtn, shuffle && s.shuffleBtnActive]} onPress={toggleShuffle}>
          <Icon name="shuffle" size={16} color={shuffle ? colors.bg : colors.primary} />
        </Pressable>
      </View>
    </View>
  )
}

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    api.album(id)
      .then(setAlbum)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const queue = useMemo(() => (album ? albumToQueue(album) : []), [album])
  const uri = useMemo(() => coverUri(album?.coverUrl ?? null), [album?.coverUrl])

  // Stable reference — only recreated when album data arrives (once)
  const Header = useMemo(
    () => album ? () => <AlbumHero album={album} queue={queue} uri={uri} /> : null,
    [album, queue, uri],
  )

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(t) => t.id}
          ListHeaderComponent={Header}
          renderItem={({ item, index }) => (
            <TrackRow track={item} index={index} queue={queue} />
          )}
          contentContainerStyle={s.list}
        />
      )}
      <MiniPlayer />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  back: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  loader: { flex: 1 },
  list: { paddingBottom: spacing.xl },
  hero: {
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    marginBottom: spacing.sm,
  },
  coverWrap: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  nocover: { backgroundColor: colors.surface2 },
  albumTitle: { fontFamily: fonts.grotesk, fontSize: 22, letterSpacing: -0.8, color: colors.ink },
  artistName: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  year: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  playAll: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  playAllText: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  shuffleBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleBtnActive: { backgroundColor: colors.primary },
})
