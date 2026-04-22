import { FiMail, FiUsers } from "react-icons/fi";

export default function AboutCard({ user }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-extrabold text-slate-800">About</h3>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <FiMail size={15} className="text-slate-500" />
          {user?.email || "No email"}
        </p>

        <p className="flex items-center gap-2">
          <FiUsers size={15} className="text-slate-500" />
          Active on Route Posts
        </p>
      </div>
    </div>
  );
}
