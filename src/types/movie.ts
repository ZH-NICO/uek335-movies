
export interface Movie {
  id: number;
  title: string;

  releaseDate: string;
  majorGenre?: string | null;
  director?: string | null;
  distributor?: string | null;
  mpaaRating?: string | null;
  runningTimeMin?: number | null;
  imdbRating?: number | null;
  imdbVotes?: number | null;
  rottenTomatoesRating?: number | null;
  usGross?: number | null;
  worldwideGross?: number | null;
  productionBudget?: number | null;
  posterUrl?: string | null;
}

export type NewMovie = Omit<Movie, "id">;
