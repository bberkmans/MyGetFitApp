// src/hooks/useProfileSetup.ts
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { Alert, Animated } from "react-native";
import { auth, db } from "../firebase/config";

type WeightGoalKey =
  | "extreme_loss"
  | "light_loss"
  | "maintain"
  | "moderate_bulk"
  | "heavy_bulk";

type StrengthGoalKey = "maintain" | "get_stronger";
type HeightUnit = "imperial" | "metric";

export function useProfileSetup() {
  const router = useRouter();

  // 0 = name, 1 = age, 2 = height/weight, 3 = goals
  const [step, setStep] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");

  const [heightUnit, setHeightUnit] = useState<HeightUnit>("imperial");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("10"); // 1–11
  const [heightCm, setHeightCm] = useState("");

  const [weight, setWeight] = useState("");

  const [weightGoal, setWeightGoal] = useState<WeightGoalKey | null>(null);
  const [strengthGoal, setStrengthGoal] = useState<StrengthGoalKey | null>(
    null
  );

  const [submitting, setSubmitting] = useState(false);

  // For fade animation
  const opacity = useRef(new Animated.Value(1)).current;

  function fadeToStep(nextStep: number) {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  function goToNextStep() {
    if (step === 0) {
      // Validate name
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert("Missing info", "Please enter your first and last name.");
        return;
      }
      fadeToStep(1);
    } else if (step === 1) {
      // Validate age
      if (!age.trim()) {
        Alert.alert("Missing info", "Please enter your age.");
        return;
      }
      if (isNaN(Number(age))) {
        Alert.alert("Invalid age", "Age must be a number.");
        return;
      }
      fadeToStep(2);
    } else if (step === 2) {
      // Validate height & weight

      if (heightUnit === "metric") {
        if (!heightCm.trim()) {
          Alert.alert("Missing info", "Please enter your height in cm.");
          return;
        }
        if (isNaN(Number(heightCm))) {
          Alert.alert("Invalid height", "Height in cm must be a number.");
          return;
        }
      } else {
        // imperial
        if (!heightFeet || !heightInches) {
          Alert.alert(
            "Missing info",
            "Please select both feet and inches for your height."
          );
          return;
        }
      }

      if (!weight.trim()) {
        Alert.alert("Missing info", "Please enter your weight.");
        return;
      }
      if (isNaN(Number(weight))) {
        Alert.alert("Invalid weight", "Weight must be a number.");
        return;
      }
      fadeToStep(3);
    } else if (step === 3) {
      // Validate goals
      if (!weightGoal || !strengthGoal) {
        Alert.alert(
          "Missing info",
          "Please select one weight goal and one strength goal."
        );
        return;
      }

      // Final submit: save to Firestore
      saveProfile();
    }
  }

  async function saveProfile() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Not signed in",
        "Please log in again before saving your profile."
      );
      return;
    }

    // Build a friendly height string + store raw pieces
    const heightDisplay =
      heightUnit === "imperial"
        ? `${heightFeet}'${heightInches}"`
        : `${heightCm} cm`;

    try {
      setSubmitting(true);

      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age.trim(),
        heightDisplay,
        heightUnit,
        heightFeet: heightUnit === "imperial" ? heightFeet : null,
        heightInches: heightUnit === "imperial" ? heightInches : null,
        heightCm: heightUnit === "metric" ? heightCm.trim() : null,
        weight: weight.trim(),
        goals: {
          weightGoal,
          strengthGoal,
        },
        createdAt: new Date().toISOString(),
      });

      // After saving, go into the main app
      router.replace("/loading");
    } catch (err: any) {
      console.log("Error saving profile:", err);
      Alert.alert(
        "Error saving profile",
        err?.message || "Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    if (step > 0) {
      fadeToStep(step - 1);
    }
  }

  return {
    step,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,

    heightUnit,
    setHeightUnit,
    heightFeet,
    setHeightFeet,
    heightInches,
    setHeightInches,
    heightCm,
    setHeightCm,

    weight,
    setWeight,

    weightGoal,
    setWeightGoal,
    strengthGoal,
    setStrengthGoal,
    submitting,
    opacity,
    goToNextStep,
    goBack,
  };
}
