import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { ConnectionUser } from "../../types/index.js";
import { useAuth } from "../../hooks/useAuth";
import { FollowButton } from "./FollowButton.js";
import { Avatar } from "../ui/Avatar.js";

interface UserRowProps {
  user: ConnectionUser;
  index: number;
}

export const UserRow = ({ user, index }: UserRowProps) => {
  const { user: viewer } = useAuth();
  const isViewer = viewer?.username === user.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index, 8) * 0.03,
        ease: "easeOut",
      }}
      className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-[#1c1917]"
    >
      <Link to={`/perfil/${user.username}`} className="shrink-0">
        <Avatar
          name={user.name}
          src={
            user.avatarUrl ??
            `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.username}`
          }
          size={48}
        />
      </Link>

      <Link to={`/perfil/${user.username}`} className="min-w-0 flex-1">
        <p className="truncate font-serif text-[15px] leading-tight text-[#f3ece0]">
          {user.name}
        </p>
        <p className="truncate text-sm text-[#a99a89]">@{user.username}</p>
        {user.bio && (
          <p className="mt-0.5 truncate text-xs text-[#7d7265]">{user.bio}</p>
        )}
      </Link>

      {!isViewer && (
        <FollowButton
          username={user.username}
          initialFollowing={user.isFollowedByViewer}
        />
      )}
    </motion.div>
  );
};
