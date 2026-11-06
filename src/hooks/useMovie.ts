import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ApiError } from "@/api/client";
import { getMovie } from "@/api/movieApi";
import type { Movie } from "@/types/movie";

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return "This movie does not exist anymore. Go back to the list.";
  }
  return error instanceof ApiError ? error.message : "The movie could not be loaded. Please try again.";
}

// Loads one movie whenever its screen comes into focus, so changes from the edit screen are visible.
// Returns the movie, the loading and error state and a function for "Try again".
export function useMovie(id: number) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;

      getMovie(id)
        .then((result) => {
          if (isCurrent) {
            setMovie(result);
            setError(null);
          }
        })
        .catch((loadError: unknown) => {
          if (isCurrent) {
            setError(errorMessage(loadError));
          }
        })
        .finally(() => {
          if (isCurrent) {
            setIsLoading(false);
          }
        });

      return () => {
        isCurrent = false;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- these values only trigger a new load
    }, [id, reloadCount]),
  );

  function retry() {
    setIsLoading(true);
    setError(null);
    setReloadCount((count) => count + 1);
  }

  return { movie, isLoading, error, retry };
}
