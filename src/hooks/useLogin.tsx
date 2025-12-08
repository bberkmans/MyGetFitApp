// src/hooks/useLogin.ts
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";

export function useLogin() {
  const router = useRouter();
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      // On success, go to main tabs
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Login error:", err);
      Alert.alert("Login failed", err?.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    loading,
    handleLogin,
  };
}
