import { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api, coverUri } from '../../lib/api'
import type { Artist } from '../../lib/api'
import { colors, fonts, spacing } from '../../lib/theme'
import { GridBackground } from '../../components/GridBackground'
import { RecBadge } from '../../components/RecBadge'
import { Ticker } from '../../components/Ticker'
import { usePlayer } from '../../lib/player'

const COLS = 2
const GAP = spacing.md
const PAD = spacing.md
const CARD_SIZE = (Dimensions.get('window').width - PAD * 2 - GAP) / COLS

export default function HomeScreen() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { track } = usePlayer()
  const tickerText = track
    ? `● ${artists.length} ARTISTAS · agora: ${track.title} — ${track.album.artist.name}`
    : `● ${artists.length} ARTISTAS`

  useEffect(() => {
    api.artists()
      .then(setArtists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <GridBackground />
      <RecBadge />
      <View style={s.header}>
        <Text style={s.logo}>pulser<Text style={s.dot}>.</Text></Text>
        <Ticker text={tickerText} style={s.ticker} />
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(a) => a.id}
          numColumns={COLS}
          columnWrapperStyle={s.row}
          contentContainerStyle={s.grid}
          renderItem={({ item }) => (
            <ArtistCard
              artist={item}
              active={track?.album.artist.id === item.id}
              onPress={() => router.push(`/artist/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

function ArtistCard({ artist, active, onPress }: { artist: Artist; active?: boolean; onPress: () => void }) {
  const uri = coverUri(artist.imageUrl)
  const initial = artist.name.charAt(0).toUpperCase()

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={[s.cover, active && s.coverActive]}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={uri} />
        ) : (
          <View style={[StyleSheet.absoluteFill, s.placeholder]}>
            <Text style={s.initial}>{initial}</Text>
          </View>
        )}
        <View style={s.overlay} />
        <Text style={s.cardName} numberOfLines={2}>{artist.name}</Text>
      </View>
    </Pressable>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: PAD,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,209,0.4)',
    gap: spacing.xs,
  },
  logo: { fontFamily: fonts.grotesk, fontSize: 32, letterSpacing: -1.5, color: colors.ink },
  dot: { color: colors.primary },
  ticker: { fontFamily: fonts.mono, fontSize: 10, color: colors.cyan, letterSpacing: 1 },
  loader: { flex: 1 },
  grid: { padding: PAD, gap: GAP },
  row: { gap: GAP },
  card: { width: CARD_SIZE },
  cover: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  coverActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.grotesk, fontSize: CARD_SIZE * 0.35, color: colors.inkFaint },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    background: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardName: {
    fontFamily: fonts.groteskSemi,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: -0.3,
    padding: spacing.sm,
  },
})
