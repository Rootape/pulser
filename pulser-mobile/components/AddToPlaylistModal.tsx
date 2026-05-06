import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { api } from '../lib/api'
import type { Playlist } from '../lib/api'
import { colors, fonts, spacing } from '../lib/theme'

type Props = {
  trackId: string | null
  onClose: () => void
}

export function AddToPlaylistModal({ trackId, onClose }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!trackId) return
    setLoading(true)
    api.playlists().then(setPlaylists).catch(console.error).finally(() => setLoading(false))
  }, [trackId])

  async function add(playlistId: string) {
    if (!trackId) return
    await api.addToPlaylist(playlistId, trackId).catch(console.error)
    onClose()
  }

  return (
    <Modal visible={!!trackId} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.heading}>adicionar à lista</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={s.loader} />
        ) : playlists.length === 0 ? (
          <Text style={s.empty}>nenhuma lista criada</Text>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <Pressable style={s.row} onPress={() => add(item.id)}>
                <Text style={s.rowName}>{item.name}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={s.sep} />}
          />
        )}
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.hairline,
    alignSelf: 'center',
    marginTop: spacing.sm,
    borderRadius: 2,
  },
  heading: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.inkMute,
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  loader: { padding: spacing.lg },
  empty: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkMute,
    textAlign: 'center',
    padding: spacing.lg,
  },
  row: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  rowName: { fontFamily: fonts.groteskSemi, fontSize: 15, color: colors.ink },
  sep: { height: 1, backgroundColor: colors.hairline },
})
