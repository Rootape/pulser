export const colors = {
  bg: '#0A0A0A',
  surface: '#111111',
  surface2: '#1A1A1A',
  ink: '#F2F2EE',
  inkMute: 'rgba(242,242,238,0.55)',
  inkFaint: 'rgba(242,242,238,0.16)',
  hairline: 'rgba(242,242,238,0.10)',
  primary: '#C4FF3D',
  primaryDeep: '#8FCC1A',
  magenta: '#FF2E97',
  cyan: '#00E5D1',
} as const

export const fonts = {
  grotesk: 'SpaceGrotesk_700Bold',
  groteskSemi: 'SpaceGrotesk_600SemiBold',
  groteskRegular: 'SpaceGrotesk_400Regular',
  mono: 'JetBrainsMono_400Regular',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
