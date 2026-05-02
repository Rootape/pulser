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
}

export function AlbumCard({ title, artist, coverUrl, onPress, width = 160 }: Props) {
  const uri = coverUri(coverUrl)
  return (
    <Pressable style={[s.card, { width }]} onPress={onPress}>
      <View style={[s.cover, { width, height: width }]}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, s.placeholder]} />
        )}
      </View>
      <Text style={s.title} numberOfLines={2}>{title}</Text>
      {artist && <Text style={s.artist} numberOfLines={1}>{artist}</Text>}
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: { gap: spacing.xs },
  cover: { backgroundColor: colors.surface2, overflow: 'hidden' },
  placeholder: { backgroundColor: colors.surface2 },
  title: { fontFamily: fonts.groteskSemi, fontSize: 13, color: colors.ink },
  artist: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
})
