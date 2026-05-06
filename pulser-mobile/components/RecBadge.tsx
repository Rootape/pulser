import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fonts } from '../lib/theme'
import { usePlayer } from '../lib/player'

export function RecBadge() {
  const { isPlaying, track } = usePlayer()
  const insets = useSafeAreaInsets()
  const blink = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!isPlaying || !track) return
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.25, duration: 600, useNativeDriver: false }),
        Animated.timing(blink, { toValue: 1, duration: 600, useNativeDriver: false }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [isPlaying, track, blink])

  if (!track) return null

  return (
    <Animated.View
      pointerEvents="none"
      style={[s.floating, { top: insets.top + 12, opacity: isPlaying ? blink : 0.4 }]}
    >
      <View style={s.dot} />
      <Text style={s.text}>REC</Text>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  floating: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
})
