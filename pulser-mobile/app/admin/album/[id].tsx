import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../../lib/api'
import type { Album } from '../../../lib/api'
import { ArtistPickerModal } from '../../../components/ArtistPickerModal'
import { colors, fonts, spacing } from '../../../lib/theme'

export default function AdminAlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [album, setAlbum] = useState<Album | null>(null)
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    if (!id) return
    api.album(id).then((a) => {
      setAlbum(a)
      setTitle(a.title)
      setYear(a.year != null ? String(a.year) : '')
    }).catch(console.error)
  }, [id])

  async function save() {
    if (!id) return
    setSaving(true)
    await api.patchAlbum(id, { title, year: year ? Number(year) : null })
      .then(() => Alert.alert('Salvo'))
      .catch(() => Alert.alert('Erro ao salvar'))
      .finally(() => setSaving(false))
  }

  async function removeAdditional(artistId: string) {
    if (!id) return
    await api.removeAlbumArtist(id, artistId).catch(console.error)
    setAlbum((prev) =>
      prev
        ? { ...prev, additionalArtists: prev.additionalArtists.filter((e) => e.artist.id !== artistId) }
        : prev
    )
  }

  async function addAdditional(artist: { id: string; name: string }) {
    if (!id) return
    await api.addAlbumArtist(id, artist.id).catch(console.error)
    setAlbum((prev) =>
      prev ? { ...prev, additionalArtists: [...prev.additionalArtists, { artist }] } : prev
    )
  }

  const existingIds = album
    ? [album.artist.id, ...album.additionalArtists.map((e) => e.artist.id)]
    : []

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <Pressable style={s.back} onPress={() => router.back()}>
        <Text style={s.backText}>‹ voltar</Text>
      </Pressable>
      <ScrollView>
        <View style={s.form}>
          <Text style={s.label}>TÍTULO</Text>
          <TextInput style={s.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.inkMute} />
          <Text style={s.label}>ANO</Text>
          <TextInput
            style={s.input}
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            placeholderTextColor={colors.inkMute}
          />
          <Pressable style={s.saveBtn} onPress={save} disabled={saving}>
            <Text style={s.saveBtnText}>{saving ? 'salvando...' : 'salvar'}</Text>
          </Pressable>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>ARTISTAS ADICIONAIS</Text>
            <Pressable onPress={() => setShowPicker(true)}>
              <Text style={s.addBtn}>+ adicionar</Text>
            </Pressable>
          </View>
          {album && (
            <View style={s.chipRow}>
              <View style={[s.chip, s.chipPrimary]}>
                <Text style={s.chipTextPrimary}>{album.artist.name}</Text>
              </View>
              {album.additionalArtists.map((e) => (
                <Pressable key={e.artist.id} style={s.chip} onPress={() => removeAdditional(e.artist.id)}>
                  <Text style={s.chipText}>{e.artist.name} ✕</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>FAIXAS</Text>
          {(album?.tracks ?? []).map((track) => (
            <Pressable
              key={track.id}
              style={s.row}
              onPress={() => router.push(`/admin/track/${track.id}`)}
            >
              <Text style={s.num}>{track.trackNumber ?? '—'}</Text>
              <View style={s.rowMeta}>
                <Text style={s.rowText}>{track.title}</Text>
                {track.featArtists.length > 0 && (
                  <Text style={s.rowSub}>feat. {track.featArtists.map((e) => e.artist.name).join(', ')}</Text>
                )}
              </View>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ArtistPickerModal
        visible={showPicker}
        excludeIds={existingIds}
        onPick={addAdditional}
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
    paddingBottom: spacing.md,
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.md },
  chip: {
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipPrimary: { borderColor: colors.primary },
  chipText: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  chipTextPrimary: { fontFamily: fonts.mono, fontSize: 11, color: colors.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    gap: spacing.sm,
  },
  num: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, width: 24, textAlign: 'right' },
  rowMeta: { flex: 1 },
  rowText: { fontFamily: fonts.groteskSemi, fontSize: 14, color: colors.ink },
  rowSub: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  arrow: { fontFamily: fonts.grotesk, fontSize: 18, color: colors.inkMute },
})
