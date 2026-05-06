import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../../lib/api'
import type { TrackSummary } from '../../../lib/api'
import { ArtistPickerModal } from '../../../components/ArtistPickerModal'
import { colors, fonts, spacing } from '../../../lib/theme'

export default function AdminTrackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [track, setTrack] = useState<TrackSummary | null>(null)
  const [title, setTitle] = useState('')
  const [trackNumber, setTrackNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    if (!id) return
    api.track(id).then((t) => {
      setTrack(t)
      setTitle(t.title)
      setTrackNumber(t.trackNumber != null ? String(t.trackNumber) : '')
    }).catch(console.error)
  }, [id])

  async function save() {
    if (!id) return
    setSaving(true)
    await api.patchTrack(id, {
      title: title || undefined,
      trackNumber: trackNumber ? Number(trackNumber) : null,
    })
      .then((updated) => { setTrack((prev) => prev ? { ...prev, ...updated } : prev); Alert.alert('Salvo') })
      .catch(() => Alert.alert('Erro ao salvar'))
      .finally(() => setSaving(false))
  }

  async function removeFeat(artistId: string) {
    if (!id) return
    await api.removeTrackArtist(id, artistId).catch(console.error)
    setTrack((prev) =>
      prev ? { ...prev, featArtists: prev.featArtists.filter((e) => e.artist.id !== artistId) } : prev
    )
  }

  async function addFeat(artist: { id: string; name: string }) {
    if (!id) return
    await api.addTrackArtist(id, artist.id).catch(console.error)
    setTrack((prev) =>
      prev ? { ...prev, featArtists: [...prev.featArtists, { artist }] } : prev
    )
  }

  const existingFeatIds = track?.featArtists.map((e) => e.artist.id) ?? []

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <Pressable style={s.back} onPress={() => router.back()}>
        <Text style={s.backText}>‹ voltar</Text>
      </Pressable>
      <ScrollView>
        <View style={s.form}>
          <Text style={s.label}>TÍTULO</Text>
          <TextInput style={s.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.inkMute} />
          <Text style={s.label}>NÚMERO</Text>
          <TextInput
            style={s.input}
            value={trackNumber}
            onChangeText={setTrackNumber}
            keyboardType="number-pad"
            placeholderTextColor={colors.inkMute}
          />
          <Pressable style={s.saveBtn} onPress={save} disabled={saving}>
            <Text style={s.saveBtnText}>{saving ? 'salvando...' : 'salvar'}</Text>
          </Pressable>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>FEATS</Text>
            <Pressable onPress={() => setShowPicker(true)}>
              <Text style={s.addBtn}>+ adicionar</Text>
            </Pressable>
          </View>
          {track && track.featArtists.length === 0 && (
            <Text style={s.empty}>sem feats</Text>
          )}
          {track?.featArtists.map((e) => (
            <Pressable key={e.artist.id} style={s.chip} onPress={() => removeFeat(e.artist.id)}>
              <Text style={s.chipText}>{e.artist.name}</Text>
              <Text style={s.chipRemove}>✕</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ArtistPickerModal
        visible={showPicker}
        excludeIds={existingFeatIds}
        onPick={addFeat}
        onClose={() => setShowPicker(false)}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  back: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backText: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary, letterSpacing: 1 },
  form: { padding: spacing.md, gap: spacing.sm },
  label: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1 },
  input: {
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.groteskRegular,
    fontSize: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveBtnText: { fontFamily: fonts.mono, fontSize: 13, color: colors.bg, letterSpacing: 1 },
  section: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1 },
  addBtn: { fontFamily: fonts.mono, fontSize: 11, color: colors.primary, letterSpacing: 1 },
  empty: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  chipText: { fontFamily: fonts.groteskSemi, fontSize: 14, color: colors.ink },
  chipRemove: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
})
