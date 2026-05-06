import { useEffect, useRef, useState } from 'react'
import type { TextStyle } from 'react-native'
import { Animated, StyleSheet, Text, View } from 'react-native'

type Props = {
  text: string
  style?: TextStyle | TextStyle[]
  speed?: number
  delay?: number
}

export function Ticker({ text, style, speed = 30, delay = 800 }: Props) {
  const [containerW, setContainerW] = useState(0)
  const [textW, setTextW] = useState(0)
  const tx = useRef(new Animated.Value(0)).current
  const overflow = textW > containerW && containerW > 0

  useEffect(() => {
    if (!overflow) {
      tx.setValue(0)
      return
    }
    const distance = textW + 32
    const dur = (distance / speed) * 1000
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(tx, { toValue: -distance, duration: dur, useNativeDriver: true }),
        Animated.timing(tx, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [overflow, textW, speed, delay, tx])

  return (
    <View style={s.clip} onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}>
      <Animated.View style={[s.row, { transform: [{ translateX: tx }] }]}>
        <Text
          style={style}
          numberOfLines={1}
          onLayout={(e) => setTextW(e.nativeEvent.layout.width)}
        >
          {text}
        </Text>
        {overflow && (
          <>
            <View style={{ width: 32 }} />
            <Text style={style} numberOfLines={1}>{text}</Text>
          </>
        )}
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  clip: { overflow: 'hidden' },
  row: { flexDirection: 'row' },
})
