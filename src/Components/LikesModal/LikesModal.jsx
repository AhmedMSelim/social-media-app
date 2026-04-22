import { X, Users } from "lucide-react";

export default function LikesModal({ isOpen, onClose, likes, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="text-[#1877f2]" size={17} />
            <h4 className="text-base font-extrabold text-slate-900">
              People who reacted
            </h4>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[420px] overflow-y-auto px-2 py-2">
          <div className="space-y-1">

            {isLoading && (
              <p className="text-center text-sm text-slate-500 py-4">
                Loading...
              </p>
            )}

            {!isLoading && likes?.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">
                No likes yet
              </p>
            )}

            {likes?.map((user) => (
              <a
                key={user._id}
                href={`#/profile/${user._id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
              >
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
              </a>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}