// app/(auth)/signup.tsx
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
import { useSignup } from "../../src/hooks/useSignUp";

const BG_GREY = "#121212";
const BLUE = "#007AFF";

export default function SignupScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    loading,
    handleSignup,
  } = useSignup();

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
        <Text style={styles.appName}>GetFit</Text>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignup}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{ marginTop: 16 }}
            onPress={() => router.push("/(auth)/login")}
            >
            <Text style={{ color: "#ffffff" }}>
                Already have an account? <Text style={{ color: BLUE }}>Log In</Text>
            </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -40 }],
  },
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
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: BLUE,
    textAlign: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
  },
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
  buttonContainer: {
    marginTop: 10,
  },
  buttonText: {
    color: BLUE,
    fontSize: 18,
    fontWeight: "600",
  },
});
