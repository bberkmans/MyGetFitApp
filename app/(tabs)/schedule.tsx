// app/(tabs)/schedule.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useMainModeContext } from "../../src/context/MainModeContext";

export default function ScheduleScreen() {
  const { isWorkout } = useMainModeContext();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {isWorkout ? "Workout Schedule" : "Meal Schedule"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" },
  text: { color: "#ffffff", fontSize: 20 },
});
