"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Hide Splash Screen once the app is loaded
      SplashScreen.hide().catch(console.error);

      // Configure Status Bar
      StatusBar.setStyle({ style: Style.Dark }).catch(console.error);
      StatusBar.setBackgroundColor({ color: "#000000" }).catch(console.error);

      // Configure Keyboard
      Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(console.error);
      Keyboard.setScroll({ isDisabled: false }).catch(console.error);
    }
  }, []);

  return <>{children}</>;
}
