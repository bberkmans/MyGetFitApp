import { useFocusEffect } from "expo-router";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/config";
import { getStepsForDay } from "../services/stepsProvider";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day);
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekId(monday: Date) {
  // Simple stable ID: YYYY-MM-DD of Monday
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // e.g. "2025-12-15"
}

function dayKeyForDate(d: Date): DayKey {
  const day = d.getDay();
  // JS: 0 Sun,1 Mon... -> map
  return (["sun", "mon", "tue", "wed", "thu", "fri", "sat"][day] as DayKey);
}

export function useSteps() {
  const { user } = useAuth();

  const today = useMemo(() => new Date(), []);
  const monday = useMemo(() => getMonday(new Date()), []);
  const weekId = useMemo(() => getWeekId(monday), [monday]);

  const [goal, setGoal] = useState<number>(10000);
  const [selectedDay, setSelectedDay] = useState<DayKey>(dayKeyForDate(new Date()));
  const [days, setDays] = useState<Record<DayKey, number>>({
    mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0,
  });

  const weekDocRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid, "stepWeeks", weekId);
  }, [user, weekId]);

  const settingsRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid, "stepSettings", "settings");
  }, [user]);

  const loadOrInit = useCallback(async () => {
    if (!user || !weekDocRef || !settingsRef) return;

    // Load goal
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      const g = settingsSnap.data()?.goal;
      if (typeof g === "number") setGoal(g);
    } else {
      await setDoc(settingsRef, { goal: 10000 }, { merge: true });
      setGoal(10000);
    }

    // Load or create week doc
    const weekSnap = await getDoc(weekDocRef);
    if (!weekSnap.exists()) {
      const blankDays = { mon:0, tue:0, wed:0, thu:0, fri:0, sat:0, sun:0 };
      await setDoc(weekDocRef, {
        weekStart: monday,
        goal: settingsSnap.data()?.goal ?? 10000,
        days: blankDays,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      setDays(blankDays);
    } else {
      const data: any = weekSnap.data();
      const d = data?.days || {};
      setDays({
        mon: Number(d.mon) || 0,
        tue: Number(d.tue) || 0,
        wed: Number(d.wed) || 0,
        thu: Number(d.thu) || 0,
        fri: Number(d.fri) || 0,
        sat: Number(d.sat) || 0,
        sun: Number(d.sun) || 0,
      });
      if (typeof data?.goal === "number") setGoal(data.goal);
    }
  }, [user, weekDocRef, settingsRef, monday]);

  const syncToday = useCallback(async () => {
    if (!user || !weekDocRef) return;

    const key = dayKeyForDate(new Date());
    const steps = await getStepsForDay(new Date());

    // Update Firestore + local state
    setDays((prev) => ({ ...prev, [key]: steps }));
    await updateDoc(weekDocRef, {
      [`days.${key}`]: steps,
      updatedAt: serverTimestamp(),
    });
  }, [user, weekDocRef]);

  // initial load
  useEffect(() => {
    loadOrInit();
  }, [loadOrInit]);

  // pull-model: sync whenever the screen is focused (incl. after app opens)
  useFocusEffect(
    useCallback(() => {
      setSelectedDay(dayKeyForDate(new Date()));
      loadOrInit();
      syncToday();
    }, [loadOrInit, syncToday])
  );

  async function updateGoal(newGoal: number) {
    if (!user || !settingsRef || !weekDocRef) return;
    const g = Math.max(1, Math.floor(newGoal));

    setGoal(g);
    await setDoc(settingsRef, { goal: g }, { merge: true });
    await updateDoc(weekDocRef, { goal: g, updatedAt: serverTimestamp() });
  }

  const stepsForSelectedDay = days[selectedDay] ?? 0;
  const progress = goal > 0 ? Math.min(1, stepsForSelectedDay / goal) : 0;

  return {
    DAY_KEYS,
    selectedDay,
    setSelectedDay,
    goal,
    updateGoal,
    days,
    stepsForSelectedDay,
    progress,
    syncToday,
  };
}
