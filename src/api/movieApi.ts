import { request } from "@/api/client";
import type { Movie, NewMovie } from "@/types/movie";

// Number of movies loaded per page, so the list stays fast with many movies.
export const PAGE_SIZE = 20;

// Optional filters for the movie list. Empty values are not sent to the backend.
export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: string;
  minRating?: number;
}

// Loads one page of movies that match the filters, sorted by title.
// Returns fewer than PAGE_SIZE movies on the last page.
// Throws ApiError if the request fails.
export function getMovies(page: number, filters: MovieFilters = {}): Promise<Movie[]> {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(PAGE_SIZE),
    _sort: "title",
  });
  if (filters.search) {
    params.append("title_like", filters.search);
  }
  if (filters.genre) {
    params.append("majorGenre", filters.genre);
  }
  // releaseDate is text like "Sep 03 2009", so the year is matched as part of it.
  if (filters.year) {
    params.append("releaseDate_like", filters.year);
  }
  if (filters.minRating !== undefined) {
    params.append("imdbRating_gte", String(filters.minRating));
  }
  return request<Movie[]>(`/movies?${params.toString()}`);
}

// Loads a single movie. Throws ApiError if it does not exist or the request fails.
export function getMovie(id: number): Promise<Movie> {
  return request<Movie>(`/movies/${id}`);
}

// Creates a movie and returns it with the id assigned by the backend.
export function createMovie(movie: NewMovie): Promise<Movie> {
  return request<Movie>("/movies", { method: "POST", body: movie });
}

// Replaces a movie completely (PUT), so the caller must pass all fields, not only the changed ones.
export function updateMovie(movie: Movie): Promise<Movie> {
  return request<Movie>(`/movies/${movie.id}`, { method: "PUT", body: movie });
}

// Deletes a movie. Throws ApiError if the request fails.
export async function deleteMovie(id: number): Promise<void> {
  await request<unknown>(`/movies/${id}`, { method: "DELETE" });
}
