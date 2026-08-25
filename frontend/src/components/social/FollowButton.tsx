import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/Button";
import { followUser, unfollowUser } from "../../lib/api/users";

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
  onToggle?: (following: boolean) => void;
}

interface ProfileCacheShape {
  isFollowedByViewer: boolean;
  stats: {
    followersCount: number;
    [key: string]: number;
  };
  [key: string]: unknown;
}

export const FollowButton = ({
  username,
  initialFollowing,
  onToggle,
}: FollowButtonProps) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const syncCaches = (next: boolean) => {
    queryClient.setQueryData<ProfileCacheShape>(["profile", username], (old) => {
      if (!old) return old;
      const delta = next ? 1 : -1;
      return {
        ...old,
        isFollowedByViewer: next,
        stats: {
          ...old.stats,
          followersCount: Math.max(0, old.stats.followersCount + delta),
        },
      };
    });

    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "followers" || query.queryKey[0] === "following",
    });

    onToggle?.(next);
  };

  const toggle = async () => {
    setLoading(true);
    const next = !following;
    try {
      if (following) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      setFollowing(next);
      syncCaches(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      aria-busy={loading}
      className={clsx(following && "hover:border-accent hover:text-accent")}
    >
      {loading && <LoaderCircle size={14} className="animate-spin" />}
      {loading ? "Atualizando..." : following ? "Seguindo" : "Seguir"}
    </Button>
  );
};