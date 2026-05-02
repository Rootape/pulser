import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, formatDuration, spacing } from '../lib/theme'
import { usePlayer } from '../lib/player'
import type { PlayerTrack } from '../lib/player'

type Props = {
  track: PlayerTrack
  index: number
  queue: PlayerTrack[]
  showNumber?: boolean
}

export function TrackRow({ track, index, queue, showNumber = true }: Props) {
  const { play, track: current, isPlaying } = usePlayer()
  const isActive = current?.id === track.id

  return (
    <Pressable style={[s.row, isActive && s.rowActive]} onPress={() => play(queue, index)}>
      {showNumber && (
        <Text style={[s.num, isActive && s.numActive]}>
          {isActive && isPlaying ? '▶' : String(index + 1)}
        </Text>
      )}
      <View style={s.meta}>
        <Text style={[s.title, isActive && s.titleActive]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={s.artist} numberOfLines={1}>
          {track.album.artist.name}
        </Text>
      </View>
      <Text style={s.dur}>{formatDuration(track.duration)}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  rowActive: { backgroundColor: colors.surface },
  num: { width: 24, textAlign: 'right', fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  numActive: { color: colors.primary },
  meta: { flex: 1 },
  title: { fontFamily: fonts.groteskSemi, fontSize: 14, color: colors.ink },
  titleActive: { color: colors.primary },
  artist: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, marginTop: 2 },
  dur: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
})
