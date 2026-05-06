import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { colors, fonts, spacing } from '../lib/theme'
import { coverUri } from '../lib/api'

type Props = {
  id: string
  title: string
  artist?: string
  coverUrl: string | null
  onPress: () => void
  width?: number
  active?: boolean
}

export function AlbumCard({ title, artist, coverUrl, onPress, width = 160, active }: Props) {
  const uri = coverUri(coverUrl)
  return (
    <Pressable style={[s.card, { width }]} onPress={onPress}>
      <View style={[s.cover, { width, height: width }, active && s.coverActive]}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, s.placeholder]} />
        )}
      </View>
      <Text style={[s.title, active && s.titleActive]} numberOfLines={2}>{title}</Text>
      {artist && <Text style={s.artist} numberOfLines={1}>{artist}</Text>}
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: { gap: spacing.xs },
  cover: { backgroundColor: colors.surface2, overflow: 'hidden' },
  coverActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  placeholder: { backgroundColor: colors.surface2 },
  title: { fontFamily: fonts.groteskSemi, fontSize: 13, color: colors.ink },
  titleActive: { color: colors.primary },
  artist: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
})
