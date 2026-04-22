import React from "react";

export default function StatsCards({
  postsCount = 0,
  savedCount = 0,
  className = "",
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-1 ${className}`}>
      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
          My posts
        </p>
        <p className="mt-1 text-2xl font-black text-slate-900">{postsCount}</p>
      </div>

      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
          Saved posts
        </p>
        <p className="mt-1 text-2xl font-black text-slate-900">{savedCount}</p>
      </div>
    </div>
  );
}
