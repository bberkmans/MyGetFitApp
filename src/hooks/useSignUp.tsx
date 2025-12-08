// src/hooks/useSignup.ts
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";


export function useSignup() {
  const router = useRouter();
  const { signUp, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signUp(email.trim(), password);
      // After successful signup, go straight into the app
      router.replace("/profile-setup" as Href);


    } catch (err: any) {
      console.log("Signup error:", err);
      Alert.alert("Sign up failed", err?.message || "Please try again.");
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
    handleSignup,
  };
}
