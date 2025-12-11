// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/AuthContext";
import { MainShell } from "../../src/components/MainShell";
import { useMainModeContext } from "../../src/context/MainModeContext";
import { db } from "../../src/firebase/config";

const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";

type WorkoutDoc = {
  id: string;
  name: string;
  notes?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { mode, isWorkout } = useMainModeContext();
  const { user } = useAuth();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [workouts, setWorkouts] = useState<WorkoutDoc[]>([]);

  // Fade animation when switching workout <-> diet
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

  // Listen to this user's workouts from Firestore
  useEffect(() => {
    if (!user || !isWorkout) {
      setWorkouts([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "workouts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs: WorkoutDoc[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          name: data.name ?? "Untitled workout",
          notes: data.notes,
        };
      });
      setWorkouts(docs);
    });

    return unsub;
  }, [user?.uid, isWorkout]);

  function handleAddWorkout() {
    router.push("/create-workout-page");
  }

  return (
    <MainShell>
      {/* + Workout button in WORKOUT mode only */}
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

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
        {isWorkout ? (
          <View style={styles.workoutSection}>
            {/* Workout list */}
            {workouts.length === 0 ? (
              <Text style={styles.emptyText}>
                You don’t have any workouts yet. Tap “+ Workout” to create one.
              </Text>
            ) : (
              <View style={styles.workoutList}>
                {workouts.map((w) => (
                  <View key={w.id} style={styles.workoutBubble}>
                    <Text style={styles.workoutName}>{w.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          // Diet view placeholder for now
          <View style={styles.card}>
            <Text style={styles.title}>Diet view</Text>
            <Text style={styles.text}>
              This is where your diet / meals dashboard will go.
            </Text>
          </View>
        )}
      </Animated.View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  addButtonRow: {
    marginBottom: 16,
    paddingHorizontal: 16,
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

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },

  workoutSection: {
    flex: 1,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  // the list itself
  workoutList: {
    gap: 12,
  },
  workoutBubble: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: LIGHT_GREY,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  workoutName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  // diet placeholder card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    padding: 16,
    backgroundColor: LIGHT_GREY,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#bbbbbb",
    fontSize: 14,
  },
});
