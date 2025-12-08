// src/context/MainModeContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export type MainMode = "workout" | "diet";

type MainModeContextValue = {
  mode: MainMode;
  isWorkout: boolean;
  isDiet: boolean;
  setMode: (mode: MainMode) => void;
};

const MainModeContext = createContext<MainModeContextValue | undefined>(
  undefined
);

export function MainModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MainMode>("workout");

  const value: MainModeContextValue = {
    mode,
    isWorkout: mode === "workout",
    isDiet: mode === "diet",
    setMode,
  };

  return (
    <MainModeContext.Provider value={value}>
      {children}
    </MainModeContext.Provider>
  );
}

export function useMainModeContext() {
  const ctx = useContext(MainModeContext);
  if (!ctx) {
    throw new Error(
      "useMainModeContext must be used inside a MainModeProvider"
    );
  }
  return ctx;
}
