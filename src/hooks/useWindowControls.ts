import { useState, useEffect, useCallback } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useWindowControls() {
  const appWindow = getCurrentWindow();
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    appWindow.setShadow(true);
  }, []);

  const togglePin = useCallback(async () => {
    const next = !isPinned;
    await appWindow.setAlwaysOnTop(next);
    setIsPinned(next);
  }, [isPinned]);

  const minimize = useCallback(() => appWindow.minimize(), []);
  const close = useCallback(() => appWindow.close(), []);

  return { isPinned, togglePin, minimize, close, appWindow };
}
