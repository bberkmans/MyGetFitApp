// src/hooks/useCreateExercise.ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { useWorkoutDraft } from "../context/WorkoutDraftContext";
import { db } from "../firebase/config";

type SetRow = {
  id: string;
  reps: string;
  weight: string;
};

type Params = {
  workoutId?: string;
  exerciseId?: string;
};

export function useCreateExercise({ workoutId, exerciseId }: Params) {
  const { user } = useAuth();
  const { addExercise } = useWorkoutDraft();

  const isEdit = useMemo(() => !!workoutId && !!exerciseId, [workoutId, exerciseId]);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [setsAndReps, setSetsAndReps] = useState<SetRow[]>([
    { id: "row-1", reps: "", weight: "" },
  ]);
  const [saving, setSaving] = useState(false);

  // Load existing exercise when editing
  useEffect(() => {
    async function load() {
      if (!isEdit || !user?.uid || !workoutId || !exerciseId) return;

      const ref = doc(db, "users", user.uid, "workouts", workoutId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data() as any;
      const exList = Array.isArray(data.exercises) ? data.exercises : [];
      const found = exList.find((e: any) => e.id === exerciseId);
      if (!found) return;

      setName(found.name ?? "");
      setNotes(found.notes ?? "");

      const normalized = Array.isArray(found.setsAndReps) ? found.setsAndReps : [];
      if (normalized.length === 0) {
        setSetsAndReps([{ id: "row-1", reps: "", weight: "" }]);
      } else {
        setSetsAndReps(
          normalized.map((s: any, idx: number) => ({
            id: `row-${idx}-${Date.now()}`,
            reps: String(s.reps ?? ""),
            weight: String(s.weight ?? ""),
          }))
        );
      }
    }

    load();
  }, [isEdit, user?.uid, workoutId, exerciseId]);

  function updateSetEntry(id: string, field: "reps" | "weight", value: string) {
    setSetsAndReps((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function addSetRow() {
    setSetsAndReps((prev) => [
      ...prev,
      { id: `row-${Date.now()}`, reps: "", weight: "" },
    ]);
  }

  function removeSetRow(id: string) {
    setSetsAndReps((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  async function saveExercise() {
    setSaving(true);
    try {
      const cleanedSets = setsAndReps
        .filter((r) => r.reps || r.weight)
        .map((r) => ({
          reps: Number(r.reps) || 0,
          weight: Number(r.weight) || 0,
        }));

      const exerciseObj = {
        id: exerciseId ?? Date.now().toString(),
        name: name.trim(),
        notes: notes.trim(),
        setsAndReps: cleanedSets,
      };

      // EDIT MODE: update Firestore workout.exercises[]
      if (isEdit && user?.uid && workoutId && exerciseId) {
        const ref = doc(db, "users", user.uid, "workouts", workoutId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;

        const data = snap.data() as any;
        const exList = Array.isArray(data.exercises) ? data.exercises : [];

        const updated = exList.map((e: any) =>
          e.id === exerciseId ? exerciseObj : e
        );

        await updateDoc(ref, { exercises: updated });
        return;
      }

      // CREATE MODE (draft workflow): add to draft context
      addExercise(exerciseObj as any);
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
