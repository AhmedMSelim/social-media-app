import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { FiUser, FiLock, FiCalendar, FiUsers } from "react-icons/fi";
const schema = z
  .object({
    name: z.string().nonempty("Name is Required").min(3).max(20),

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
        "Weak password",
      ),
    rePassword: z.string().nonempty("Confirm password is required"),
    dateOfBirth: z.string().refine((date) => {
      const userDate = new Date(date);
      const now = new Date();
      return now.getFullYear() - userDate.getFullYear() >= 10;
    }, "Invalid Date"),
    gender: z.enum(["male", "female"]),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Password and Confirm Password not matched",
  });

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  function handleRegister(values) {
    setIsLoading(true);
    setApiError(null);

    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        if (res.data.message === "account created") {
          navigate("/login");
        }
      })
      .catch((err) => setApiError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <section className="order-1 w-full max-w-[430px] mx-auto">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-extrabold text-[#00298d]">
            Route Posts
          </h1>
          <p className="mt-1 text-slate-700">
            Connect with friends and the world around you
          </p>
        </div>

        {/* Tabs */}

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
          Create a new account
        </h2>
        <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>

        {apiError && (
          <p className="mt-3 rounded-lg bg-red-100 p-2 text-sm font-bold text-red-600">
            {apiError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(handleRegister)}
          noValidate
          className="mt-5 space-y-4"
        >
          {/* name */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FiUser />
            </span>

            <input
              type="text"
              {...register("name")}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#00298d] focus:bg-white"
            />
          </div>
          {errors.name && touchedFields.name && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.name.message}
            </p>
          )}
          {/* email */}
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

          {/* Gender */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FiUsers />
            </span>

            <select
              {...register("gender")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#00298d] focus:bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {errors.gender && touchedFields.gender && (
            <p className="text-xs text-red-500 font-semibold">
              {errors.gender.message}
            </p>
          )}
          {/* Date */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FiCalendar />
            </span>

            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#00298d] focus:bg-white"
            />
          </div>

          {errors.dateOfBirth && touchedFields.dateOfBirth && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.dateOfBirth.message}
            </p>
          )}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FaKey />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none focus:border-[#00298d] focus:bg-white"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FaKey />
            </span>

            <input
              type={showConfirm ? "text" : "password"}
              {...register("rePassword")}
              placeholder="Confirm password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none focus:border-[#00298d] focus:bg-white"
            />

            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-[#00298d] py-3 font-extrabold text-white hover:bg-[#001f6b] disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Create New Account"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Input({ register, error, touched, placeholder, type = "text" }) {
  return (
    <div>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm outline-none focus:border-[#00298d]"
      />
      {error && touched && (
        <p className="mt-1 text-xs font-semibold text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}
