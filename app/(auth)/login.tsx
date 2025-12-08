// app/(auth)/login.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../../src/hooks/useLogin";

const BG_GREY = "#121212";
const BLUE = "#007AFF";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    loading,
    handleLogin,
  } = useLogin();

  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#ffffff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* App name */}
        <Text style={styles.appName}>GetFit</Text>

        {/* Section title */}
        <Text style={styles.loginTitle}>Log In</Text>

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Log In button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => router.push("../signup")}
        >
          <Text style={{ color: "#ffffff" }}>
            Don't have an account? <Text style={{ color: BLUE }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // whole screen
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // centers block, nudges it a bit higher on the screen
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -40 }],
  },

  // loading state container
  loadingContainer: {
    flex: 1,
    backgroundColor: BG_GREY,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#ffffff",
  },

  // "GetFit"
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: BLUE,
    textAlign: "center",
    marginBottom: 12,
  },

  // "Log In"
  loginTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
  },

  // text inputs
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // button wrapper (keeps text blue-only)
  buttonContainer: {
    marginTop: 10,
  },

  // "Log In" button text
  buttonText: {
    color: BLUE,
    fontSize: 18,
    fontWeight: "600",
  },
});
