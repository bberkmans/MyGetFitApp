// app/(tabs)/index.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MainHeader } from "../../src/components/MainHeader";
import { useMainModeContext } from "../../src/context/MainModeContext";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";

export default function HomeScreen() {
  const { mode, isWorkout } = useMainModeContext();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Whenever the mode changes (WORKOUT/DIET), fade the content
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

  return (
    <View style={styles.container}>
      {/* Universal WORKOUT / DIET toggle */}
      <MainHeader />

      {/* Fading content area */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {isWorkout ? (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>Workout view</Text>
            <Text style={styles.placeholderText}>
              This is where your workout dashboard will go.
            </Text>
          </View>
        ) : (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>Diet view</Text>
            <Text style={styles.placeholderText}>
              This is where your diet dashboard will go.
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  placeholderCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    padding: 16,
    backgroundColor: LIGHT_GREY,
  },
  placeholderTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  placeholderText: {
    color: "#bbbbbb",
    fontSize: 14,
  },
});
