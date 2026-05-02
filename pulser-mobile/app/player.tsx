import { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePlayer } from '../lib/player'
import { coverUri } from '../lib/api'
import { colors, fonts, formatDuration, spacing } from '../lib/theme'
import { Icon } from '../components/Icon'

const COVER_SIZE = Math.min(Dimensions.get('window').width - spacing.md * 2, 320)

export default function PlayerScreen() {
  const { track, isPlaying, position, duration, mono, shuffle, pause, resume, next, prev, seek, toggleMono, toggleShuffle } =
    usePlayer()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [barWidth, setBarWidth] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const [scrubPos, setScrubPos] = useState(0)

  if (!track) {
    router.back()
    return null
  }

  const displayPos = scrubbing ? scrubPos : position
  const progress = duration > 0 ? Math.min(displayPos / duration, 1) : 0
  const uri = coverUri(track.album.coverUrl)

  return (
    <View style={[s.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={s.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <Text style={s.close}>✕ fechar</Text>
        </Pressable>
        <Pressable onPress={toggleMono} style={[s.monoBtn, mono && s.monoBtnActive]}>
          <Text style={[s.monoBtnText, mono && s.monoBtnTextActive]}>MONO</Text>
        </Pressable>
      </View>

      <View style={s.coverWrap}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={uri} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface2 }]} />
        )}
      </View>

      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>{track.title}</Text>
        <Text style={s.artist}>{track.album.artist.name}</Text>
        <Text style={s.album}>{track.album.title}</Text>
      </View>

      <View style={s.progressContainer}>
        <View
          style={s.progressHitArea}
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          onTouchStart={(e) => {
            if (barWidth <= 0 || duration <= 0) return
            const x = Math.max(0, Math.min(e.nativeEvent.locationX, barWidth))
            setScrubbing(true)
            setScrubPos((x / barWidth) * duration)
          }}
          onTouchMove={(e) => {
            if (barWidth <= 0 || duration <= 0) return
            const x = Math.max(0, Math.min(e.nativeEvent.locationX, barWidth))
            setScrubPos((x / barWidth) * duration)
          }}
          onTouchEnd={() => {
            if (!scrubbing) return
            seek(scrubPos)
            setScrubbing(false)
          }}
        >
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          {barWidth > 0 && (
            <View style={[s.progressDot, { left: progress * barWidth - 6 }]} />
          )}
        </View>
        <View style={s.timestamps}>
          <Text style={s.time}>{formatDuration(displayPos)}</Text>
          <Text style={s.time}>{formatDuration(duration)}</Text>
        </View>
      </View>

      <View style={s.controls}>
        <Pressable onPress={toggleShuffle} hitSlop={16}>
          <Icon name="shuffle" size={22} color={shuffle ? colors.primary : colors.inkMute} />
        </Pressable>
        <Pressable onPress={prev} hitSlop={16}>
          <Icon name="skip-back" size={32} color={colors.ink} />
        </Pressable>
        <Pressable style={s.playBtn} onPress={isPlaying ? pause : resume}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={28} color={colors.bg} />
        </Pressable>
        <Pressable onPress={next} hitSlop={16}>
          <Icon name="skip-forward" size={32} color={colors.ink} />
        </Pressable>
        <View style={{ width: 22 }} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.md },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  close: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, letterSpacing: 1 },
  monoBtn: {
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  monoBtnActive: { borderColor: colors.cyan, backgroundColor: colors.surface },
  monoBtnText: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1 },
  monoBtnTextActive: { color: colors.cyan },
  coverWrap: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    alignSelf: 'center',
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  info: { gap: spacing.xs, marginBottom: spacing.lg },
  title: { fontFamily: fonts.grotesk, fontSize: 22, letterSpacing: -0.8, color: colors.ink },
  artist: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  album: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  progressContainer: { marginBottom: spacing.lg, marginHorizontal: spacing.xs },
  progressHitArea: { height: 28, justifyContent: 'center' },
  progressTrack: { height: 2, backgroundColor: colors.surface2 },
  progressFill: { height: 2, backgroundColor: colors.primary },
  progressDot: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.primary,
    top: 8,
  },
  timestamps: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
