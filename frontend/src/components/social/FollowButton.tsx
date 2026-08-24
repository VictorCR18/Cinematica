import { useState } from "react";
import clsx from "clsx";
import { Button } from "../ui/Button";
import { followUser, unfollowUser } from "../../lib/api/users";

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
}

export const FollowButton = ({
  username,
  initialFollowing,
}: FollowButtonProps) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(username);
        setFollowing(false);
      } else {
        await followUser(username);
        setFollowing(true);
      }
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
      className={clsx(following && "hover:border-accent hover:text-accent")}
    >
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );
};
