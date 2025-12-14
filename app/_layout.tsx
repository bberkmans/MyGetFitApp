// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../src/AuthContext";
import { MainModeProvider } from "../src/context/MainModeContext";
import { WorkoutDraftProvider } from "../src/context/WorkoutDraftContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainModeProvider>
        <WorkoutDraftProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create-workout-page" />
            <Stack.Screen name="create-exercise-page" />
            <Stack.Screen name="display-workout-page" />
          </Stack>
        </WorkoutDraftProvider>
      </MainModeProvider>
    </AuthProvider>
  );
}
