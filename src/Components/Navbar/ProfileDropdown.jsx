import { useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Settings } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

export default function ProfileDropdown({ open, setOpen }) {
  const menuRef = useRef();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
    >
      <NavLink
        to="/profile"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      >
        <User size={16} />
        Profile
      </NavLink>

      <NavLink
        to="/settings"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      >
        <Settings size={16} />
        Settings
      </NavLink>

      <div className="my-1 border-t"></div>

      <button
        onClick={() => {
          logout();
          setOpen(false);
          navigate("/login");
        }}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
      >
        Logout
      </button>
    </div>
  );
}
