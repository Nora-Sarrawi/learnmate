import React from "react";
import { User, ShieldCheck, LogOut, BookOpen, DollarSign, FileText } from "lucide-react";
import { User as UserType } from "../types";

interface ProfilePageProps {
  user: (UserType & {
    avatar?: string;
    subjects?: string | string[];
    bio?: string;
    hourlyRate?: number;
  }) | null;
  onLogout: () => void;
}

function normalizeSubjects(subjects?: string | string[]) {
  if (Array.isArray(subjects)) return subjects.join(" • ");
  if (typeof subjects === "string") return subjects;
  return "General Tutoring";
}

export const ProfilePage = ({ user, onLogout }: ProfilePageProps) => (
  <div className="max-w-4xl mx-auto space-y-12 pb-10">
    <header className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-10">
        <div className="relative">
          <img
            src={user?.avatar || "https://picsum.photos/seed/user/200/200"}
            alt={user?.name || "User"}
            className="w-32 h-32 rounded-[2.5rem] bg-gray-100 object-cover shadow-2xl border-4 border-white"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {user?.name || "User"}
          </h1>

          <p className="text-sm font-bold text-primary uppercase tracking-[0.3em]">
            {user?.role === "tutor"
              ? "Professional Instructor"
              : "Student Account"}
          </p>

          <div className="flex gap-4 mt-4">
            <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest shadow-sm">
              Role: {user?.role}
            </div>

            <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest shadow-sm">
              LearnMate
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-6 py-3 bg-error/10 text-error rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-error hover:text-white transition-all active:scale-95"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </header>

    <div className="grid grid-cols-1 gap-10">
      <div className="glass-card p-10 space-y-8">
        <h3 className="text-lg font-bold flex items-center gap-3">
          <User size={20} className="text-primary" />
          Personal Information
        </h3>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
              Full Name
            </label>
            <p className="font-bold text-sm">{user?.name || "Unknown"}</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
              Email Address
            </label>
            <p className="font-bold text-sm">{user?.email || "Unknown"}</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
              Account Type
            </label>
            <p className="font-bold text-sm capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {user?.role === "tutor" && (
        <div className="glass-card p-10 space-y-8">
          <h3 className="text-lg font-bold flex items-center gap-3">
            <BookOpen size={20} className="text-primary" />
            Tutor Information
          </h3>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                Subjects
              </label>
              <p className="font-bold text-sm">
                {normalizeSubjects(user.subjects)}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                Session Rate
              </label>

              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                <p className="font-black text-lg">
                  {user.hourlyRate || 25}
                  <span className="text-xs text-text-muted font-bold ml-1">
                    /hr
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                Bio
              </label>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3">
                <FileText size={18} className="text-primary shrink-0 mt-1" />
                <p className="font-medium text-sm leading-relaxed text-text-muted">
                  {user.bio ||
                    "Experienced tutor ready to help students succeed."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="glass-card p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-3">
          <ShieldCheck size={20} className="text-primary" />
          Security
        </h3>
      </div>

      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">Password Management</p>
          <p className="text-xs text-text-muted mt-1 italic">
            Keep your account secure by updating your credentials regularly.
          </p>
        </div>

        <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary hover:text-primary transition-all">
          Change Password
        </button>
      </div>
    </div>
  </div>
);