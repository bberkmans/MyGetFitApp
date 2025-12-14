// app/create-exercise-page.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { useCreateExercise } from "../src/hooks/useCreateExercise";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";
const RED = "#ef4444";

export default function CreateExercisePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    workoutId?: string;
    exerciseId?: string;
  }>();

  const workoutId = params.workoutId;
  const exerciseId = params.exerciseId;

  const {
    name,
    setName,
    notes,
    setNotes,
    setsAndReps,
    updateSetEntry,
    addSetRow,
    removeSetRow,
    saving,
    saveExercise,
  } = useCreateExercise({ workoutId, exerciseId });

  async function handleSaveAndGoBack() {
    await saveExercise();
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {exerciseId ? "Edit Exercise" : "Create Exercise"}
        </Text>

        <Text style={styles.label}>Exercise name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bench Press, Squat, Push-ups"
          placeholderTextColor="#888888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any cues, tempo, or comments..."
          placeholderTextColor="#888888"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Text style={[styles.label, { marginTop: 20 }]}>
          Reps & weight
        </Text>

        {setsAndReps.map((row, index) => (
          <View style={styles.setRow} key={row.id}>
            {/* reps */}
            <View style={styles.setBlock}>
              <TextInput
                style={styles.setInput}
                keyboardType="numeric"
                value={row.reps}
                onChangeText={(text) => updateSetEntry(row.id, "reps", text)}
                placeholder="0"
                placeholderTextColor="#888888"
              />
              <Text style={styles.setLabel}>reps</Text>
            </View>

            {/* weight */}
            <View style={styles.setBlock}>
              <TextInput
                style={styles.setInput}
                keyboardType="numeric"
                value={row.weight}
                onChangeText={(text) => updateSetEntry(row.id, "weight", text)}
                placeholder="0"
                placeholderTextColor="#888888"
              />
              <Text style={styles.setLabel}>weight</Text>
            </View>

            {index > 0 && (
              <TouchableOpacity
                style={styles.removeCircle}
                onPress={() => removeSetRow(row.id)}
              >
                <Text style={styles.removeText}>-</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addSetButton} onPress={addSetRow}>
          <Text style={styles.addSetText}>+ Add set</Text>
        </TouchableOpacity>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
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
  flex: {
    flex: 1,
    backgroundColor: BG_GREY,
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    padding: 16,
    backgroundColor: LIGHT_GREY,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
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
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  setBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  setInput: {
    width: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#444444",
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: "#ffffff",
    backgroundColor: BG_GREY,
    textAlign: "center",
    marginRight: 6,
  },
  setLabel: {
    color: "#cccccc",
    fontSize: 13,
  },
  addSetButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BLUE,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  addSetText: {
    color: BLUE,
    fontWeight: "600",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: "#cccccc",
    fontSize: 16,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  removeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: RED,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  removeText: {
    color: RED,
    fontSize: 16,
    fontWeight: "700",
    marginTop: -1,
  },
});
