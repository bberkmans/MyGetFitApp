// app/(tabs)/_layout.tsx
import { Redirect, Tabs } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/AuthContext";
import {
  useMainModeContext
} from "../../src/context/MainModeContext";

type TabBarProps = React.ComponentProps<typeof Tabs>["tabBar"];

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: Parameters<NonNullable<TabBarProps>>[0]) {
  return (
    <View style={styles.container}>
      <View className="tabs" style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.title !== undefined ? options.title : route.name;

          const isFocused = state.index === index;

          const onPress = (e?: GestureResponderEvent) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function InnerTabs() {
  const { mode } = useMainModeContext();
  const isWorkout = mode === "workout";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#121212" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* TAB 1: Workouts / Meals */}
      <Tabs.Screen
        name="index"
        options={{
          title: isWorkout ? "Workouts" : "Meals",
        }}
      />

      {/* TAB 2: Schedule */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
        }}
      />

      {/* TAB 3: Steps / Calories */}
      <Tabs.Screen
        name="metrics"
        options={{
          title: isWorkout ? "Steps" : "Calories",
        }}
      />

      {/* TAB 4: Progress */}
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  // still figuring out auth state
  if (loading) return null;

  // If NOT logged in, bounce to the login screen
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in → show main tabs
  return (
      <InnerTabs />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e", // light grey
  },
  tabItemActive: {
    backgroundColor: "#007AFF", // blue
  },
  tabLabel: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
