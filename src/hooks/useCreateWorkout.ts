// src/hooks/useCreateWorkout.ts
import { useState } from "react";
import { Alert } from "react-native";

export function useCreateWorkout() {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please give your workout a name.");
      return;
    }

    try {
      setSaving(true);

      // TODO: later we'll save to Firestore under the logged-in user:
      // const uid = auth.currentUser?.uid;
      // await addDoc(collection(db, "workouts"), { uid, name, notes, ... })

      console.log("Saving workout:", { name, notes });

      Alert.alert("Saved", "Your workout has been created (stub).");
      // Later we can navigate back or to a workout detail screen
    } catch (e: any) {
      console.log("Error saving workout:", e);
      Alert.alert("Error", "Could not save workout, please try again.");
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    setName,
    notes,
    setNotes,
    saving,
    handleSave,
  };
}
