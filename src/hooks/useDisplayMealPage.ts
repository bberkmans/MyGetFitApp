// src/hooks/useDisplayMealPage.ts
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/config";

export type MealIngredient = {
  id?: string;
  name: string;
  amount: number;
};

export type MealDoc = {
  id: string;
  name: string;
  instructions?: string;
  ingredients: MealIngredient[];
};

export function useDisplayMealPage(mealId?: string) {
  const { user } = useAuth();

  const [meal, setMeal] = useState<MealDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !mealId) {
      setMeal(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ref = doc(db, "users", user.uid, "meals", String(mealId));

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setMeal(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as any;

        setMeal({
          id: snap.id,
          name: data.name ?? "Untitled meal",
          instructions: data.instructions ?? "",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        });

        setLoading(false);
      },
      (err) => {
        console.log("Error loading meal:", err);
        setMeal(null);
        setLoading(false);
      }
    );

    return unsub;
  }, [user?.uid, mealId]);

  return { meal, loading };
}
