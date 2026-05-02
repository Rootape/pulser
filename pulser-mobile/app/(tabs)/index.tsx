import { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api, coverUri } from '../../lib/api'
import type { Artist } from '../../lib/api'
import { colors, fonts, spacing } from '../../lib/theme'

const COLS = 2
const GAP = spacing.md
const PAD = spacing.md
const CARD_SIZE = (Dimensions.get('window').width - PAD * 2 - GAP) / COLS

export default function HomeScreen() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api.artists()
      .then(setArtists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.logo}>pulser<Text style={s.dot}>.</Text></Text>
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
          renderItem={({ item }) => <ArtistCard artist={item} onPress={() => router.push(`/artist/${item.id}`)} />}
        />
      )}
    </SafeAreaView>
  )
}

function ArtistCard({ artist, onPress }: { artist: Artist; onPress: () => void }) {
  const uri = coverUri(artist.imageUrl)
  const initial = artist.name.charAt(0).toUpperCase()

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.cover}>
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
    borderBottomColor: colors.hairline,
  },
  logo: { fontFamily: fonts.grotesk, fontSize: 32, letterSpacing: -1.5, color: colors.ink },
  dot: { color: colors.primary },
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
