// src/hooks/useMainMode.ts
import { useRef, useState } from "react";
import { Animated } from "react-native";

export type MainMode = "workout" | "diet";

export function useMainMode(initialMode: MainMode = "workout") {
  const [mode, setMode] = useState<MainMode>(initialMode);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function switchMode(nextMode: MainMode) {
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

  const isWorkout = mode === "workout";
  const isDiet = mode === "diet";

  return {
    mode,
    isWorkout,
    isDiet,
    fadeAnim,
    switchMode,
  };
}
