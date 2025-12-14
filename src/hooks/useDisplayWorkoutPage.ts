// src/hooks/useDisplayWorkoutPage.ts
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/config";

export type WorkoutExercise = {
  id: string;
  name: string;
  notes?: string;
  setsAndReps: { reps: number; weight: number }[];
};

export type WorkoutDetails = {
  id: string;
  name: string;
  notes?: string;
  exercises: WorkoutExercise[];
};

export function useDisplayWorkoutPage(workoutId: string) {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !workoutId) {
      setWorkout(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ref = doc(db, "users", user.uid, "workouts", workoutId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setWorkout(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as any;

        setWorkout({
          id: snap.id,
          name: data.name ?? "Untitled workout",
          notes: data.notes ?? "",
          exercises: Array.isArray(data.exercises) ? data.exercises : [],
        });

        setLoading(false);
      },
      () => {
        setWorkout(null);
        setLoading(false);
      }
    );

    return unsub;
  }, [user?.uid, workoutId]);

  return { workout, loading };
}
