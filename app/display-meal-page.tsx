// app/display-meal-page.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDisplayMealPage } from "../src/hooks/useDisplayMealPage";

const BG_GREY = "#121212";
const LIGHT_GREY = "#1e1e1e";
const BORDER_GREY = "#3a3a3a";
const BLUE = "#007AFF";

export default function DisplayMealPage() {
  const router = useRouter();
  const { mealId } = useLocalSearchParams<{ mealId: string }>();

  const { meal, loading } = useDisplayMealPage(mealId);

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Meal not found</Text>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Meal name */}
        <Text style={styles.mealName}>{meal.name}</Text>

        {/* Instructions */}
        <Text style={styles.sectionLabel}>Instructions</Text>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsText}>
            {meal.instructions?.trim() ? meal.instructions : "—"}
          </Text>
        </View>

        {/* Ingredients */}
        <View style={styles.ingredientsWrap}>
          {meal.ingredients?.length ? (
            meal.ingredients.map((ing, idx) => (
              <View key={`${ing.id ?? idx}`} style={styles.ingredientRowCard}>
                <Text style={styles.ingredientName} numberOfLines={1}>
                  {ing.name}
                </Text>

                <Text style={styles.amountText}>
                  : {String(ing.amount ?? 0)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No ingredients yet.</Text>
          )}
        </View>

        {/* Start button (we’ll wire later) */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            // TODO later
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Meal</Text>
        </TouchableOpacity>

        {/* Optional back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
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

  mealName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
  },

  sectionLabel: {
    color: "#cccccc",
    fontSize: 13,
    marginBottom: 6,
  },

  instructionsBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    backgroundColor: BG_GREY,
    padding: 12,
    minHeight: 110,
    marginBottom: 14,
  },
  instructionsText: {
    color: "#d4d4d4",
    fontSize: 14,
    lineHeight: 18,
  },

  ingredientsWrap: {
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },

  ingredientRowCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    backgroundColor: BG_GREY,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  ingredientName: {
    flex: 1,
    minWidth: 0,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  amountText: {
    color: "#cccccc",
    fontSize: 14,
    marginLeft: 8,
  },

  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  startButton: {
    alignSelf: "stretch",
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  backBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  backText: {
    color: "#cccccc",
    fontSize: 16,
  },

  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
