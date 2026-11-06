import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Menu, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiError } from "@/api/client";
import { BackHeader } from "@/components/BackHeader";
import { ErrorBox } from "@/components/ErrorBox";
import { FormField } from "@/components/FormField";
import { ScreenTitle } from "@/components/ScreenTitle";
import { GENRES } from "@/constants/genres";
import type { Movie } from "@/types/movie";
import {
  parseNumber,
  validateNumberInRange,
  validateReleaseDate,
  validateRunningTime,
  validateTitle,
} from "@/utils/movieValidation";

/** The fields that can be changed in the form. */
export type MovieFormValues = Pick<
  Movie,
  "title" | "releaseDate" | "director" | "majorGenre" | "runningTimeMin" | "imdbRating" | "rottenTomatoesRating"
>;

interface MovieFormProps {
  title: string;
  backLabel: string;
  submitLabel: string;
  /** Movie to edit. Without it the form starts empty. */
  movie?: Movie;
  onSubmit: (values: MovieFormValues) => Promise<void>;
}

/**
 * Empty optional fields are stored as null, like missing values in the backend.
 *
 * @param value - Text of the field.
 * @returns The trimmed text, or null if the field is empty.
 */
function textOrNull(value: string): string | null {
  return value.trim() || null;
}

/**
 * @param value - Text of a validated number field.
 * @returns The number, or null if the field is empty.
 */
function numberOrNull(value: string): number | null {
  return value.trim() ? parseNumber(value) : null;
}

/**
 * Form for a new or an existing movie. Validates all fields before onSubmit is called.
 * If saving fails, the entries stay in the form and an error box explains what happened.
 */
export function MovieForm({ title, backLabel, submitLabel, movie, onSubmit }: MovieFormProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [movieTitle, setMovieTitle] = useState(movie?.title ?? "");
  const [director, setDirector] = useState(movie?.director ?? "");
  const [genre, setGenre] = useState(movie?.majorGenre ?? "");
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate ?? "");
  const [runningTime, setRunningTime] = useState(movie?.runningTimeMin?.toString() ?? "");
  const [imdbRating, setImdbRating] = useState(movie?.imdbRating?.toString() ?? "");
  const [rottenTomatoes, setRottenTomatoes] = useState(movie?.rottenTomatoesRating?.toString() ?? "");
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  /** Errors only appear after the first submit, so an empty form is not shown as wrong. */
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const titleError = validateTitle(movieTitle);
  const releaseDateError = validateReleaseDate(releaseDate);
  const runningTimeError = validateRunningTime(runningTime);
  const imdbError = validateNumberInRange(imdbRating, 0, 10);
  const rottenTomatoesError = validateNumberInRange(rottenTomatoes, 0, 100);

  /**
   * @param newGenre - Selected genre, empty for no genre.
   */
  function selectGenre(newGenre: string) {
    setGenre(newGenre);
    setIsGenreMenuOpen(false);
  }

  /** Shows the errors if an entry is invalid, otherwise saves the movie. */
  async function handleSubmit() {
    setIsSubmitted(true);
    setFailure(null);
    if (titleError || releaseDateError || runningTimeError || imdbError || rottenTomatoesError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: movieTitle.trim(),
        releaseDate: releaseDate.trim(),
        director: textOrNull(director),
        majorGenre: textOrNull(genre),
        runningTimeMin: numberOrNull(runningTime),
        imdbRating: numberOrNull(imdbRating),
        rottenTomatoesRating: numberOrNull(rottenTomatoes),
      });
    } catch (error) {
      setFailure(error instanceof ApiError ? error.message : "The movie could not be saved. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <BackHeader label={backLabel} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle title={title} subtitle="Fields marked * are required." />
        {failure && <ErrorBox title="Not saved" message={failure} />}
        <FormField
          label="Title *"
          placeholder="e.g. Inception"
          value={movieTitle}
          onChangeText={setMovieTitle}
          error={isSubmitted ? titleError : undefined}
        />
        <View style={styles.row}>
          <View style={styles.column}>
            <FormField label="Director" placeholder="e.g. C. Nolan" value={director} onChangeText={setDirector} />
          </View>
          <View style={styles.column}>
            <Menu
              visible={isGenreMenuOpen}
              onDismiss={() => setIsGenreMenuOpen(false)}
              anchor={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Genre: ${genre || "not selected"}`}
                  onPress={() => setIsGenreMenuOpen(true)}
                >
                  <View pointerEvents="none">
                    <FormField label="Genre" placeholder="e.g. Sci-Fi" value={genre} editable={false} />
                  </View>
                </Pressable>
              }
            >
              <Menu.Item title="No genre" onPress={() => selectGenre("")} />
              {GENRES.map((option) => (
                <Menu.Item key={option} title={option} onPress={() => selectGenre(option)} />
              ))}
            </Menu>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <FormField
              label="Release date *"
              placeholder="e.g. Jul 16 2010"
              value={releaseDate}
              onChangeText={setReleaseDate}
              error={isSubmitted ? releaseDateError : undefined}
            />
          </View>
          <View style={styles.column}>
            <FormField
              label="Running time (min)"
              placeholder="e.g. 148"
              value={runningTime}
              onChangeText={setRunningTime}
              error={isSubmitted ? runningTimeError : undefined}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <FormField
          label="IMDb rating (0–10)"
          placeholder="e.g. 8.8"
          value={imdbRating}
          onChangeText={setImdbRating}
          error={isSubmitted ? imdbError : undefined}
          keyboardType="decimal-pad"
        />
        <FormField
          label="Rotten Tomatoes (0–100)"
          placeholder="e.g. 87"
          value={rottenTomatoes}
          onChangeText={setRottenTomatoes}
          error={isSubmitted ? rottenTomatoesError : undefined}
          keyboardType="number-pad"
        />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  /** Stays below the scrolling fields, so the main action is always in the thumb zone. */
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
