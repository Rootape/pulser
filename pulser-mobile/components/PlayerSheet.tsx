import { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePlayer } from '../lib/player'
import { coverUri } from '../lib/api'
import { colors, fonts, formatDuration, spacing } from '../lib/theme'
import { Icon } from './Icon'

const { width: SW, height: SH } = Dimensions.get('window')
const MINI_H = 68
const TAB_VISUAL_H = 49  // tab bar without safe area

export function PlayerSheet() {
  const insets = useSafeAreaInsets()
  const TAB_H = TAB_VISUAL_H + insets.bottom
  const COLLAPSED_Y = SH - MINI_H - TAB_H

  const {
    track, isPlaying, position, duration, mono, shuffle,
    pause, resume, next, prev, seek, toggleMono, toggleShuffle,
  } = usePlayer()

  const translateY = useRef(new Animated.Value(COLLAPSED_Y)).current
  const currentYRef = useRef(COLLAPSED_Y)
  const collapsedYRef = useRef(COLLAPSED_Y)
  collapsedYRef.current = COLLAPSED_Y

  const [barWidth, setBarWidth] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const [scrubPos, setScrubPos] = useState(0)
  const scrubbingRef = useRef(false)

  const expand = () => {
    Animated.spring(translateY, {
      toValue: 0, useNativeDriver: true, tension: 65, friction: 12,
    }).start()
    currentYRef.current = 0
  }

  const collapse = () => {
    Animated.spring(translateY, {
      toValue: collapsedYRef.current, useNativeDriver: true, tension: 65, friction: 12,
    }).start()
    currentYRef.current = collapsedYRef.current
  }

  const handlePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6 && !scrubbingRef.current,
      onPanResponderGrant: () => {
        translateY.stopAnimation()
        translateY.setOffset(currentYRef.current)
        translateY.setValue(0)
      },
      onPanResponderMove: (_, g) => {
        const clamped = Math.max(0, Math.min(collapsedYRef.current, g.dy))
        translateY.setValue(clamped)
      },
      onPanResponderRelease: (_, g) => {
        translateY.flattenOffset()
        const half = collapsedYRef.current / 2
        const snapToExpanded = g.vy < -0.5 || (g.dy < 0 && currentYRef.current < half)
        const snapToCollapsed = g.vy > 0.5 || g.dy > half
        if (snapToExpanded || (!snapToCollapsed && currentYRef.current < half)) {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }).start()
          currentYRef.current = 0
        } else {
          Animated.spring(translateY, { toValue: collapsedYRef.current, useNativeDriver: true, tension: 65, friction: 12 }).start()
          currentYRef.current = collapsedYRef.current
        }
      },
    })
  ).current

  if (!track) return null

  const uri = coverUri(track.album.coverUrl)
  const COVER_W = Math.min(220, SW * 0.56)
  const displayPos = scrubbing ? scrubPos : position
  const progress = duration > 0 ? Math.min(displayPos / duration, 1) : 0

  const miniOpacity = translateY.interpolate({
    inputRange: [0, COLLAPSED_Y * 0.65, COLLAPSED_Y],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  })
  const fullOpacity = translateY.interpolate({
    inputRange: [0, COLLAPSED_Y * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  return (
    <Animated.View style={[s.sheet, { transform: [{ translateY }] }]}>
      {/* ── Drag handle (only drag target for expand/collapse) ── */}
      <View style={s.handleWrap} {...handlePan.panHandlers}>
        <View style={s.handle} />
      </View>

      {/* ── Full player ── */}
      <Animated.View
        style={[s.full, { opacity: fullOpacity, paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}
        pointerEvents="box-none"
      >
        <View style={s.topBar}>
          <Pressable onPress={collapse} hitSlop={16}>
            <Text style={s.close}>✕ fechar</Text>
          </Pressable>
          <Pressable onPress={toggleMono} style={[s.monoBtn, mono && s.monoBtnActive]}>
            <Text style={[s.monoBtnText, mono && s.monoBtnTextActive]}>MONO</Text>
          </Pressable>
        </View>

        <View style={[s.coverWrap, { width: COVER_W, height: COVER_W }]}>
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
              scrubbingRef.current = true
              setScrubbing(true)
              setScrubPos((Math.max(0, Math.min(e.nativeEvent.locationX, barWidth)) / barWidth) * duration)
            }}
            onTouchMove={(e) => {
              if (barWidth <= 0 || duration <= 0) return
              setScrubPos((Math.max(0, Math.min(e.nativeEvent.locationX, barWidth)) / barWidth) * duration)
            }}
            onTouchEnd={() => {
              if (!scrubbing) return
              seek(scrubPos)
              setScrubbing(false)
              scrubbingRef.current = false
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
      </Animated.View>

      {/* ── Mini player ── */}
      <Animated.View style={[s.mini, { opacity: miniOpacity }]} pointerEvents="box-none">
        <Pressable style={s.miniInner} onPress={expand}>
          <View style={s.miniCover}>
            {uri ? (
              <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={uri} />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface2 }]} />
            )}
          </View>
          <View style={s.miniMeta}>
            <Text style={s.miniTitle} numberOfLines={1}>{track.title}</Text>
            <Text style={s.miniArtist} numberOfLines={1}>{track.album.artist.name}</Text>
          </View>
          <Pressable
            style={s.miniBtn}
            onPress={(e) => { e.stopPropagation(); isPlaying ? pause() : resume() }}
            hitSlop={12}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={22} color={colors.primary} />
          </Pressable>
        </Pressable>
        <View style={s.miniProgress}>
          <View style={[s.miniProgressFill, { width: `${progress * 100}%` }]} />
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: SH,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    zIndex: 10,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.inkFaint,
  },

  // Full player
  full: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  close: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, letterSpacing: 1 },
  monoBtn: { borderWidth: 1, borderColor: colors.hairline, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  monoBtnActive: { borderColor: colors.cyan, backgroundColor: colors.surface },
  monoBtnText: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1 },
  monoBtnTextActive: { color: colors.cyan },
  coverWrap: { alignSelf: 'center', backgroundColor: colors.surface2, overflow: 'hidden' },
  info: { gap: spacing.xs },
  title: { fontFamily: fonts.grotesk, fontSize: 22, letterSpacing: -0.8, color: colors.ink },
  artist: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  album: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  progressContainer: { marginHorizontal: spacing.xs },
  progressHitArea: { height: 28, justifyContent: 'center' },
  progressTrack: { height: 2, backgroundColor: colors.surface2 },
  progressFill: { height: 2, backgroundColor: colors.primary },
  progressDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, top: 8 },
  timestamps: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  // Mini player
  mini: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: MINI_H,
    backgroundColor: colors.surface,
  },
  miniInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  miniCover: { width: 40, height: 40, backgroundColor: colors.surface2, overflow: 'hidden' },
  miniMeta: { flex: 1 },
  miniTitle: { fontFamily: fonts.groteskSemi, fontSize: 13, color: colors.ink },
  miniArtist: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  miniBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  miniProgress: { height: 2, backgroundColor: colors.surface2 },
  miniProgressFill: { height: 2, backgroundColor: colors.primary },
})
