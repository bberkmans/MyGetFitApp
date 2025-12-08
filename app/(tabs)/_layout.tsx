// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MainModeProvider,
  useMainModeContext,
} from "../../src/context/MainModeContext";

type TabBarProps = React.ComponentProps<typeof Tabs>["tabBar"];

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: Parameters<NonNullable<TabBarProps>>[0]) {
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
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

// Tabs that react to workout / diet mode for labels
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
          title: isWorkout ? "Steps" : "CalsCalc",
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
  return (
    <MainModeProvider>
      <InnerTabs />
    </MainModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,          // a bit higher on the page
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
    paddingVertical: 14, // taller tabs
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e", // light grey tabs
  },
  tabItemActive: {
    backgroundColor: "#007AFF", // blue active tab
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
