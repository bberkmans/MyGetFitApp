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
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.6;

type MainShellProps = {
  children: ReactNode;
  showHeader?: boolean;   // ✅ NEW
  showProfile?: boolean;  // ✅ NEW (optional)
};

export function MainShell({
  children,
  showHeader = true,
  showProfile = true,
}: MainShellProps) {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    }).start(() => setSidebarOpen(false));
  }

  const sidebarTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SIDEBAR_WIDTH, 0],
  });

  async function handleLogout() {
    try {
      await signOut();
    } catch (e) {
      console.log("Error logging out:", e);
    }
  }

  return (
    <View style={styles.container}>
      {/* ✅ Header optional */}
      {showHeader && (
        <MainHeader onPressProfile={showProfile ? openSidebar : undefined} />
      )}

      <View style={styles.content}>{children}</View>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            activeOpacity={1}
            onPress={closeSidebar}
          />

          <Animated.View
            style={[
              styles.sidebarPanel,
              { transform: [{ translateX: sidebarTranslateX }] },
            ]}
          >
            <Text style={styles.sidebarTitle}>Profile</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
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

  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebarPanel: {
    width: SIDEBAR_WIDTH,
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    borderLeftWidth: 1,
    borderLeftColor: "#27272a",
  },
  sidebarTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
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
