/**
 * Movie as stored in the backend.
 * Only id, title and releaseDate are always set, many other values are missing or null.
 */
export interface Movie {
  id: number;
  title: string;
  /** Text like "Sep 03 2009". */
  releaseDate: string;
  majorGenre?: string | null;
  director?: string | null;
  distributor?: string | null;
  mpaaRating?: string | null;
  runningTimeMin?: number | null;
  /** 0 to 10. */
  imdbRating?: number | null;
  imdbVotes?: number | null;
  /** 0 to 100. */
  rottenTomatoesRating?: number | null;
  usGross?: number | null;
  worldwideGross?: number | null;
  productionBudget?: number | null;
  posterUrl?: string | null;
}

/** A movie before it is saved. The backend assigns the id. */
export type NewMovie = Omit<Movie, "id">;
