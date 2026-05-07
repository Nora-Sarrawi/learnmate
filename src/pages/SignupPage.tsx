import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { registerUser, confirmUser } from "../authService";

interface SignupPageProps {
  setView: (view: "landing" | "login" | "signup") => void;
}

export const SignupPage = ({ setView }: SignupPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<"student" | "tutor">("student");

  const [confirmationCode, setConfirmationCode] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password, name, role);
      setNeedsConfirmation(true);
    } catch (err: any) {
      console.error(err);

      if (err.name === "UsernameExistsException") {
        setError("This email already exists. Try logging in.");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmUser(email, confirmationCode);
      alert("Account confirmed successfully. You can now login.");
      setView("login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Confirmation failed");
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
              Create Account
            </h2>
            <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-2">
              Join SmartTutor
            </p>
          </div>

          {!needsConfirmation ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dana"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

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
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
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
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                      role === "student"
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-gray-50 text-text-muted border-gray-100 hover:border-primary/40"
                    }`}
                  >
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("tutor")}
                    className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                      role === "tutor"
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-gray-50 text-text-muted border-gray-100 hover:border-primary/40"
                    }`}
                  >
                    Tutor
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-error text-[10px] font-black uppercase tracking-widest text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-6">
              <p className="text-sm text-text-muted text-center font-medium">
                We sent a confirmation code to your email.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  required
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
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
                className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60"
              >
                {loading ? "Confirming..." : "Confirm Account"}
              </button>
            </form>
          )}

          <div className="text-center">
            <p className="text-xs font-bold text-text-muted">
              Already have an account?
              <button
                onClick={() => setView("login")}
                className="text-primary ml-2 hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};