// src/components/MainShell.tsx
import React, { ReactNode, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../AuthContext";
import { MainHeader } from "./MainHeader";

const BG_GREY = "#121212";
const RED = "#ef4444";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.6; // ~60% of screen width

type MainShellProps = {
  children: ReactNode;
};

export function MainShell({ children }: MainShellProps) {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  function openSidebar() {
    setSidebarOpen(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function closeSidebar() {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSidebarOpen(false);
    });
  }

  // Sidebar slide from right
  const sidebarTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SIDEBAR_WIDTH, 0], // start off-screen to the right
  });

  async function handleLogout() {
    try {
      await signOut();
      // (tabs)/_layout.tsx will see user === null and Redirect to /login
    } catch (e) {
      console.log("Error logging out:", e);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header with workout/diet toggle + profile circle */}
      <MainHeader onPressProfile={openSidebar} />

      {/* Screen content */}
      <View style={styles.content}>{children}</View>

      {/* Sidebar overlay + panel */}
      {sidebarOpen && (
        <>
          {/* FULL-SCREEN dim background */}
          <TouchableOpacity
            style={styles.sidebarOverlay}
            activeOpacity={1}
            onPress={closeSidebar}
          />

          {/* Sliding sidebar panel */}
          <Animated.View
            style={[
              styles.sidebarPanel,
              { transform: [{ translateX: sidebarTranslateX }] },
            ]}
          >
            <Text style={styles.sidebarTitle}>Profile</Text>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Full-screen dim overlay
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // whole screen is dimmed
  },

  // Sidebar panel sitting on the right
  sidebarPanel: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: SIDEBAR_WIDTH,
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
    paddingTop: 120, // moves "Profile" + "Log out" lower on the screen
    paddingBottom: 24,
    borderLeftWidth: 1,
    borderLeftColor: "#27272a",
  },
  sidebarTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 32,
  },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 10,
  },
  logoutText: {
    color: RED,
    fontSize: 16,
    fontWeight: "600",
  },
});
