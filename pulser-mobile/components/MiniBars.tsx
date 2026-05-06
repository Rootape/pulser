import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { colors } from '../lib/theme'

const COUNT = 3
const MIN_H = 4
const MAX_H = 14

export function MiniBars({ active = true }: { active?: boolean }) {
  const bars = useRef(
    Array.from({ length: COUNT }, () => new Animated.Value(MIN_H)),
  ).current

  useEffect(() => {
    if (!active) {
      bars.forEach((b) => b.setValue(MIN_H))
      return
    }
    const loops = bars.map((b, i) => {
      const dur = 220 + i * 90
      return Animated.loop(
        Animated.sequence([
          Animated.timing(b, { toValue: MAX_H, duration: dur, useNativeDriver: false }),
          Animated.timing(b, { toValue: MIN_H, duration: dur, useNativeDriver: false }),
        ]),
      )
    })
    loops.forEach((l) => l.start())
    return () => loops.forEach((l) => l.stop())
  }, [active, bars])

  return (
    <View style={s.container}>
      {bars.map((b, i) => (
        <Animated.View key={i} style={[s.bar, { height: b }]} />
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    width: 24,
    height: MAX_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  bar: { width: 3, backgroundColor: colors.primary },
})
