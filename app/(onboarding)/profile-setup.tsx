// app/(onboarding)/profile-setup.tsx
import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useProfileSetup } from "../../src/hooks/useProfileSetup";

const BG_GREY = "#121212";
const BLUE = "#007AFF";
const GREEN = "#22c55e";

export default function ProfileSetupScreen() {
  const {
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
  } = useProfileSetup();

  const isNameStep = step === 0;
  const isAgeStep = step === 1;
  const isBodyStep = step === 2;
  const isGoalsStep = step === 3;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        {/* App name */}
        <Text style={styles.appName}>GetFit</Text>

        {/* Step description */}
        <Text style={styles.subtitle}>
          {isNameStep && "Let’s start with your name"}
          {isAgeStep && "How old are you?"}
          {isBodyStep && "Tell us your height and weight"}
          {isGoalsStep && "Choose your goals"}
        </Text>

        {/* Animated step content */}
        <Animated.View style={[styles.card, { opacity }]}>
          {isNameStep && (
            <>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#AAAAAA"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#AAAAAA"
                value={lastName}
                onChangeText={setLastName}
              />
            </>
          )}

          {isAgeStep && (
            <>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </>
          )}

          {isBodyStep && (
  <>
    <Text style={styles.label}>Height</Text>

    <View style={styles.heightRow}>
      {heightUnit === "imperial" ? (
        <>
          <View style={styles.heightPickerGroup}>
            <Text style={styles.smallLabel}>Feet</Text>
            <Picker
              selectedValue={heightFeet}
              onValueChange={(val) => setHeightFeet(String(val))}
              style={styles.picker}
            >
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
            </Picker>
          </View>

          <Text style={styles.heightSeparator}>'</Text>

          <View style={styles.heightPickerGroup}>
            <Text style={styles.smallLabel}>Inches</Text>
            <Picker
              selectedValue={heightInches}
              onValueChange={(val) => setHeightInches(String(val))}
              style={styles.picker}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <Picker.Item
                  key={i + 1}
                  label={`${i + 1}`}
                  value={`${i + 1}`}
                />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Height in cm"
          placeholderTextColor="#AAAAAA"
          value={heightCm}
          onChangeText={setHeightCm}
          keyboardType="numeric"
        />
      )}

      <View style={styles.unitToggle}>
        <Text style={styles.unitLabel}>ft/in</Text>
        <Switch
          value={heightUnit === "metric"}
          onValueChange={(val) =>
            setHeightUnit(val ? "metric" : "imperial")
          }
        />
        <Text style={styles.unitLabel}>cm</Text>
      </View>
    </View>

    <Text style={[styles.label, { marginTop: 24 }]}>Weight</Text>
    <TextInput
      style={styles.input}
      placeholder="Weight (e.g. 165)"
      placeholderTextColor="#AAAAAA"
      value={weight}
      onChangeText={setWeight}
      keyboardType="numeric"
    />
  </>
)}


          {isGoalsStep && (
            <View>
              {/* Weight goals */}
              <Text style={styles.sectionTitle}>Weight goals</Text>
              <View style={styles.bubbleRow}>
                {renderWeightBubble(
                  "Extreme weight loss",
                  "extreme_loss",
                  weightGoal,
                  setWeightGoal
                )}
                {renderWeightBubble(
                  "Light weight loss",
                  "light_loss",
                  weightGoal,
                  setWeightGoal
                )}
              </View>
              <View style={styles.bubbleRow}>
                {renderWeightBubble(
                  "Maintain weight",
                  "maintain",
                  weightGoal,
                  setWeightGoal
                )}
              </View>
              <View style={styles.bubbleRow}>
                {renderWeightBubble(
                  "Moderate bulk",
                  "moderate_bulk",
                  weightGoal,
                  setWeightGoal
                )}
                {renderWeightBubble(
                  "Heavy bulk",
                  "heavy_bulk",
                  weightGoal,
                  setWeightGoal
                )}
              </View>

              {/* Strength goals */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Strength gains
              </Text>
              <View style={styles.bubbleRow}>
                {renderStrengthBubble(
                  "Maintain",
                  "maintain",
                  strengthGoal,
                  setStrengthGoal
                )}
                {renderStrengthBubble(
                  "Get stronger",
                  "get_stronger",
                  strengthGoal,
                  setStrengthGoal
                )}
              </View>
            </View>
          )}
        </Animated.View>

        {/* Bottom buttons */}
        <View style={styles.bottomRow}>
          {step > 0 ? (
            <TouchableOpacity onPress={goBack} disabled={submitting}>
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity onPress={goToNextStep} disabled={submitting}>
            <Text style={styles.nextText}>
              {isGoalsStep ? (submitting ? "Saving..." : "Finish") : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Helper render functions for bubbles
function renderWeightBubble(
  label: string,
  key: any,
  selected: any,
  onSelect: (k: any) => void
) {
  const isSelected = selected === key;
  return (
    <TouchableOpacity
      key={key}
      style={[styles.bubble, isSelected && styles.bubbleSelected]}
      onPress={() => onSelect(key)}
    >
      <Text style={[styles.bubbleText, isSelected && styles.bubbleTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function renderStrengthBubble(
  label: string,
  key: any,
  selected: any,
  onSelect: (k: any) => void
) {
  const isSelected = selected === key;
  return (
    <TouchableOpacity
      key={key}
      style={[styles.bubble, isSelected && styles.bubbleSelected]}
      onPress={() => onSelect(key)}
    >
      <Text style={[styles.bubbleText, isSelected && styles.bubbleTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: BLUE,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,
  },
  bubbleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#666666",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  bubbleText: {
    color: "#ffffff",
    fontSize: 14,
  },
  bubbleTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    alignItems: "center",
  },
  secondaryText: {
    color: "#cccccc",
    fontSize: 16,
  },
  nextText: {
    color: BLUE,
    fontSize: 18,
    fontWeight: "600",
  },
    heightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  heightPickerGroup: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    paddingHorizontal: 4,
    marginRight: 4,
  },
  picker: {
    color: "#ffffff",
  },
  smallLabel: {
    color: "#cccccc",
    fontSize: 12,
    marginBottom: 4,
  },
  heightSeparator: {
    color: "#ffffff",
    fontSize: 20,
    marginHorizontal: 4,
  },
  unitToggle: {
    marginLeft: 8,
    alignItems: "center",
  },
  unitLabel: {
    color: "#ffffff",
    fontSize: 12,
  },

});
