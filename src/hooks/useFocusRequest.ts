import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ApiError, request } from "@/api/client";

// Loads data each time the screen is opened.
// Tabs stay mounted, so loading only once would show outdated data after a change on another tab.
// Already loaded data stays visible while reloading and if reloading fails.
export function useFocusRequest<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await request<T>(path));
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Something went wrong. Please try again.");
    }
  }, [path]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { data, error, isLoading: data === null && error === null, retry: load };
}
