import { Tabs } from 'expo-router'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import { colors, fonts } from '../../lib/theme'
import { MiniPlayer } from '../../components/MiniPlayer'
import { TabBarIcon } from '../../components/TabBarIcon'

function TabBar(props: BottomTabBarProps) {
  return (
    <View>
      <MiniPlayer />
      <BottomTabBar {...props} />
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
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
          tabBarIcon: ({ color, size, focused }) => <TabBarIcon name="home" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'BUSCA',
          tabBarIcon: ({ color, size, focused }) => <TabBarIcon name="search" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'LISTAS',
          tabBarIcon: ({ color, size, focused }) => <TabBarIcon name="list" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'ADMIN',
          tabBarIcon: ({ color, size, focused }) => <TabBarIcon name="settings" size={size} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  )
}
