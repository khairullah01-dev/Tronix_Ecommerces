import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { isLoggedIn, signup } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, they should not see signup page.
    // They can logout first if they want to create another account.
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  // handleChange stores each form field value in state.
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // handleSubmit validates passwords, then calls backend register API through AuthContext.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      });
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
        <section className="bg-gray-900 p-8 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">Create account</p>
          <h1 className="mt-3 text-3xl font-black">Join Tronix</h1>
          <p className="mt-4 leading-7 text-white/75">
            Save your favorite devices, check out faster, track orders, and get updates on new electronics deals.
          </p>

          <div className="mt-8 space-y-4">
            {["Faster checkout", "Saved order history", "Exclusive launch offers"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                <IoCheckmarkCircleOutline className="text-xl text-red-400" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-black">Sign up</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                required
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              />
            </div>
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
              placeholder="Password, minimum 8 characters"
              className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              minLength={8}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              minLength={8}
              required
            />
            <label className="flex items-start gap-3 text-sm leading-6 text-gray-500">
              <input type="checkbox" className="mt-1 accent-red-500" />
              <span>I agree to receive order updates and Tronix account emails.</span>
            </label>
            <button type="submit" className="w-full rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900">
              {loading ? "Creating account..." : "Create Account"}
            </button>
            {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">{error}</p>}
          </form>
          <p className="mt-5 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-red-500">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Signup;
