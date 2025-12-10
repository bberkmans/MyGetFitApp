// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../src/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main app (tabs) – protected area */}
        <Stack.Screen name="(tabs)" />
        {/* Create workout screen (normal page, not a tab) */}
        <Stack.Screen name="create-workout-page" />
      </Stack>
    </AuthProvider>
  );
}
