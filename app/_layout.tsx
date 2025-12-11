// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../src/AuthContext";
import { WorkoutDraftProvider } from "../src/context/WorkoutDraftContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WorkoutDraftProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Main app (tabs) – protected area */}
          <Stack.Screen name="(tabs)" />
          {/* Create workout screen (normal page, not a tab) */}
          <Stack.Screen name="create-workout-page" />
        </Stack>
      </WorkoutDraftProvider>
    </AuthProvider>
  );
}
