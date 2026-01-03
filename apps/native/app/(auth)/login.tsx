import { Ionicons } from "@expo/vector-icons"
import { Link, router } from "expo-router"
import { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { authClient } from "@/lib/auth-client"
import { queryClient } from "@/utils/orpc"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError(null)

    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onError(err) {
          setError(err.error?.message || "Failed to sign in")
          setIsLoading(false)
        },
        onSuccess() {
          queryClient.refetchQueries()
          router.replace("/(tabs)")
        },
        onFinished() {
          setIsLoading(false)
        },
      },
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#050B0D" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                paddingHorizontal: 24,
                justifyContent: "center",
                paddingVertical: 40,
              }}
            >
              {/* Logo & Welcome */}
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 50,
                  marginTop: 40,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#082f3a",
                    padding: 16,
                    borderRadius: 18,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "rgba(13, 185, 242, 0.3)",
                    shadowColor: "#0db9f2",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Ionicons name='film' size={32} color='#0db9f2' />
                </View>
                <Text
                  style={{ fontSize: 32, fontWeight: "800", color: "white" }}
                >
                  Cine<Text style={{ color: "#0db9f2" }}>Rate</Text>
                </Text>

                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    Welcome back!
                  </Text>
                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: 14,
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Sign in to discover your next favorite movie.
                  </Text>
                </View>
              </View>

              {/* Form */}
              <View style={{ gap: 24 }}>
                {error && (
                  <View
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      padding: 12,
                      borderRadius: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: "#ef4444",
                    }}
                  >
                    <Text style={{ color: "#ef4444", fontSize: 13 }}>
                      {error}
                    </Text>
                  </View>
                )}

                {/* Email Input */}
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Email Address
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#151F23",
                      borderRadius: 12,
                      height: 52,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Ionicons
                      name='mail'
                      size={20}
                      color='#64748b'
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder='hello@cinerate.com'
                      placeholderTextColor='#4b5563'
                      style={{ flex: 1, color: "white", fontSize: 15 }}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Password
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#151F23",
                      borderRadius: 12,
                      height: 52,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Ionicons
                      name='lock-closed'
                      size={20}
                      color='#64748b'
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder='••••••••'
                      placeholderTextColor='#4b5563'
                      style={{ flex: 1, color: "white", fontSize: 15 }}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color='#64748b'
                      />
                    </Pressable>
                  </View>
                  {/* <View style={{ alignItems: "flex-end", marginTop: -4 }}>
                    <Text
                      style={{
                        color: "#0db9f2",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      Forgot Password?
                    </Text>
                  </View> */}
                </View>

                <Pressable
                  onPress={handleLogin}
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#0db9f2",
                    height: 52,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                    shadowColor: "#0db9f2",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                </Pressable>
              </View>

              {/* Footer */}
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Link href='/(auth)/register' asChild>
                  <Pressable>
                    <Text style={{ color: "#64748b", fontSize: 14 }}>
                      Don't have an account?{" "}
                      <Text style={{ color: "#0db9f2", fontWeight: "700" }}>
                        Sign up
                      </Text>
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}
