// app/display-workout-page.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { MainShell } from "../src/components/MainShell";
import { useDisplayWorkoutPage } from "../src/hooks/useDisplayWorkoutPage";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";

export default function DisplayWorkoutPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ workoutId?: string }>();
  const workoutId = params.workoutId ?? "";

  const { workout, loading } = useDisplayWorkoutPage(workoutId);

  function handleEditExercise(exerciseId: string) {
    router.push({
      pathname: "/create-exercise-page",
      params: { workoutId, exerciseId },
    });
  }

  return (
    <MainShell showHeader={false}>
      <View style={styles.container}>
        {/* Top row: Back */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : !workout ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Workout not found.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.workoutTitle}>{workout.name}</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {workout.exercises.length === 0 ? (
                <Text style={styles.emptyText}>
                  No exercises yet. Add exercises from the create workout flow.
                </Text>
              ) : (
                workout.exercises.map((ex) => (
                  <View key={ex.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeaderRow}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>

                      <TouchableOpacity
                        onPress={() => handleEditExercise(ex.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.editText}>Edit Exercise</Text>
                      </TouchableOpacity>
                    </View>

                    {/* One line per set: reps + weight */}
                    <View style={styles.setList}>
                      {ex.setsAndReps.length === 0 ? (
                        <Text style={styles.setLineMuted}>
                          No sets added.
                        </Text>
                      ) : (
                        ex.setsAndReps.map((s, idx) => (
                          <Text key={idx} style={styles.setLine}>
                            # of Reps: {s.reps}{"   "}# of Weight: {s.weight}
                          </Text>
                        ))
                      )}
                    </View>
                  </View>
                ))
              )}

              <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}
      </View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    backgroundColor: BG_GREY,
    paddingHorizontal: 16,
  },
  topRow: {
    marginTop: 12,
    marginBottom: 8,
  },
  backText: {
    color: "#cccccc",
    fontSize: 16,
    fontWeight: "600",
  },
  workoutTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
    marginTop: 6,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  exerciseCard: {
    backgroundColor: LIGHT_GREY,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  exerciseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  exerciseName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  editText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "700",
  },
  setList: {
    gap: 6,
  },
  setLine: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "500",
  },
  setLineMuted: {
    color: "#9ca3af",
    fontSize: 13,
  },
  startButton: {
    marginTop: 18,
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
