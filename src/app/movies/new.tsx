import { useRouter } from "expo-router";

import { createMovie } from "@/api/movieApi";
import { MovieForm, type MovieFormValues } from "@/components/MovieForm";
import { useSnackbar } from "@/context/SnackbarContext";

export default function NewMovie() {
  const router = useRouter();
  const { showMessage } = useSnackbar();

  async function handleSubmit(values: MovieFormValues) {
    await createMovie(values);
    showMessage("Movie saved.");
    router.back();
  }

  return <MovieForm title="New movie" backLabel="Movies" submitLabel="Save movie" onSubmit={handleSubmit} />;
}
