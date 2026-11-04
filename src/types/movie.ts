// Movie as returned by the backend. The rating is optional because not every movie has one.
export interface Movie {
  id: number;
  title: string;
  majorGenre?: string;
  imdbRating?: number | null;
}
