import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useChangePassword } from "../Hooks/useChangePassword";
import { useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { mutate, isPending } = useChangePassword();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const isSamePassword = form.currentPassword === form.newPassword;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const isPasswordValid = passwordRegex.test(form.newPassword);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError(""); 
  };
  useEffect(() => {
    if (form.confirmPassword && form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match ");
    } else {
      setError("");
    }
  }, [form.newPassword, form.confirmPassword]);
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password ");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match ");
      return;
    }

    mutate({
      password: form.currentPassword,
      newPassword: form.newPassword,
    });
  };
  return (
    <main className="min-h-screen  py-6">
      <div className="mx-auto max-w-5xl px-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
              <KeyRound size={18} />
            </span>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Change Password
              </h1>
              <p className="text-sm text-slate-500">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                Current password
              </span>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none transition border-slate-200 focus:border-[#1877f2] focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      current: !showPassword.current,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword.current ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </label>

            
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                New password
              </span>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full rounded-xl border px-3 py-2.5 pr-10 text-sm outline-none transition ${
                    form.newPassword && !isPasswordValid
                      ? "border-red-500"
                      : "border-slate-200 focus:border-[#1877f2]"
                  } bg-slate-50 focus:bg-white`}
                />

                
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, new: !showPassword.new })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword.new ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </label>

            {form.newPassword && !isPasswordValid && (
              <p className="mt-1 text-xs text-red-500">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character (@$!%*?&)
              </p>
            )}
            
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                Confirm new password
              </span>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none transition ${
                    error
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-[#1877f2]"
                  } focus:bg-white`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword.confirm ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  {error}
                </p>
              )}
            </label>

            
            <button
              type="submit"
              disabled={
                !form.currentPassword ||
                !form.newPassword ||
                !form.confirmPassword ||
                !isPasswordValid || 
                error || 
                isPending ||
                isSamePassword
              }
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
