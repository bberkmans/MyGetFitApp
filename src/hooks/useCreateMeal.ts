//src/hooks/useCreateMeal.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/config";

export type IngredientRow = {
  id: string;
  name: string;
  amount: string; // keep as string in UI, convert to number on save if you want
};

export function useCreateMeal() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: "ing-1", name: "", amount: "" },
  ]);

  function addIngredientRow() {
    setIngredients((prev) => [
      ...prev,
      { id: `ing-${Date.now()}`, name: "", amount: "" },
    ]);
  }

  function updateIngredientRow(
    id: string,
    field: "name" | "amount",
    value: string
  ) {
    setIngredients((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function removeIngredientRow(id: string) {
    setIngredients((prev) => {
      // keep at least 1 row so the UI never becomes empty
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== id);
    });
  }

  function resetMealDraft() {
    setName("");
    setInstructions("");
    setIngredients([{ id: "ing-1", name: "", amount: "" }]);
  }

  async function saveMeal() {
    if (!user?.uid) {
      console.log("No user - cannot save meal");
      return;
    }

    if (!name.trim()) {
      console.log("Meal needs a name");
      return;
    }

    setSaving(true);
    try {
      const cleanedIngredients = ingredients
        .filter((r) => r.name.trim() || r.amount.trim())
        .map((r) => ({
          name: r.name.trim(),
          amount: Number(r.amount) || 0,
        }));

      await addDoc(collection(db, "users", user.uid, "meals"), {
        name: name.trim(),
        instructions: instructions.trim(),
        ingredients: cleanedIngredients,
        createdAt: serverTimestamp(),
      });

      // IMPORTANT: clear local state so Cancel / next create doesn’t keep old stuff
      resetMealDraft();
    } catch (err) {
      console.log("Error saving meal:", err);
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    setName,
    instructions,
    setInstructions,
    ingredients,
    addIngredientRow,
    updateIngredientRow,
    removeIngredientRow,
    saving,
    saveMeal,
    resetMealDraft,
  };
}
