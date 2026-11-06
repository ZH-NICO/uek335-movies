import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { api, ApiError } from "@/api/client";

/**
 * Loads data with a GET request each time the screen is opened.
 * Tabs stay mounted, so loading only once would show outdated data after a change on another tab.
 * Already loaded data stays visible while reloading and if reloading fails.
 *
 * @param path - Path of the backend, e.g. "/users/1".
 * @returns The loaded data (null until loaded), the error message of the last attempt and retry() to load again.
 */
export function useFocusRequest<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await api.get<T>(path);
      setData(response.data);
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Something went wrong. Please try again.");
    }
  }, [path]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { data, error, retry: load };
}
