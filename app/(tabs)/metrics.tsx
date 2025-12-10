import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainShell } from "../../src/components/MainShell";
import { useMainModeContext } from "../../src/context/MainModeContext";

export default function MetricsScreen() {
  const { isWorkout } = useMainModeContext();

  return (
    <MainShell>
      <View style={styles.content}>
        <Text style={styles.text}>
          {isWorkout ? "Steps view" : "Calories view"}
        </Text>
      </View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
  },
});
