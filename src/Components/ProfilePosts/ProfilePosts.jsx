import {
  FiFileText,
  FiBookmark,
  FiThumbsUp,
  FiRepeat,
  FiMessageCircle,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProfilePostSkeleton from "../ProfilePostSkeleton/ProfilePostSkeleton";

export default function ProfilePosts({
  posts = [],
  saved = [],
  tab,
  setTab,
  isLoading,
}) {
  const navigate = useNavigate();
  const currentData = tab === "posts" ? posts : saved;
  const safeData = Array.isArray(currentData) ? currentData : [];
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  console.log("saved length:", saved.length);
  console.log("saved data:", saved);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-white p-3 shadow-sm">
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setTab("posts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
              tab === "posts"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600"
            }`}
          >
            <FiFileText />
            My Posts
          </button>

          <button
            onClick={() => setTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
              tab === "saved"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600"
            }`}
          >
            <FiBookmark />
            Saved
          </button>
        </div>

        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
          {currentData.length}
        </span>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => <ProfilePostSkeleton key={i} />)
          : safeData.map((post) => (
              <article
                key={post._id}
                className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.user?.photo}
                        className="w-10 h-10 rounded-full"
                      />

                      <div>
                        <p className="text-sm font-bold">{post.user?.name}</p>
                        <p className="text-xs text-gray-500">
                          @{post.user?.username}
                        </p>{" "}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/postdetails/${post._id}`)}
                      className="text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      View details
                    </button>
                  </div>

                  <div className="pt-3">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {post.body}
                    </p>
                  </div>
                </div>

                {post.image && (
                  <div className="border-y bg-black">
                    <img
                      src={post.image}
                      className="w-full max-h-[500px] object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between px-4 py-3 text-sm text-gray-600">
                  <div className="flex gap-4 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold">
                      <FiThumbsUp className="text-blue-600" />
                      {post.likes?.length || 0} likes
                    </span>

                    <span className="flex items-center gap-1 font-semibold">
                      <FiRepeat className="text-blue-600" />
                      {post.sharesCount || 0} shares
                    </span>

                    <span className="flex items-center gap-1 font-semibold">
                      <FiMessageCircle className="text-blue-600" />
                      {post.commentsCount || 0} comments
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold">
                    <FiClock />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </article>
            ))}
      </div>

      {!isLoading && safeData.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          {tab === "posts" ? <ProfilePostSkeleton /> : "No saved posts yet ⭐"}
        </p>
      )}
    </section>
  );
}
