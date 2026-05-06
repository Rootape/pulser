import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { colors } from '../lib/theme'

const BPM = 128
const BEAT_MS = 60_000 / BPM
const COLOR_CYCLE_MS = 30_000
const NEON = [colors.primary, colors.magenta, colors.cyan, colors.primary] as const

type Props = {
  children: ReactNode
  size: number
  active?: boolean
  haloPadding?: number
  borderWidth?: number
}

export function PulseBorder({
  children,
  size,
  active = true,
  haloPadding = 14,
  borderWidth = 2,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current
  const cycle = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!active) {
      const ease = Animated.timing(pulse, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      })
      ease.start()
      return () => ease.stop()
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: BEAT_MS / 2, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: BEAT_MS / 2, useNativeDriver: false }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [active, pulse])

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(cycle, {
        toValue: 1,
        duration: COLOR_CYCLE_MS,
        useNativeDriver: false,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [cycle])

  const neonColor = cycle.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [NEON[0], NEON[1], NEON[2], NEON[3]],
  })

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] })
  const haloOuter = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.45] })
  const haloInner = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.32, 0.7] })
  const borderOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [active ? 0.55 : 0.25, 1],
  })

  const wrapSize = size + haloPadding * 2

  return (
    <View style={[s.wrap, { width: wrapSize, height: wrapSize }]} pointerEvents="box-none">
      <Animated.View
        pointerEvents="none"
        style={[
          s.halo,
          {
            width: wrapSize,
            height: wrapSize,
            backgroundColor: neonColor as unknown as string,
            opacity: haloOuter,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          s.halo,
          {
            width: size + haloPadding,
            height: size + haloPadding,
            backgroundColor: neonColor as unknown as string,
            opacity: haloInner,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          s.frame,
          {
            width: size,
            height: size,
            borderWidth,
            borderColor: neonColor as unknown as string,
            transform: [{ scale }],
            opacity: borderOpacity,
          },
        ]}
      >
        <View style={StyleSheet.absoluteFill}>{children}</View>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
  frame: { overflow: 'hidden', backgroundColor: colors.surface2 },
})
