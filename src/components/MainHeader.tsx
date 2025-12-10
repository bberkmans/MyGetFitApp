import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMainModeContext } from "../context/MainModeContext";

const BLUE = "#007AFF";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";

type MainHeaderProps = {
  onPressProfile?: () => void;
};

export function MainHeader({ onPressProfile }: MainHeaderProps) {
  const { mode, isWorkout, isDiet, setMode } = useMainModeContext();

  function handleSwitch(next: "workout" | "diet") {
    if (next === mode) return;
    setMode(next);
  }

  return (
    <View style={styles.headerContainer}>
      {/* Toggle in the center */}
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

      {/* Circle in top-right */}
      {onPressProfile && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onPressProfile}
          activeOpacity={0.8}
        >
          {/* Placeholder initial – can swap for avatar later */}
          <Text style={styles.profileInitial}>P</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 60,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  topRow: {
    alignItems: "center",
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
  profileButton: {
    position: "absolute",
    right: 16,
    top: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1f2933",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
