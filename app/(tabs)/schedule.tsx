// app/(tabs)/schedule.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainHeader } from "../../src/components/MainHeader";
import { useMainModeContext } from "../../src/context/MainModeContext";

const BG_GREY = "#121212";

export default function ScheduleScreen() {
  const { isWorkout } = useMainModeContext();

  return (
    <View style={styles.container}>
      <MainHeader />
      <Text style={styles.text}>
        {isWorkout ? "Workout Schedule" : "Meal Schedule"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
    paddingHorizontal: 16,
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
  },
});
