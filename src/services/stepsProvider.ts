// src/services/stepsProvider.ts
import { Pedometer } from "expo-sensors";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns steps from midnight -> now (for that local day).
 * If permission is denied or not available, returns 0.
 */
export async function getStepsForDay(date: Date): Promise<number> {
  try {
    // Check hardware support
    const available = await Pedometer.isAvailableAsync();
    if (!available) return 0;

    // Ask permission (iOS will show motion prompt; Android uses ACTIVITY_RECOGNITION)
    // Some Expo versions expose permission helpers; simplest is to try the query
    // but we'll still do best-effort permission request when available.
    // @ts-ignore - types vary slightly by Expo SDK
    if (Pedometer.requestPermissionsAsync) {
      // @ts-ignore
      const perm = await Pedometer.requestPermissionsAsync();
      if (perm?.status && perm.status !== "granted") return 0;
    }

    const start = startOfDay(date);
    const end = new Date(); // "now"

    const result = await Pedometer.getStepCountAsync(start, end);
    return typeof result?.steps === "number" ? result.steps : 0;
  } catch (e) {
    console.log("getStepsForDay error:", e);
    return 0;
  }
}

