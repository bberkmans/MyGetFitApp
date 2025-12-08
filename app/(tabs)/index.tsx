// app/(tabs)/index.tsx
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMainModeContext } from "../../src/context/MainModeContext";

const BG_GREY = "#121212";
const BLUE = "#007AFF";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";

export default function HomeScreen() {
  const { mode, isWorkout, isDiet, setMode } = useMainModeContext();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function handleSwitch(nextMode: "workout" | "diet") {
    if (nextMode === mode) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setMode(nextMode);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }

  return (
    <View style={styles.container}>
      {/* Top WORKOUT / DIET toggle */}
      <View style={styles.topRow}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchItem,
              isWorkout && styles.switchItemActive,
            ]}
            onPress={() => handleSwitch("workout")}
          >
            <Text
              style={[
                styles.switchText,
                isWorkout && styles.switchTextActive,
              ]}
            >
              WORKOUT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchItem,
              isDiet && styles.switchItemActive,
            ]}
            onPress={() => handleSwitch("diet")}
          >
            <Text
              style={[
                styles.switchText,
                isDiet && styles.switchTextActive,
              ]}
            >
              DIET
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  topRow: {
    alignItems: "center",
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    overflow: "hidden",
    backgroundColor: LIGHT_GREY,
  },
  switchItem: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  switchItemActive: {
    backgroundColor: "#ffffff",
  },
  switchText: {
    color: "#cccccc",
    fontSize: 14,
    fontWeight: "600",
  },
  switchTextActive: {
    color: BLUE,
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
