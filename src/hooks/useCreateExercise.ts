// src/hooks/useCreateExercise.ts
import { useState } from "react";
import { useWorkoutDraft } from "../context/WorkoutDraftContext";

type SetRow = {
  id: string;
  reps: string;
  sets: string;
  weight: string; // NEW
};

export function useCreateExercise() {
  const { addExercise } = useWorkoutDraft();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [setsAndReps, setSetsAndReps] = useState<SetRow[]>([
    { id: "row-1", reps: "", sets: "", weight: "" },
  ]);
  const [saving, setSaving] = useState(false);

  function updateSetEntry(
    id: string,
    field: "reps" | "sets" | "weight",
    value: string
  ) {
    setSetsAndReps((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  }

  function addSetRow() {
    setSetsAndReps((prev) => [
      ...prev,
      { id: `row-${Date.now()}`, reps: "", sets: "", weight: "" },
    ]);
  }

  function removeSetRow(id: string) {
    setSetsAndReps((prev) =>
      prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)
    );
  }

  async function saveExercise() {
    setSaving(true);
    try {
      const draft = {
        id: Date.now().toString(),
        name: name.trim(),
        notes: notes.trim(),
        // each entry now has reps, sets, weight
        setsAndReps: setsAndReps
          .filter((row) => row.reps || row.sets || row.weight)
          .map((row) => ({
            reps: Number(row.reps) || 0,
            sets: Number(row.sets) || 0,
            weight: Number(row.weight) || 0,
          })),
      };

      // this pushes the exercise (with sets/reps/weight) into the workout draft
      addExercise(draft);
    } finally {
      setSaving(false);
    }
  }

  return {
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
  };
}
