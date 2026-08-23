export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserProfile extends User {
  stats: {
    ratingsCount: number;
    reviewsCount: number;
    diaryCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowedByViewer: boolean;
  isViewer: boolean;
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  voteAverage: number | null;
  genres: { id: number; name: string }[] | null;
}

export interface TmdbMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends TmdbMovieSummary {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string | null;
  appId: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  similar?: TmdbPaginated<TmdbMovieSummary>;
  stats: {
    averageRating: number | null;
    ratingsCount: number;
    reviewsCount: number;
    watchlistCount: number;
  };
}

export interface Rating {
  id: string;
  score: number;
  userId: string;
  movieId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  content: string;
  rating: number | null;
  containsSpoilers: boolean;
  likesCount: number;
  userId: string;
  movieId: string;
  createdAt: string;
  user: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  movie?: Movie;
  isLikedByViewer: boolean;
}

export interface DiaryEntry {
  id: string;
  watchedAt: string;
  rewatch: boolean;
  rating: number | null;
  userId: string;
  movieId: string;
  reviewId: string | null;
  movie: Movie;
  review: Review | null;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  addedAt: string;
  movie: Movie;
}

export interface FilmList {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  user: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  items: { id: string; note: string | null; position: number; movie: Movie }[];
}

export type ActivityType =
  | "RATING"
  | "REVIEW"
  | "DIARY"
  | "WATCHLIST_ADD"
  | "LIST_CREATED"
  | "FOLLOW";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  movieId: string | null;
  refId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  movie: Movie | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
