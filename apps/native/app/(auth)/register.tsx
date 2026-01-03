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

export default function RegisterScreen() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister() {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError(null)

    await authClient.signUp.email({
      email,
      password,
      name: username,
      username,
      fetchOptions: {
        onError(err) {
          setError(err.error?.message || "Failed to create account")
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
              style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 10 }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Pressable
                  onPress={() => router.back()}
                  style={{ padding: 4, marginLeft: -4 }}
                >
                  <Ionicons name='chevron-back' size={28} color='white' />
                </Pressable>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "600",
                    marginRight: 24,
                  }}
                >
                  Create Account
                </Text>
              </View>

              <View style={{ alignItems: "center", marginVertical: 24 }}>
                <View
                  style={{
                    backgroundColor: "#082f3a",
                    padding: 20,
                    borderRadius: 50,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "rgba(13, 185, 242, 0.3)",
                    shadowColor: "#0db9f2",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Ionicons name='film' size={28} color='#0db9f2' />
                </View>
                <Text
                  style={{ fontSize: 28, fontWeight: "800", color: "white" }}
                >
                  Join the Club
                </Text>
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Start your journey to discover and rate movies.
                </Text>
              </View>

              {/* Form */}
              <View style={{ gap: 20 }}>
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

                {/* Username */}
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
                    Username
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
                      name='person'
                      size={18}
                      color='#64748b'
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder='MovieBuff99'
                      placeholderTextColor='#4b5563'
                      style={{ flex: 1, color: "white", fontSize: 15 }}
                      autoCapitalize='none'
                    />
                  </View>
                </View>

                {/* Email */}
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
                    Email
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
                      size={18}
                      color='#64748b'
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder='name@example.com'
                      placeholderTextColor='#4b5563'
                      style={{ flex: 1, color: "white", fontSize: 15 }}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </View>
                </View>

                {/* Password */}
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
                    Password
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
                      name='lock-closed'
                      size={18}
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
                </View>

                {/* Confirm Password */}
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
                    Confirm Password
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
                      name='shield-checkmark'
                      size={18}
                      color='#64748b'
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder='••••••••'
                      placeholderTextColor='#4b5563'
                      style={{ flex: 1, color: "white", fontSize: 15 }}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                    />
                  </View>
                </View>

                {/* Terms */}
                <Text
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    lineHeight: 18,
                  }}
                >
                  By signing up, you agree to our{" "}
                  <Text style={{ color: "#0db9f2" }}>Terms of Service</Text> and{" "}
                  <Text style={{ color: "#0db9f2" }}>Privacy Policy</Text>.
                </Text>

                <Pressable
                  onPress={handleRegister}
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
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </Text>
                </Pressable>
              </View>

              {/* Footer */}
              <View
                style={{
                  marginTop: 24,
                  marginBottom: 40,
                  alignItems: "center",
                }}
              >
                <Link href='/(auth)/login' asChild>
                  <Pressable>
                    <Text style={{ color: "#64748b", fontSize: 14 }}>
                      Already have an account?{" "}
                      <Text style={{ color: "#0db9f2", fontWeight: "700" }}>
                        Log In
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
