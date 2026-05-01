import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, do not show login page again.
    // This removes the "login option" from the signed-in experience.
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  // handleChange updates the input value in React state.
  // This is called a controlled form.
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // handleSubmit sends login data to backend using AuthContext login().
  // If login succeeds, user goes back to home page.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto grid w-[92%] max-w-5xl overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-2">
        <section className="bg-red-500 p-8 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-100">Welcome back</p>
          <h1 className="mt-3 text-3xl font-black">Login to Tronix</h1>
          <p className="mt-4 leading-7 text-white/85">
            Track orders, save wishlists, manage addresses, and checkout faster on your next tech upgrade.
          </p>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-black">Login</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              required
            />
            {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">{error}</p>}
            <button type="submit" className="w-full rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-sm text-gray-500">
            New customer?{" "}
            <Link to="/signup" className="font-bold text-red-500">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
