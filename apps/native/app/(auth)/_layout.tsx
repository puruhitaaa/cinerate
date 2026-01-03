import { Redirect, Stack } from "expo-router"
import { View } from "react-native"

import { authClient } from "@/lib/auth-client"

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession()

  // Show dark background while checking auth state to avoid flash
  if (isPending) {
    return <View style={{ flex: 1, backgroundColor: "#101e22" }} />
  }

  // Redirect to tabs if already authenticated
  if (session?.user) {
    return <Redirect href='/(tabs)' />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#101e22" },
      }}
    >
      <Stack.Screen name='login' />
      <Stack.Screen name='register' />
    </Stack>
  )
}
