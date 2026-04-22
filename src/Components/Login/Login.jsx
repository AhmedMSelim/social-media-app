import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { AuthContext } from "../../Context/AuthContext";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid Email")
    .regex(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "Not match with pattern",
    ),
  password: z
    .string()
    .nonempty("Password required")
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/,
      "Password must contain capital, small, number & special char",
    ),
});

export default function Login() {
  const navigate = useNavigate();
  const { setUserLogin } = useContext(AuthContext);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  function Handlelogin(values) {
    setIsLoading(true);
    setApiError(null);

    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        if (res.data.message === "signed in successfully") {
          localStorage.setItem("userToken", res.data.data.token);
          setUserLogin(res.data.data.token);
          navigate("/");
        }
      })
      .catch((err) => {
        setApiError(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <section className="order-1 w-full max-w-[430px] mx-auto">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
            Route Posts
          </h1>
          <p className="mt-1 text-base font-medium text-slate-700">
            Connect with friends and the world around you
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `rounded-lg py-2 text-sm font-extrabold text-center transition ${
                isActive
                  ? "bg-white text-[#00298d] shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `rounded-lg py-2 text-sm font-extrabold text-center transition ${
                isActive
                  ? "bg-white text-[#00298d] shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`
            }
          >
            Register
          </NavLink>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">
          Log in to Route Posts
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Log in and continue your social journey.
        </p>

        {apiError && (
          <p className="mt-3 rounded-lg bg-red-100 p-2 text-sm font-bold text-red-600">
            {apiError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(Handlelogin)}
          noValidate
          className="mt-5 space-y-4"
        >
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiUser />
              </span>
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#00298d] focus:bg-white"
              />
            </div>
            {errors.email && touchedFields.email && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FaKey />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#00298d] focus:bg-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </span>
            </div>
            {errors.password && touchedFields.password && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-xl bg-[#00298d] py-3 text-base font-extrabold text-white transition hover:bg-[#001f6b] disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>

          <button
            type="button"
            className="mx-auto block text-sm font-semibold text-[#00298d] hover:underline"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </section>
  );
}
