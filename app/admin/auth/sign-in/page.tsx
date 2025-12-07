"use client";
import { useFormik } from "formik";
import React, { useState, useContext } from "react";
import { Toaster } from "react-hot-toast";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
} from "react-icons/ai";
import * as Yup from "yup";

import AdminAuthContext from "../../context/AuthContext";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("AdminLogin must be used within an AdminAuthProvider");
  }

  const { loginAdmin, error, loading } = context;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      loginAdmin(values.email, values.password);
    },
  });

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
          <div>
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-500">
              <AiOutlineLock className="size-10 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="size-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <AiOutlineMail className="size-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    className={`block w-full appearance-none border py-3 pl-10 pr-3 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm`}
                    placeholder="admin@example.com"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <AiOutlineLock className="size-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className={`block w-full appearance-none border px-10 py-3 ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <AiOutlineEye className="size-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <AiOutlineEyeInvisible className="size-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative flex w-full justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white ${
                  loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } transition-colors duration-200`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="-ml-1 mr-3 size-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Protected admin area
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
