import { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../../lib/api'
import type { ArtistDetail } from '../../../lib/api'
import { colors, fonts, spacing } from '../../../lib/theme'

export default function AdminArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [artist, setArtist] = useState<ArtistDetail | null>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    api.artist(id).then((a) => {
      setArtist(a)
      setName(a.name)
      setBio(a.bio ?? '')
      setImageUrl(a.imageUrl ?? '')
    }).catch(console.error)
  }, [id])

  async function save() {
    if (!id) return
    setSaving(true)
    await api.patchArtist(id, {
      name: name || undefined,
      bio: bio || undefined,
      imageUrl: imageUrl || undefined,
    })
      .then(() => Alert.alert('Salvo'))
      .catch(() => Alert.alert('Erro ao salvar'))
      .finally(() => setSaving(false))
  }

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <Pressable style={s.back} onPress={() => router.back()}>
        <Text style={s.backText}>‹ voltar</Text>
      </Pressable>
      <ScrollView>
        <View style={s.form}>
          <Text style={s.label}>NOME</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.inkMute}
          />
          <Text style={s.label}>BIO</Text>
          <TextInput
            style={[s.input, s.multiline]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={colors.inkMute}
          />
          <Text style={s.label}>IMAGE URL</Text>
          <TextInput
            style={s.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholderTextColor={colors.inkMute}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={s.saveBtn} onPress={save} disabled={saving}>
            <Text style={s.saveBtnText}>{saving ? 'salvando...' : 'salvar'}</Text>
          </Pressable>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>ÁLBUNS</Text>
          {(artist?.albums ?? []).map((album) => (
            <Pressable
              key={album.id}
              style={s.row}
              onPress={() => router.push(`/admin/album/${album.id}`)}
            >
              <View style={s.rowMeta}>
                <Text style={s.rowText}>{album.title}</Text>
                {album.year != null && <Text style={s.rowSub}>{album.year}</Text>}
              </View>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
  multiline: { height: 80 },
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
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.inkMute,
    letterSpacing: 1,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  rowMeta: { flex: 1 },
  rowText: { fontFamily: fonts.groteskSemi, fontSize: 14, color: colors.ink },
  rowSub: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  arrow: { fontFamily: fonts.grotesk, fontSize: 18, color: colors.inkMute },
})
