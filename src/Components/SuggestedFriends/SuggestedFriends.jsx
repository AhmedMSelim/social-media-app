import { useState } from "react";
import { Users, Search, UserPlus } from "lucide-react";
import { useSuggestedFriends } from "../Hooks/useSuggestedFriends";
import { useFollowUser } from "../Hooks/useFollowUser";

export default function SuggestedFriends() {
  const { data = [] } = useSuggestedFriends();
  const { mutate, variables } = useFollowUser();

  const [search, setSearch] = useState("");

  const filteredUsers = data.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="hidden h-fit xl:sticky xl:top-[84px] xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#1877f2]" />
            <h3 className="text-base font-extrabold text-slate-900">
              Suggested Friends
            </h3>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
            {filteredUsers.length}
          </span>
        </div>

        <div className="mb-3">
          <label className="relative block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search friends..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="rounded-xl border border-slate-200 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => mutate(user._id)}
                  disabled={variables === user._id}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 bg-[#e7f3ff] text-[#1877f2] hover:bg-[#d8ebff]"
                >
                  <UserPlus size={13} />
                  {variables === user._id ? "Following..." : "Follow"}
                </button>
              </div>

              <div className="mt-2 text-[11px] font-semibold text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                  {user.followersCount} followers
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
          View more
        </button>
      </div>
    </aside>
  );
}
