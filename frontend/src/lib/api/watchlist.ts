import { api } from "../api-client";
import type { WatchlistItem } from "../../types";

export const addToWatchlist = (tmdbId: number) =>
  api.post<WatchlistItem>(`/watchlist/${tmdbId}`).then((r) => r.data);

export const removeFromWatchlist = (tmdbId: number) =>
  api.delete(`/watchlist/${tmdbId}`).then((r) => r.data);

export const listMyWatchlist = () =>
  api.get<WatchlistItem[]>("/watchlist/me").then((r) => r.data);

export const listWatchlistByUsername = (username: string) =>
  api.get<WatchlistItem[]>(`/watchlist/${username}`).then((r) => r.data);
