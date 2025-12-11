import React, { createContext, ReactNode, useContext, useState } from "react";

export type DraftSet = {
  reps: number;
  sets: number;
  weight: number;
};

export type DraftExercise = {
  id: string;
  name: string;
  notes: string;
  setsAndReps: DraftSet[];
};

type WorkoutDraftContextValue = {
  exercises: DraftExercise[];
  addExercise: (exercise: DraftExercise) => void;
  clearDraft: () => void;
};

const WorkoutDraftContext = createContext<WorkoutDraftContextValue | undefined>(
  undefined
);

export function WorkoutDraftProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<DraftExercise[]>([]);

  function addExercise(exercise: DraftExercise) {
    setExercises((prev) => [...prev, exercise]);
  }

  function clearDraft() {
    setExercises([]);
  }

  return (
    <WorkoutDraftContext.Provider value={{ exercises, addExercise, clearDraft }}>
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const ctx = useContext(WorkoutDraftContext);
  if (!ctx) {
    throw new Error("useWorkoutDraft must be used within a WorkoutDraftProvider");
  }
  return ctx;
}
