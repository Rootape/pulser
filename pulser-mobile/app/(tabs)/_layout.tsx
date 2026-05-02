import { Tabs } from 'expo-router'
import { colors, fonts } from '../../lib/theme'
import { Icon } from '../../components/Icon'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.hairline },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMute,
        tabBarLabelStyle: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'INÍCIO',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'BUSCA',
          tabBarIcon: ({ color, size }) => <Icon name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'LISTAS',
          tabBarIcon: ({ color, size }) => <Icon name="list" size={size} color={color} />,
        }}
      />
      {/* Screens nested in tabs group — tab bar stays visible */}
      <Tabs.Screen name="artist/[id]" options={{ href: null }} />
      <Tabs.Screen name="album/[id]" options={{ href: null }} />
    </Tabs>
  )
}
