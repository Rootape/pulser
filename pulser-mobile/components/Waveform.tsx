import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../lib/theme'

const BAR_COUNT = 38

type Props = {
  position: number
  duration: number
  scrubbing?: boolean
  height?: number
}

export function Waveform({ position, duration, scrubbing, height = 36 }: Props) {
  const heights = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }).map((_, i) => {
        const h = 0.2 + Math.abs(Math.sin(i * 0.7)) * 0.6 + Math.abs(Math.cos(i * 0.3)) * 0.3
        return Math.min(h, 1)
      }),
    [],
  )
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0
  const filledCount = Math.floor(progress * BAR_COUNT)
  const fillColor = scrubbing ? colors.magenta : colors.primary

  return (
    <View style={[s.container, { height }]} pointerEvents="none">
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            s.bar,
            {
              height: `${h * 100}%`,
              backgroundColor: i < filledCount ? fillColor : colors.surface2,
            },
          ]}
        />
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bar: { flex: 1, minHeight: 2 },
})
