// src/hooks/useCreateWorkout.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import type { DraftExercise } from "../context/WorkoutDraftContext";
import { db } from "../firebase/config";

export function useCreateWorkout() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setNotes("");
    setSaving(false);
  }

  // return boolean so UI can decide whether to go back
  async function handleSave(exercises: DraftExercise[]): Promise<boolean> {
    if (!user) {
      console.log("Not logged in");
      return false;
    }
    if (!name.trim()) {
      console.log("Workout needs a name");
      return false;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        notes: notes.trim(),
        createdAt: serverTimestamp(),
        exercises: (exercises ?? []).map((ex) => ({
          id: ex.id,
          name: ex.name,
          notes: ex.notes,
          setsAndReps: (ex.setsAndReps ?? []).map((s) => ({
            reps: Number(s.reps) || 0,
            weight: Number(s.weight) || 0,
          })),
        })),
      };

      await addDoc(collection(db, "users", user.uid, "workouts"), payload);
      return true;
    } catch (err) {
      console.log("Error saving workout:", err);
      return false;
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
    reset,
  };
}
