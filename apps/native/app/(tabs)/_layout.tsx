import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from "expo-router"
import { View } from "react-native"

import { authClient } from "@/lib/auth-client"

export default function TabsLayout() {
  const { data: session, isPending } = authClient.useSession()

  // Show dark background while checking auth state to avoid flash
  if (isPending) {
    return <View style={{ flex: 1, backgroundColor: "#050B0D" }} />
  }

  // Redirect to login if not authenticated
  if (!session?.user) {
    return <Redirect href='/(auth)/login' />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050B0D", // Deep dark background
          borderTopColor: "rgba(255,255,255,0.05)", // Subtle border
          height: 80, // Taller tab bar
          paddingBottom: 25,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#0db9f2", // Cyan active color
        tabBarInactiveTintColor: "#64748b", // Slate inactive color
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "#050B0D" }} />
        ),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
