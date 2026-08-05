export interface TmdbMovieSummary {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbVideo {
  id: string;
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface TmdbMovieDetails extends TmdbMovieSummary {
  runtime: number | null;
  genres: TmdbGenre[];
  tagline: string | null;
  credits?: { cast: TmdbCastMember[] };
  videos?: { results: TmdbVideo[] };
  similar?: TmdbPaginatedResponse<TmdbMovieSummary>;
}
