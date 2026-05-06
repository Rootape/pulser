import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { api } from '../lib/api'
import type { Artist } from '../lib/api'
import { colors, fonts, spacing } from '../lib/theme'
import { GridBackground } from './GridBackground'

type Props = {
  visible: boolean
  excludeIds?: string[]
  onPick: (artist: { id: string; name: string }) => void
  onClose: () => void
}

export function ArtistPickerModal({ visible, excludeIds = [], onPick, onClose }: Props) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const ty = useRef(new Animated.Value(400)).current

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    api.artists().then(setArtists).catch(console.error).finally(() => setLoading(false))
    ty.setValue(400)
    Animated.spring(ty, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }).start()
  }, [visible, ty])

  const filtered = artists
    .filter((a) => !excludeIds.includes(a.id))
    .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <GridBackground />
      </Pressable>
      <Animated.View style={[s.sheet, { transform: [{ translateY: ty }] }]}>
        <View style={s.handle} />
        <Text style={s.heading}>escolher artista</Text>
        <TextInput
          style={s.search}
          value={query}
          onChangeText={setQuery}
          placeholder="buscar..."
          placeholderTextColor={colors.inkMute}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {loading ? (
          <ActivityIndicator color={colors.primary} style={s.loader} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(a) => a.id}
            renderItem={({ item }) => (
              <Pressable style={s.row} onPress={() => { onPick(item); onClose() }}>
                <Text style={s.rowName}>{item.name}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={s.sep} />}
          />
        )}
      </Animated.View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
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
  },
  search: {
    backgroundColor: colors.bg,
    color: colors.ink,
    fontFamily: fonts.groteskRegular,
    fontSize: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  loader: { padding: spacing.lg },
  row: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  rowName: { fontFamily: fonts.groteskSemi, fontSize: 15, color: colors.ink },
  sep: { height: 1, backgroundColor: colors.hairline },
})
