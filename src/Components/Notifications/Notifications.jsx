import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, MessageCircle, Heart, Repeat2 } from "lucide-react";
import { formatTimeAgo } from "../../utils/timeAgo";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [, forceUpdate] = useState(0);

  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();

  const unreadCount = queryClient.getQueryData(["unreadNotifications"]) || 0;

  const getNotifications = () =>
    axios.get(`https://route-posts.routemisr.com/notifications`, {
      params: {
        unread: activeTab === "unread" ? true : undefined,
        page: 1,
        limit: 50,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", activeTab],
    queryFn: getNotifications,
    refetchInterval: 10000,
  });

  const notifications = data?.data?.data?.notifications || [];

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await axios.patch(
      `https://route-posts.routemisr.com/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    queryClient.setQueryData(["unreadNotifications"], (old) =>
      Math.max((old || 1) - 1, 0),
    );

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllAsRead = async () => {
    await axios.patch(
      `https://route-posts.routemisr.com/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    queryClient.setQueryData(["unreadNotifications"], 0);

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          {/* Header */}
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Realtime updates for likes, comments, shares, and follows.
                </p>
              </div>

              <button
                onClick={markAllAsRead}
                disabled={notifications.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  activeTab === "all"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setActiveTab("unread")}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
                  activeTab === "unread"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Unread
                <span className="bg-white text-[#1877f2] text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 animate-pulse rounded-xl"
                />
              ))}

            {!isLoading && notifications.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  No notifications yet.
                </p>
              </div>
            )}

            {filteredNotifications.map((notif) => {
              const user = notif?.actor?.name || "Someone";
              const image =
                notif?.actor?.photo ||
                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

              const isRead = notif?.isRead;

              let content = "";

              if (notif.type === "comment_post") {
                content =
                  notif.entityType === "comment"
                    ? notif.entity?.content
                    : notif.entity?.topComment?.content || notif.entity?.body;
              }

              if (notif.type === "like_post" || notif.type === "share_post") {
                content = notif.entity?.body;
              }

              const actionMap = {
                like_post: "liked your post",
                comment_post: "commented on your post",
                share_post: "shared your post",
              };

              return (
                <article
                  key={notif._id}
                  className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${
                    isRead
                      ? "border-slate-200 bg-white hover:bg-slate-50"
                      : "border-[#dbeafe] bg-[#edf4ff]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={image}
                      alt={user}
                      className="h-11 w-11 rounded-full object-cover"
                    />

                    <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
                      {notif.type === "like_post" && (
                        <Heart className="text-rose-500 w-3 h-3" />
                      )}
                      {notif.type === "comment_post" && (
                        <MessageCircle className="text-[#1877f2] w-3 h-3" />
                      )}
                      {notif.type === "share_post" && (
                        <Repeat2 className="text-emerald-600 w-3 h-3" />
                      )}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm text-slate-800">
                        <span className="font-extrabold">{user}</span>{" "}
                        {actionMap[notif.type]}
                      </p>

                      <span className="text-xs text-slate-500">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    {content && (
                      <p className="text-sm text-slate-600 mt-1">{content}</p>
                    )}

                    {!isRead && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="mt-2 text-xs text-blue-600 font-bold"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
