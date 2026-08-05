import { api } from '../api-client';
import type { MovieDetails, TmdbMovieSummary, TmdbPaginated } from '../../types';

export const getPopular = (page = 1) =>
  api.get<TmdbPaginated<TmdbMovieSummary>>('/movies/popular', { params: { page } }).then((r) => r.data);

export const getNowPlaying = (page = 1) =>
  api.get<TmdbPaginated<TmdbMovieSummary>>('/movies/now-playing', { params: { page } }).then((r) => r.data);

export const getTopRated = (page = 1) =>
  api.get<TmdbPaginated<TmdbMovieSummary>>('/movies/top-rated', { params: { page } }).then((r) => r.data);

export const getUpcoming = (page = 1) =>
  api.get<TmdbPaginated<TmdbMovieSummary>>('/movies/upcoming', { params: { page } }).then((r) => r.data);

export const searchMovies = (query: string, page = 1) =>
  api.get<TmdbPaginated<TmdbMovieSummary>>('/movies/search', { params: { query, page } }).then((r) => r.data);

export const getMovieDetails = (tmdbId: number) =>
  api.get<MovieDetails>(`/movies/${tmdbId}`).then((r) => r.data);
