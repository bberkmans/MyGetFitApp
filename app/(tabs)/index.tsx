// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MainShell } from "../../src/components/MainShell";
import { useMainModeContext } from "../../src/context/MainModeContext";

const BLUE = "#007AFF";

export default function HomeScreen() {
  const { mode, isWorkout } = useMainModeContext();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  // Fade when switching workout <-> diet
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode, fadeAnim]);

  function handleAddWorkout() {
    // ✅ navigate to the standalone create-workout-page screen
    router.push("/create-workout-page");
  }

  return (
    <MainShell>
      {/* Only show + Workout button in WORKOUT mode */}
      {isWorkout && (
        <View style={styles.addButtonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddWorkout}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main content area (currently empty, just fades between modes) */}
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        {/* we'll fill this in later with real workout/diet dashboards */}
      </Animated.View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  addButtonRow: {
    marginBottom: 16,
  },
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: BLUE,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
