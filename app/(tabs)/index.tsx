// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
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

type WorkoutExercise = {
  id: string;
  name: string;
};

type WorkoutDoc = {
  id: string;
  name: string;
  notes?: string;
  exercises?: WorkoutExercise[];
};

type MealIngredient = {
  name: string;
  amount: number;
};

type MealDoc = {
  id: string;
  name: string;
  instructions?: string;
  ingredients?: MealIngredient[];
};

function formatExerciseLine(exercises?: WorkoutExercise[]) {
  if (!exercises || exercises.length === 0) return "No exercises yet";
  return exercises
    .map((e) => e?.name)
    .filter(Boolean)
    .join(", ");
}

function formatIngredientLine(ingredients?: MealIngredient[]) {
  if (!ingredients || ingredients.length === 0) return "No ingredients yet";
  return ingredients
    .map((i) => i?.name)
    .filter(Boolean)
    .join(", ");
}

export default function HomeScreen() {
  const router = useRouter();
  const { mode, isWorkout } = useMainModeContext();
  const { user } = useAuth();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [workouts, setWorkouts] = useState<WorkoutDoc[]>([]);
  const [meals, setMeals] = useState<MealDoc[]>([]);

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

  // ✅ WORKOUTS listener (workout mode only)
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
      const docs: WorkoutDoc[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          name: data.name ?? "Untitled workout",
          notes: data.notes ?? "",
          exercises: Array.isArray(data.exercises) ? data.exercises : [],
        };
      });
      setWorkouts(docs);
    });

    return unsub;
  }, [user?.uid, isWorkout]);

  // ✅ MEALS listener (diet mode only)
  useEffect(() => {
    if (!user || isWorkout) {
      setMeals([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "meals"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs: MealDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: data.name ?? "Untitled meal",
            instructions: data.instructions ?? "",
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          };
        });
        setMeals(docs);
      },
      (error) => {
        console.log("Meals snapshot error:", error);
        setMeals([]);
      }
    );


    return unsub;
  }, [user?.uid, isWorkout]);

  function handleAddWorkout() {
    router.push("/create-workout-page");
  }

  function handleAddMeal() {
    router.push("/create-meal-page");
  }

  return (
    <MainShell>
      {/* ✅ Top button changes based on mode */}
      {isWorkout ? (
        <View style={styles.addButtonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddWorkout}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.addButtonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMeal}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Meal</Text>
          </TouchableOpacity>
        </View>
      )}

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
        {/* ✅ WORKOUT MODE */}
        {isWorkout ? (
          <View style={styles.section}>
            {workouts.length === 0 ? (
              <Text style={styles.emptyText}>
                You don’t have any workouts yet. Tap “+ Workout” to create one.
              </Text>
            ) : (
              <View style={styles.list}>
                {workouts.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/display-workout-page",
                        params: { workoutId: w.id },
                      })
                    }
                  >
                    <Text style={styles.cardTitle}>{w.name}</Text>

                    <Text
                      style={styles.cardSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatExerciseLine(w.exercises)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          /* ✅ DIET MODE (MEALS) */
          <View style={styles.section}>
            {meals.length === 0 ? (
              <Text style={styles.emptyText}>
                You don’t have any meals yet. Tap “+ Meal” to create one.
              </Text>
            ) : (
              <View style={styles.list}>
                {meals.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() => {
                      // Later: display-meal-page
                      // router.push({ pathname: "/display-meal-page", params: { mealId: m.id } })
                      router.push({ pathname: "/display-meal-page", params: { mealId: m.id } })
                    }}
                  >
                    <Text style={styles.cardTitle}>{m.name}</Text>

                    <Text
                      style={styles.cardSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatIngredientLine(m.ingredients)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  addButtonRow: {
    marginBottom: 14,
    paddingHorizontal: 16,
    marginTop: 10,
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
    marginTop: 10,
  },

  section: { flex: 1 },
  emptyText: { color: "#9ca3af", fontSize: 14 },

  list: { gap: 12 },

  card: {
    borderWidth: 1,
    borderColor: BORDER_GREY,
    backgroundColor: LIGHT_GREY,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardSubtitle: {
    color: "#c7c7c7",
    fontSize: 13,
    lineHeight: 18,
  },
});
