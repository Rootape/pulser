import { StyleSheet, View } from 'react-native'
import { Icon } from './Icon'
import { colors } from '../lib/theme'

type Props = { name: string; size: number; color: string; focused?: boolean }

export function TabBarIcon({ name, size, color, focused }: Props) {
  return (
    <View style={focused ? s.glow : undefined}>
      <Icon name={name} size={size} color={color} />
    </View>
  )
}

const s = StyleSheet.create({
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
})
