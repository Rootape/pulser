import { Feather } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

type FeatherName = ComponentProps<typeof Feather>['name']

const MAP: Record<string, FeatherName> = {
  home: 'home',
  search: 'search',
  list: 'list',
  play: 'play',
  pause: 'pause',
  'skip-back': 'skip-back',
  'skip-forward': 'skip-forward',
  shuffle: 'shuffle',
  settings: 'settings',
}

interface Props { name: string; size?: number; color?: string }

export function Icon({ name, size = 24, color = '#F2F2EE' }: Props) {
  return <Feather name={MAP[name] ?? 'circle'} size={size} color={color} />
}
