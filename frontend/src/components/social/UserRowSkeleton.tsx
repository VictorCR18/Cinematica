export const UserRowSkeleton = () => (
  <div className="flex animate-pulse items-center gap-3 px-2 py-3">
    <div className="h-12 w-12 shrink-0 rounded-full bg-[#1c1917]" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-32 rounded bg-[#1c1917]" />
      <div className="h-3 w-20 rounded bg-[#1c1917]" />
    </div>
    <div className="h-8 w-24 rounded-full bg-[#1c1917]" />
  </div>
);
