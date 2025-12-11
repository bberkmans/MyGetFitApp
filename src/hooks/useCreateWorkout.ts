// src/hooks/useCreateWorkout.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/config";

type SetRow = {
  reps: string;
  sets: string;
};

export function useCreateWorkout() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // kept for future use if you want sets at workout level
  const [setRows, setSetRows] = useState<SetRow[]>([
    { reps: "", sets: "" },
  ]);

  function addSetRow() {
    setSetRows((prev) => [...prev, { reps: "", sets: "" }]);
  }

  function updateSetRow(index: number, field: "reps" | "sets", value: string) {
    setSetRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  }

  function removeSetRow(index: number) {
    setSetRows((prev) => prev.filter((_, i) => i !== index));
  }

  /** Reset the form so a new "+ Workout" starts totally blank */
  function resetWorkoutDraft() {
    setName("");
    setNotes("");
    setSetRows([{ reps: "", sets: "" }]);
  }

  /**
   * Save to Firestore under users/{uid}/workouts.
   * Returns true if it saved successfully, false otherwise.
   */
  async function handleSave(): Promise<boolean> {
    if (!name.trim()) {
      console.log("Workout needs a name");
      return false;
    }

    if (!user) {
      console.log("No logged-in user, not saving workout");
      return false;
    }

    setSaving(true);
    let ok = false;

    try {
      const cleanedSets = setRows
        .filter((row) => row.reps || row.sets)
        .map((row) => ({
          reps: Number(row.reps) || 0,
          sets: Number(row.sets) || 0,
        }));

      await addDoc(
        collection(db, "users", user.uid, "workouts"),
        {
          name: name.trim(),
          notes: notes.trim(),
          sets: cleanedSets,
          createdAt: serverTimestamp(),
        }
      );

      ok = true;
    } catch (err) {
      console.log("Error saving workout:", err);
    } finally {
      setSaving(false);
    }

    return ok;
  }

  return {
    name,
    setName,
    notes,
    setNotes,
    saving,
    handleSave,
    setRows,
    addSetRow,
    updateSetRow,
    removeSetRow,
    resetWorkoutDraft,
  };
}
