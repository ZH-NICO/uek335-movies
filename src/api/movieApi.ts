import { api } from "@/api/client";
import type { Movie, NewMovie } from "@/types/movie";

/** Number of movies loaded per page, so the list stays fast with many movies. */
export const PAGE_SIZE = 20;

/** Optional filters for the movie list. */
export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: string;
  minRating?: number;
}

/**
 * Loads one page of movies that match the filters, sorted by title.
 * axios leaves out params that are undefined, so empty filters are not sent.
 *
 * @param page - Page number, starting at 1.
 * @param filters - Search text and filters, all optional.
 * @returns The movies of the page, fewer than PAGE_SIZE on the last page.
 * @throws ApiError if the request fails.
 */
export async function getMovies(page: number, filters: MovieFilters = {}): Promise<Movie[]> {
  const { data } = await api.get<Movie[]>("/movies", {
    params: {
      _page: page,
      _limit: PAGE_SIZE,
      _sort: "title",
      title_like: filters.search || undefined,
      majorGenre: filters.genre,
      /** releaseDate is text like "Sep 03 2009", so the year is matched as part of it. */
      releaseDate_like: filters.year,
      imdbRating_gte: filters.minRating,
    },
  });
  return data;
}

/**
 * Loads a single movie.
 *
 * @param id - ID of the movie.
 * @returns The movie.
 * @throws ApiError if it does not exist (status 404) or the request fails.
 */
export async function getMovie(id: number): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movies/${id}`);
  return data;
}

/**
 * Creates a movie.
 *
 * @param movie - All fields except the id, which the backend assigns.
 * @returns The new movie with its id.
 * @throws ApiError if the request fails.
 */
export async function createMovie(movie: NewMovie): Promise<Movie> {
  const { data } = await api.post<Movie>("/movies", movie);
  return data;
}

/**
 * Replaces a movie completely (PUT), so all fields must be passed, not only the changed ones.
 *
 * @param movie - The complete movie including its id.
 * @returns The saved movie.
 * @throws ApiError if the request fails.
 */
export async function updateMovie(movie: Movie): Promise<Movie> {
  const { data } = await api.put<Movie>(`/movies/${movie.id}`, movie);
  return data;
}

/**
 * Deletes a movie.
 *
 * @param id - ID of the movie.
 * @throws ApiError if the request fails.
 */
export async function deleteMovie(id: number): Promise<void> {
  await api.delete(`/movies/${id}`);
}
