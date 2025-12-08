// src/components/MainHeader.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMainModeContext } from "../context/MainModeContext";

const BLUE = "#007AFF";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";

export function MainHeader() {
  const { mode, isWorkout, isDiet, setMode } = useMainModeContext();

  function handleSwitch(next: "workout" | "diet") {
    if (next === mode) return;
    setMode(next);
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: "center",
    marginTop: 60,
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
});
