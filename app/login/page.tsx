"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">🐾 PawMart</h1>
          <p className="text-gray-600 mt-2">Welcome back! Login to continue</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">🔍</span> Sign in with Google
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-orange-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}