import { useRouter } from "expo-router";

import { createMovie } from "@/api/movieApi";
import { MovieForm, type MovieFormValues } from "@/components/MovieForm";
import { useSnackbar } from "@/context/SnackbarContext";

/** Screen for creating a movie, opened from the list. */
export default function NewMovie() {
  const router = useRouter();
  const { showMessage } = useSnackbar();

  /**
   * @param values - Validated entries of the form.
   * @throws ApiError if saving fails. The form shows the message.
   */
  async function handleSubmit(values: MovieFormValues) {
    await createMovie(values);
    showMessage(`«${values.title}» saved.`);
    router.back();
  }

  return <MovieForm title="New movie" backLabel="Movies" submitLabel="Save movie" onSubmit={handleSubmit} />;
}
