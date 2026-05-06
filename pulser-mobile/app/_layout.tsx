import { useFonts } from 'expo-font'
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PlayerProvider } from '../lib/player'
import { colors } from '../lib/theme'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    JetBrainsMono_400Regular,
  })

  if (!fontsLoaded) return null

  return (
    <PlayerProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="artist/[id]" />
        <Stack.Screen name="playlist/[id]" />
        <Stack.Screen name="player" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    </PlayerProvider>
  )
}
