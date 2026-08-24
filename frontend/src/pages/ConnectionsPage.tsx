import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Search, Users } from "lucide-react";
import { listFollowers, listFollowing } from "../lib/api/users";
import type { ConnectionUser } from "@/types/index.ts";
import { UserRow } from "../components/social/UserRow.tsx";
import { UserRowSkeleton } from "../components/social/UserRowSkeleton.tsx";

type Tab = "followers" | "following";

interface ConnectionsPageProps {
  defaultTab: Tab;
}

export const ConnectionsPage = ({ defaultTab }: ConnectionsPageProps) => {
  const { username = "" } = useParams<{ username: string }>();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [query, setQuery] = useState("");
  const [followers, setFollowers] = useState<ConnectionUser[] | null>(null);
  const [following, setFollowing] = useState<ConnectionUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab, username]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([listFollowers(username), listFollowing(username)])
      .then(([followersRes, followingRes]) => {
        if (cancelled) return;
        setFollowers(followersRes);
        setFollowing(followingRes);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [username]);

  const list = tab === "followers" ? followers : following;

  const filtered = useMemo(() => {
    if (!list) return null;
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [list, query]);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-ink px-4 pb-16 text-[#f3ece0]">
      <header className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-[#221f1b] bg-ink/95 px-4 py-4 backdrop-blur">
        <Link
          to={`/perfil/${username}`}
          className="text-[#a99a89] transition-colors hover:text-[#f3ece0]"
          aria-label="Voltar ao perfil"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-lg">@{username}</h1>
      </header>

      <nav className="relative mt-2 flex border-b border-[#221f1b]">
        {[
          {
            key: "followers" as const,
            label: "Seguidores",
            count: followers?.length,
          },
          {
            key: "following" as const,
            label: "Seguindo",
            count: following?.length,
          },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "relative flex-1 py-3 text-sm font-medium transition-colors",
              tab === t.key
                ? "text-[#f3ece0]"
                : "text-[#7d7265] hover:text-[#a99a89]",
            ].join(" ")}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1 text-[#7d7265]">{t.count}</span>
            )}
            {tab === t.key && (
              <motion.span
                layoutId="connections-tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-[#e2492c]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </nav>

      <div className="relative mt-4">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7265]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar"
          className="w-full rounded-full border border-[#2a2622] bg-[#1c1917] py-2 pl-9 pr-3 text-sm text-[#f3ece0] placeholder:text-[#7d7265] outline-none focus:border-[#e2492c]/60"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === "following" ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-2"
        >
          {loading || !filtered ? (
            <div className="mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <UserRowSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-[#7d7265]">
              <Users size={28} />
              <p className="text-sm">
                {query
                  ? "Nenhum resultado para essa busca."
                  : tab === "followers"
                    ? "Ainda sem seguidores."
                    : "Ainda não segue ninguém."}
              </p>
            </div>
          ) : (
            filtered.map((user, i) => (
              <UserRow key={user.id} user={user} index={i} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
