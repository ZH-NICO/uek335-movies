import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, Divider, Text, useTheme } from "react-native-paper";

import { ApiError } from "@/api/client";
import { createMovie, deleteMovie } from "@/api/movieApi";
import { BackHeader } from "@/components/BackHeader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Poster } from "@/components/Poster";
import { ScreenTitle } from "@/components/ScreenTitle";
import { StatusView } from "@/components/StatusView";
import { useSnackbar } from "@/context/SnackbarContext";
import { useMovie } from "@/hooks/useMovie";
import type { Movie } from "@/types/movie";

// Fallback for values that are missing in the backend.
const NO_VALUE = "–";

interface DetailRowProps {
  label: string;
  value: string;
}

// One line in the detail card: label on the left, value on the right.
function DetailRow({ label, value }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

export default function MovieDetails() {
  const router = useRouter();
  const theme = useTheme();
  const { showMessage } = useSnackbar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movie, isLoading, error, retry } = useMovie(Number(id));
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Restores a deleted movie with all its fields and its old id.
  // The list gets a new "refresh" value, because it is already visible and would not reload by itself.
  async function undoDelete(deletedMovie: Movie) {
    try {
      await createMovie(deletedMovie);
      router.navigate({ pathname: "/movies", params: { refresh: String(Date.now()) } });
    } catch (undoError) {
      showMessage(undoError instanceof ApiError ? undoError.message : "The movie could not be restored.");
    }
  }

  async function handleDelete(movieToDelete: Movie) {
    setIsDialogVisible(false);
    setIsDeleting(true);
    try {
      await deleteMovie(movieToDelete.id);
      showMessage(`«${movieToDelete.title}» deleted.`, {
        label: "Undo",
        onPress: () => undoDelete(movieToDelete),
      });
      router.back();
    } catch (deleteError) {
      showMessage(deleteError instanceof ApiError ? deleteError.message : "The movie could not be deleted.");
      setIsDeleting(false);
    }
  }

  function renderContent() {
    if (isLoading) {
      return <StatusView status="loading" />;
    }
    if (!movie) {
      return (
        <StatusView
          status="error"
          message={error ?? "The movie could not be loaded. Please try again."}
          onRetry={retry}
        />
      );
    }

    const rating = movie.imdbRating != null ? `★ ${movie.imdbRating} / 10 IMDb` : "No IMDb rating";
    const rows: DetailRowProps[] = [
      { label: "Director", value: movie.director ?? NO_VALUE },
      { label: "Genre", value: movie.majorGenre ?? NO_VALUE },
      { label: "Release date", value: movie.releaseDate },
      { label: "Running time", value: movie.runningTimeMin != null ? `${movie.runningTimeMin} min` : NO_VALUE },
      {
        label: "Rotten Tomatoes",
        value: movie.rottenTomatoesRating != null ? `${movie.rottenTomatoesRating} %` : NO_VALUE,
      },
    ];

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Poster url={movie.posterUrl} iconSize={48} style={styles.poster} />
        <ScreenTitle title={movie.title} subtitle={rating} />
        <Card mode="outlined">
          {rows.map((row, index) => (
            <View key={row.label}>
              {index > 0 && <Divider />}
              <DetailRow label={row.label} value={row.value} />
            </View>
          ))}
        </Card>
        <Button
          mode="contained"
          onPress={() => router.push({ pathname: "/movies/edit/[id]", params: { id: String(movie.id) } })}
        >
          Edit movie
        </Button>
        <ConfirmDialog
          visible={isDialogVisible}
          icon="trash-can-outline"
          title="Delete movie?"
          message={`«${movie.title}» will be deleted. You can undo this right afterwards.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(movie)}
          onCancel={() => setIsDialogVisible(false)}
        />
      </ScrollView>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <BackHeader label="Movies">
        {movie && (
          <Appbar.Action
            icon="trash-can-outline"
            color={theme.colors.error}
            disabled={isDeleting}
            onPress={() => setIsDialogVisible(true)}
            accessibilityLabel="Delete movie"
          />
        )}
      </BackHeader>
      {renderContent()}
    </View>
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
  poster: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  value: {
    flexShrink: 1,
    fontWeight: "600",
    textAlign: "right",
  },
});
