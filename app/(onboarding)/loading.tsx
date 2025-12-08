// app/loading.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BG_GREY = "#121212";
const BLUE = "#007AFF";

const LOADING_WORD = "Ready to Get Fit...?"; // letters that will bounce

export default function LoadingScreen() {
  const router = useRouter();

  // One animated value per letter
  const animatedValues = useRef(
    LOADING_WORD.split("").map(() => new Animated.Value(0))
  ).current;

  // Bouncing letters animation
  useEffect(() => {
    const createBounce = (value: Animated.Value) =>
      Animated.sequence([
        Animated.timing(value, {
          toValue: -10, // bounce up
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0, // back down
          duration: 250,
          useNativeDriver: true,
        }),
      ]);

    const animations = animatedValues.map((val) => createBounce(val));

    const loop = Animated.loop(
      Animated.stagger(120, animations) // letters bounce one after another
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [animatedValues]);

  // After a short delay, go to main tabs
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2000); // 2 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Bouncing word */}
      <View style={styles.wordRow}>
        {LOADING_WORD.split("").map((char, index) => (
          <Animated.Text
            key={`${char}-${index}`}
            style={[
              styles.letter,
              {
                transform: [
                  { translateY: animatedValues[index] || new Animated.Value(0) },
                ],
              },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Preparing your dashboard...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
    justifyContent: "center",
    alignItems: "center",
  },
  wordRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  letter: {
    fontSize: 28,
    fontWeight: "800",
    color: BLUE,
    marginHorizontal: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.8,
  },
});
