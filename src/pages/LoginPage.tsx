import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { loginUser, getCurrentUserFromApi } from "../authService";

interface LoginPageProps {
  setView: (view: "landing" | "login" | "signup") => void;
  onLogin: (user: any) => void;
}

export const LoginPage = ({ setView, onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);

      const user = await getCurrentUserFromApi();

      onLogin({
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-md mx-auto py-20 px-6">
        <div className="glass-card p-10 space-y-8 shadow-2xl relative">
          <button
            onClick={() => setView("landing")}
            className="absolute top-6 left-6 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowRight className="rotate-180" size={20} />
          </button>

          <div className="text-center pt-4">
            <h2 className="text-3xl font-black tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-2">
              Enter your credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm"
              />
            </div>

            {error && (
              <p className="text-error text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs font-bold text-text-muted">
              Don't have an account?
              <button
                onClick={() => setView("signup")}
                className="text-primary ml-2 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};