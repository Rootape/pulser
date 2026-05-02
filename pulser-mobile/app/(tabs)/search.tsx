import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../lib/api'
import type { SearchTrack } from '../../lib/api'
import { TrackRow } from '../../components/TrackRow'
import { colors, fonts, spacing } from '../../lib/theme'
import type { PlayerTrack } from '../../lib/player'

function toPlayerTrack(t: SearchTrack): PlayerTrack {
  return { id: t.id, title: t.title, duration: t.duration, album: t.album }
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchTrack[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    api.search(q)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const queue = results.map(toPlayerTrack)

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.inputWrap}>
        <TextInput
          style={s.input}
          placeholder="buscar..."
          placeholderTextColor={colors.inkMute}
          value={query}
          onChangeText={(t) => { setQuery(t); search(t) }}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(t) => t.id}
          renderItem={({ item, index }) => (
            <TrackRow track={toPlayerTrack(item)} index={index} queue={queue} />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inputWrap: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.groteskRegular,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  loader: { flex: 1 },
})
