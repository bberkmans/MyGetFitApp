import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MainShell } from "../../src/components/MainShell";
import { useMainModeContext } from "../../src/context/MainModeContext";
import { useSteps } from "../../src/hooks/useSteps";

const BG = "#121212";
const LIGHT = "#1e1e1e";
const BORDER = "#3a3a3a";
const BLUE = "#007AFF";

export default function MetricsScreen() {
  // ✅ Always call hooks (no conditional hooks)
  const { isWorkout } = useMainModeContext();
  const {
    DAY_KEYS,
    selectedDay,
    setSelectedDay,
    goal,
    updateGoal,
    stepsForSelectedDay,
    progress,
  } = useSteps();

  const [goalModal, setGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  // Optional: avoid extra renders
  const stepsLabel = useMemo(
    () => `${stepsForSelectedDay}/${goal} Steps`,
    [stepsForSelectedDay, goal]
  );

  // Diet side UI
  if (!isWorkout) {
    return (
      <MainShell>
        <View style={styles.wrap}>
          <Text style={styles.title}>Calories (later)</Text>
        </View>
      </MainShell>
    );
  }

  return (
    <MainShell>
      <View style={styles.wrap}>
        <Text style={styles.title}>My Steps</Text>

        {/* Day circles */}
        <View style={styles.dayRow}>
          {DAY_KEYS.map((k) => {
            const active = selectedDay === k;
            return (
              <TouchableOpacity
                key={k}
                style={[styles.dayCircle, active && styles.dayCircleActive]}
                onPress={() => setSelectedDay(k)}
              >
                <Text style={[styles.dayText, active && styles.dayTextActive]}>
                  {k}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Progress */}
        <Text style={styles.sectionLabel}>Progress</Text>
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.countText}>{stepsLabel}</Text>

        {/* Edit Goal */}
        <TouchableOpacity
          style={styles.editGoalButton}
          onPress={() => {
            setGoalInput(String(goal));
            setGoalModal(true);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.editGoalText}>Edit Goal</Text>
        </TouchableOpacity>

        {/* Goal modal */}
        <Modal transparent visible={goalModal} animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Set step goal</Text>

              <TextInput
                style={styles.modalInput}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor="#888"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setGoalModal(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const n = Number(goalInput);
                    if (!Number.isFinite(n) || n <= 0) return;
                    updateGoal(n);
                    setGoalModal(false);
                  }}
                >
                  <Text style={styles.modalSave}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </MainShell>
  );
}


const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 16 },

  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",          // ✅ allows mon..sun to wrap to next line
    gap: 10,
    rowGap: 10,                // ✅ extra spacing between wrapped rows
    marginBottom: 36,          // ✅ more space before “Progress”
  },

  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: { borderColor: BLUE },
  dayText: { color: "#cfcfcf", fontSize: 12, fontWeight: "600" },
  dayTextActive: { color: BLUE },

  sectionLabel: { color: "#cfcfcf", fontSize: 14, marginTop: 20,marginBottom: 20 },

  progressOuter: {
    width: "100%",
    height: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    overflow: "hidden",
  },
  progressInner: {
    height: "100%",
    backgroundColor: BLUE,
  },

  countText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 60,
  },

  editGoalButton: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  editGoalText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG,
    padding: 16,
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalCancel: { color: "#cfcfcf", fontSize: 16 },
  modalSave: { color: BLUE, fontSize: 16, fontWeight: "700" },
});
