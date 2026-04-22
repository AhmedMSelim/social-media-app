import { NavLink } from "react-router-dom";
import { House, User, MessageCircle, Menu } from "lucide-react";
import { useState, useContext } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getUnreadCount = async () => {
  const token = localStorage.getItem("userToken");

  const { data } = await axios.get(
    "https://route-posts.routemisr.com/notifications/unread-count",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data?.data?.unreadCount ?? 0;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const token = localStorage.getItem("userToken");

  const {
    data: unreadCount = 0,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadCount,
    refetchInterval: 10000,
    staleTime: 5000,
    enabled: !!token,
  });

  const handleNotificationsClick = () => {
    queryClient.setQueryData(["unreadNotifications"], 0);

    queryClient.invalidateQueries({
      queryKey: ["unreadNotifications"],
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        <div className="flex items-center gap-3">
          <img
            src="/route.png"
            alt="Route Posts"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
            Route Posts
          </p>
        </div>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                isActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white"
              }`
            }
          >
            <House size={20} />
            <span className="hidden sm:inline ">Feed</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                isActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white"
              }`
            }
          >
            <User size={20} />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>

          <NavLink
            to="/notifications"
            onClick={handleNotificationsClick}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                isActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white"
              }`
            }
          >
            <div className="relative">
              <MessageCircle size={20} />

              {!isLoading && !isError && unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 min-w-4.5 text-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            <span className="hidden sm:inline">Notifications</span>
          </NavLink>
        </nav>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-full border-slate-200 border px-2 py-1.5 bg-slate-50 hover:bg-slate-100"
          >
            {userData?.photo ? (
              <img
                src={userData.photo}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="hidden md:block text-sm font-semibold">
              {userData?.name}
            </span>

            <Menu size={15} />
          </button>

          <ProfileDropdown open={open} setOpen={setOpen} />
        </div>
      </div>
    </header>
  );
}
