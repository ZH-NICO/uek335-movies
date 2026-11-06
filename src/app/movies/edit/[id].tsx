import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import { updateMovie } from "@/api/movieApi";
import { BackHeader } from "@/components/BackHeader";
import { MovieForm, type MovieFormValues } from "@/components/MovieForm";
import { StatusView } from "@/components/StatusView";
import { useSnackbar } from "@/context/SnackbarContext";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { Movie } from "@/types/movie";

/** Screen for changing a movie, opened from its details. */
export default function EditMovie() {
  const router = useRouter();
  const theme = useTheme();
  const { showMessage } = useSnackbar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, error, retry } = useFocusRequest<Movie>(`/movies/${id}`);

  if (movie) {
    /** PUT replaces the whole movie, so fields that are not in the form (e.g. the poster) are sent along. */
    const handleSubmit = async (values: MovieFormValues) => {
      await updateMovie({ ...movie, ...values });
      showMessage("Changes saved.");
      router.back();
    };

    return (
      <MovieForm
        title="Edit movie"
        backLabel="Details"
        submitLabel="Save changes"
        movie={movie}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <BackHeader label="Details" />
      {error ? <StatusView status="error" message={error} onRetry={retry} /> : <StatusView status="loading" />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
