import React from "react";
import defaultAvatar from "../../assets/default-avatar.png";

export default function Comment({ topComment }) {
  const PLACEHOLDER_IMAGE = defaultAvatar;

  return (
    <div className="px-0 py-2 border-t border-slate-200">
      <div className="flex gap-3">
        <img
          alt="user"
          className="h-10 w-10 rounded-full object-cover"
          src={topComment.commentCreator.photo}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        <div className="flex flex-col">
          <p className="text-sm font-semibold">
            {topComment.commentCreator.name}
          </p>

          <p className="text-xs text-slate-500">{topComment.createdAt}</p>

          {topComment.content && (
            <p className="text-sm mt-1">{topComment.content}</p>
          )}

          {topComment.image && (
            <img src={topComment.image} className="mt-2 rounded-lg max-w-xs" />
          )}
        </div>
      </div>
    </div>
  );
}
