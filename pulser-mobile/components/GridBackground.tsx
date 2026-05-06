import { useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { colors } from '../lib/theme'

const STEP = 32

export function GridBackground() {
  const { v, h } = useMemo(() => {
    const { width, height } = Dimensions.get('window')
    return {
      v: Math.ceil(width / STEP) + 1,
      h: Math.ceil(height / STEP) + 1,
    }
  }, [])

  return (
    <View style={s.container} pointerEvents="none">
      {Array.from({ length: v }).map((_, i) => (
        <View key={`v${i}`} style={[s.vline, { left: i * STEP }]} />
      ))}
      {Array.from({ length: h }).map((_, i) => (
        <View key={`h${i}`} style={[s.hline, { top: i * STEP }]} />
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  vline: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: colors.hairline },
  hline: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.hairline },
})
