// app/create-workout-page.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useWorkoutDraft } from "../src/context/WorkoutDraftContext";
import { useCreateWorkout } from "../src/hooks/useCreateWorkout";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";

export default function CreateWorkoutPage() {
  const router = useRouter();
  const { exercises, clearDraft } = useWorkoutDraft();
  const { name, setName, notes, setNotes, saving, handleSave, reset } =
    useCreateWorkout();

  async function handleSaveAndGoBack() {
    const ok = await handleSave(exercises);
    if (!ok) return;

    clearDraft();
    reset();
    router.back();
  }

  function handleCancel() {
    clearDraft();
    reset();
    router.back();
  }

  function handleAddExercise() {
    router.push("/create-exercise-page");
  }

  function handleEditExercise(exerciseId: string) {
    router.push({
      pathname: "/create-exercise-page",
      params: { exerciseId },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Workout</Text>

        <Text style={styles.label}>Workout name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Push Day, Full Body, Legs"
          placeholderTextColor="#888888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add any notes about exercises, sets, or focus..."
          placeholderTextColor="#888888"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Exercise chips */}
        {exercises.length > 0 && (
          <View style={styles.exerciseList}>
            {exercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.exerciseChip}
                activeOpacity={0.85}
                onPress={() => handleEditExercise(ex.id)}
              >
                <Text style={styles.exerciseChipText}>{ex.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
          disabled={saving}
        >
          <Text style={styles.addExerciseText}>+ Exercise</Text>
        </TouchableOpacity>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveAndGoBack}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG_GREY },
  card: {
    marginTop: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: LIGHT_GREY,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    color: "#cccccc",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#ffffff",
    backgroundColor: BG_GREY,
  },
  notesInput: { height: 100, textAlignVertical: "top" },

  exerciseList: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseChip: {
    borderRadius: 999,
    backgroundColor: "#27272a",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exerciseChipText: { color: "#ffffff", fontSize: 14, fontWeight: "500" },

  addExerciseButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BLUE,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addExerciseText: { color: BLUE, fontSize: 16, fontWeight: "600" },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  secondaryButton: { paddingVertical: 10, paddingHorizontal: 16 },
  secondaryText: { color: "#cccccc", fontSize: 16 },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  primaryText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
