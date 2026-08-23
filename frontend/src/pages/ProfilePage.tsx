import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { getProfile } from "../lib/api/users";
import { listDiaryByUsername } from "../lib/api/diary";
import { listListsByUsername } from "../lib/api/lists";
import { listWatchlistByUsername } from "../lib/api/watchlist";
import { useAuth } from "../hooks/useAuth";
import { Avatar } from "../components/ui/Avatar";
import { FollowButton } from "../components/social/FollowButton";
import { tmdbImage } from "../lib/tmdb-image";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import clsx from "clsx";

type Tab = "diario" | "listas" | "watchlist";

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: viewer } = useAuth();

  const [tab, setTab] = useState<Tab>("diario");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username as string),
    enabled: Boolean(username),
  });

  const { data: diary } = useQuery({
    queryKey: ["diary", username],
    queryFn: () => listDiaryByUsername(username as string, 1),
    enabled: Boolean(username) && tab === "diario",
  });

  const { data: lists } = useQuery({
    queryKey: ["lists", username],
    queryFn: () => listListsByUsername(username as string),
    enabled: Boolean(username) && tab === "listas",
  });

  const { data: watchlist } = useQuery({
    queryKey: ["watchlist", username],
    queryFn: () => listWatchlistByUsername(username as string),
    enabled: Boolean(username) && tab === "watchlist",
  });

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const isViewer = viewer?.username === profile.username;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar name={profile.name} src={profile.avatarUrl} size={84} />

        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold text-paper">
            {profile.name}
          </h1>
          <p className="text-muted">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 max-w-lg text-sm text-paper-dim">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isViewer && viewer && (
            <FollowButton
              username={profile.username}
              initialFollowing={profile.isFollowedByViewer}
            />
          )}

          {isViewer && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="secondary"
            >
              Editar perfil
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {[
          ["Filmes", profile.stats.diaryCount],
          ["Avaliações", profile.stats.ratingsCount],
          ["Resenhas", profile.stats.reviewsCount],
          ["Seguidores", profile.stats.followersCount],
          ["Seguindo", profile.stats.followingCount],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-card border border-border bg-panel py-4 text-center"
          >
            <p className="font-mono text-xl text-paper">{value as number}</p>
            <p className="text-xs text-muted mt-0.5">{label as string}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-1 border-b border-border">
        {(["diario", "listas", "watchlist"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "relative px-4 py-3 text-sm capitalize transition-colors",
              tab === t ? "text-paper" : "text-muted hover:text-paper-dim",
            )}
          >
            {t === "watchlist" ? "Quero assistir" : t}
            {tab === t && (
              <motion.span
                layoutId="profile-tab-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "diario" &&
          (diary && diary.data.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {diary.data.map((entry) => {
                const poster = tmdbImage(entry.movie.posterPath, "w200");
                return (
                  <Link
                    key={entry.id}
                    to={`/filme/${entry.movie.tmdbId}`}
                    className="group"
                  >
                    <div className="aspect-2/3 overflow-hidden rounded-card border border-border bg-panel">
                      {poster && (
                        <img
                          src={poster}
                          alt={entry.movie.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    {entry.rating && (
                      <p className="mt-1 text-center font-mono text-xs text-gold">
                        ★ {entry.rating.toFixed(1)}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted">Nenhum filme registrado ainda.</p>
          ))}

        {tab === "listas" &&
          (lists && lists.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {lists.map((list) => (
                <Link
                  key={list.id}
                  to={`/listas/${list.id}`}
                  className="rounded-card border border-border bg-panel p-4 hover:border-accent transition-colors"
                >
                  <p className="font-display font-semibold text-paper">
                    {list.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {list.items.length} filmes
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Nenhuma lista criada ainda.</p>
          ))}
        {tab === "watchlist" &&
          (watchlist && watchlist.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {watchlist.map((item) => {
                const poster = tmdbImage(item.movie.posterPath, "w200");
                return (
                  <Link
                    key={item.id}
                    to={`/filme/${item.movie.tmdbId}`}
                    className="group"
                  >
                    <div className="aspect-2/3 overflow-hidden rounded-card border border-border bg-panel">
                      {poster && (
                        <img
                          src={poster}
                          alt={item.movie.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Nenhum filme na watchlist ainda.
            </p>
          ))}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        viewer={viewer}
      />
    </div>
  );
};
