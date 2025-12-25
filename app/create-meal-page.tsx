//app//creat-meal-page.tsx
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
import { useCreateMeal } from "../src/hooks/useCreateMeal";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";
const RED = "#ef4444";

export default function CreateMealPage() {
  const router = useRouter();

  const {
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
  } = useCreateMeal();

  async function handleSave() {
    await saveMeal();
    // If save succeeded, you’ll see it on Meals list automatically via listener
    router.back();
  }

  function handleCancel() {
    resetMealDraft();
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Meal</Text>

        <Text style={styles.label}>Meal name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chicken & Rice, Oatmeal, Salad"
          placeholderTextColor="#888888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Meal instructions (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any instructions, steps, or notes..."
          placeholderTextColor="#888888"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <Text style={[styles.label, { marginTop: 18 }]}>Ingredients</Text>

        {ingredients.map((row, index) => (
          <View key={row.id} style={styles.ingredientRow}>
            <Text style={styles.inlineLabel}>ingredient:</Text>
            <TextInput
              style={styles.ingredientInput}
              placeholder="name"
              placeholderTextColor="#888888"
              value={row.name}
              onChangeText={(text) => updateIngredientRow(row.id, "name", text)}
            />

            <Text style={[styles.inlineLabel, { marginLeft: 10 }]}>amt:</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#888888"
              keyboardType="numeric"
              value={row.amount}
              onChangeText={(text) => updateIngredientRow(row.id, "amount", text)}
            />

            {/* allow remove, but keep at least 1 row in hook */}
            <TouchableOpacity
              style={styles.removeCircle}
              onPress={() => removeIngredientRow(row.id)}
              disabled={ingredients.length <= 1}
            >
              <Text style={styles.removeText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addIngredientButton}
          onPress={addIngredientRow}
          disabled={saving}
        >
          <Text style={styles.addIngredientText}>+ Ingredients</Text>
        </TouchableOpacity>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: BG_GREY,
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  card: {
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
    height: 90,
    textAlignVertical: "top",
  },

  ingredientRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  flexWrap: "nowrap",
  width: "100%",
  },

  inlineLabel: {
    color: "#cccccc",
    fontSize: 13,
    marginRight: 6,
  },
  ingredientInput: {
  flex: 1,
  minWidth: 0,            // IMPORTANT: allows flex input to shrink
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#444444",
  paddingHorizontal: 10,
  paddingVertical: 8,
  color: "#ffffff",
  backgroundColor: BG_GREY,
  },
  amountInput: {
  width: 56,              // was 70
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#444444",
  paddingHorizontal: 8,
  paddingVertical: 8,
  color: "#ffffff",
  backgroundColor: BG_GREY,
  textAlign: "center",
  marginLeft: 6,
  },
  
  removeCircle: {
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 1,
  borderColor: RED,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 6,          // was 10
  },

  removeText: {
    color: RED,
    fontSize: 16,
    fontWeight: "700",
    marginTop: -1,
  },

  addIngredientButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BLUE,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  addIngredientText: {
    color: BLUE,
    fontWeight: "600",
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
