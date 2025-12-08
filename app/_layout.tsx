// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../src/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main app (tabs) – protected area */}
        <Stack.Screen name="(tabs)" />

        {/* We DON’T need an explicit "(auth)" screen here */}
        {/* Auth routes like (auth)/login are picked up automatically */}
        {/* Auth screens group */}
        {/**<Stack.Screen name="(auth)" /> */}
      </Stack>
    </AuthProvider>
  );
}
