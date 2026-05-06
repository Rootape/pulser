import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../lib/api'
import type { Artist } from '../../lib/api'
import { colors, fonts, spacing } from '../../lib/theme'

export default function AdminScreen() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = useCallback(() => {
    api.artists()
      .then(setArtists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.heading}>admin<Text style={s.dot}>.</Text></Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => (
            <Pressable style={s.row} onPress={() => router.push(`/admin/artist/${item.id}`)}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={s.sep} />}
          contentContainerStyle={s.list}
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  heading: { fontFamily: fonts.grotesk, fontSize: 32, letterSpacing: -1.5, color: colors.ink },
  dot: { color: colors.primary },
  loader: { flex: 1 },
  list: { paddingVertical: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  name: { flex: 1, fontFamily: fonts.groteskSemi, fontSize: 15, color: colors.ink },
  arrow: { fontFamily: fonts.grotesk, fontSize: 18, color: colors.inkMute },
  sep: { height: 1, backgroundColor: colors.hairline },
})
