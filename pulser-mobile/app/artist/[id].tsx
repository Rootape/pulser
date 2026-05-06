import { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../lib/api'
import type { ArtistDetail } from '../../lib/api'
import { AlbumCard } from '../../components/AlbumCard'
import { MiniPlayer } from '../../components/MiniPlayer'
import { colors, fonts, spacing } from '../../lib/theme'

const CARD_WIDTH = (Dimensions.get('window').width - spacing.md * 2 - spacing.md) / 2

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [artist, setArtist] = useState<ArtistDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    api.artist(id)
      .then(setArtist)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.header}>
        <Text style={s.name} numberOfLines={1}>{artist?.name ?? '...'}</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={artist?.albums ?? []}
          keyExtractor={(a) => a.id}
          numColumns={2}
          columnWrapperStyle={s.cols}
          contentContainerStyle={s.grid}
          renderItem={({ item }) => (
            <AlbumCard
              id={item.id}
              title={item.title}
              coverUrl={item.coverUrl}
              onPress={() => router.push(`/album/${item.id}`)}
              width={CARD_WIDTH}
            />
          )}
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
  loader: { flex: 1 },
  grid: { padding: spacing.md, gap: spacing.md },
  cols: { gap: spacing.md },
})
