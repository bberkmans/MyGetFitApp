// app/(tabs)/createWorkoutPage.tsx
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
import { MainShell } from "../src/components/MainShell";
import { MainModeProvider } from "../src/context/MainModeContext";
import { useCreateWorkout } from "../src/hooks/useCreateWorkout";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";

export default function CreateWorkoutPage() {
  const { name, setName, notes, setNotes, saving, handleSave } =
    useCreateWorkout();
  const router = useRouter();

  async function handleSaveAndGoBack() {
    await handleSave();
    // Later we can only goBack if save succeeded. For now this is simple:
    // router.back();
  }

  return (
    <MainModeProvider>
    <MainShell>
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
    </MainShell>
    </MainModeProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  card: {
    marginTop: 8,
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
});
