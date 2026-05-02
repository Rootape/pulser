import { useEffect, useState, useCallback } from 'react'
import { Alert, ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../lib/api'
import type { Playlist } from '../../lib/api'
import { colors, fonts, spacing } from '../../lib/theme'

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api.playlists()
      .then(setPlaylists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function createNew() {
    Alert.prompt('Nova playlist', 'Nome:', (name) => {
      if (!name?.trim()) return
      api.createPlaylist(name.trim()).then(load).catch(console.error)
    })
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.heading}>
          listas<Text style={s.dot}>.</Text>
        </Text>
        <Pressable style={s.newBtn} onPress={createNew}>
          <Text style={s.newBtnText}>+ nova</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <Pressable
              style={s.row}
              onPress={() => Alert.alert(item.name, 'Detalhes em breve.')}
            >
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.meta}>
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  heading: { fontFamily: fonts.grotesk, fontSize: 32, letterSpacing: -1.5, color: colors.ink },
  dot: { color: colors.primary },
  loader: { flex: 1 },
  list: { paddingVertical: spacing.sm },
  row: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.xs },
  name: { fontFamily: fonts.groteskSemi, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  sep: { height: 1, backgroundColor: colors.hairline },
  newBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  newBtnText: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
})
