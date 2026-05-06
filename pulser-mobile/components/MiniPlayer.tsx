import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { colors, fonts, spacing } from '../lib/theme'
import { coverUri } from '../lib/api'
import { usePlayer } from '../lib/player'
import { Icon } from './Icon'
import { PulseBorder } from './PulseBorder'
import { Ticker } from './Ticker'

export function MiniPlayer() {
  const { track, isPlaying, position, duration, pause, resume } = usePlayer()
  const router = useRouter()

  if (!track) return null

  const uri = coverUri(track.album.coverUrl)
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0

  return (
    <Pressable style={s.container} onPress={() => router.push('/player')}>
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={s.inner}>
        <PulseBorder size={40} active={isPlaying} haloPadding={4} borderWidth={1}>
          {uri ? (
            <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={uri} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface2 }]} />
          )}
        </PulseBorder>
        <View style={s.meta}>
          <Ticker text={track.title} style={s.title} />
          <Text style={s.artist} numberOfLines={1}>{track.album.artist.name}</Text>
        </View>
        <Pressable
          style={s.btn}
          onPress={(e) => { e.stopPropagation(); isPlaying ? pause() : resume() }}
          hitSlop={12}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={22} color={colors.primary} />
        </Pressable>
      </View>
    </Pressable>
  )
}

const s = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.hairline },
  progressTrack: { height: 3, backgroundColor: colors.surface2 },
  progressFill: {
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  meta: { flex: 1 },
  title: { fontFamily: fonts.groteskSemi, fontSize: 13, color: colors.ink },
  artist: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
})
