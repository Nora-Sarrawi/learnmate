import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Star } from "lucide-react";
import { Tutor } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TutorsListProps {
  navigateTo: (page: string, tutor: Tutor | null) => void;
}

async function getTutorsFromApi() {
  const response = await fetch(`${API_BASE_URL}/auth/tutors`);

  if (!response.ok) {
    throw new Error("Failed to load tutors");
  }

  const data = await response.json();
  return data.tutors || [];
}

function mapUserToTutor(user: any): Tutor {
  return {
    id: user.userId,
    name: user.name || user.email?.split("@")[0] || "Tutor",
    email: user.email,
    role: "tutor",
    avatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.name || user.email || "Tutor"
      )}`,
    subjects: user.subjects || ["General Tutoring"],
    bio: user.bio || "Experienced tutor ready to help students succeed.",
    rating: user.rating || 5,
    reviewCount: user.reviewCount || 0,
    hourlyRate: user.hourlyRate || 25,
    availability: [],
  };
}

export const TutorsList = ({ navigateTo }: TutorsListProps) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadTutors() {
      try {
        setLoading(true);
        setError("");

        const users = await getTutorsFromApi();
        const mappedTutors = users.map(mapUserToTutor);

        setTutors(mappedTutors);
      } catch (err) {
        console.error(err);
        setError("Failed to load tutors");
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const keyword = searchTerm.toLowerCase();

    return (
      tutor.name.toLowerCase().includes(keyword) ||
      tutor.subjects.join(" ").toLowerCase().includes(keyword) ||
      tutor.bio.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-text-muted">
        Loading tutors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center font-bold text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Find Your Expert
        </h1>
        <p className="text-text-muted mt-1">
          Discover mentors who help you exceed your goals.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            size={20}
          />
          <input
            type="text"
            placeholder="Search subjects, skills, or mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select className="px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none shadow-sm cursor-pointer hover:border-primary transition-all">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>Engineering</option>
            <option>Design</option>
          </select>

          <select className="px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none shadow-sm cursor-pointer hover:border-primary transition-all">
            <option>Price Range</option>
            <option>$20 - $50</option>
            <option>$50 - $100</option>
            <option>$100+</option>
          </select>
        </div>
      </div>

      {filteredTutors.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-bold text-text-muted">No tutors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTutors.map((tutor) => (
            <motion.div
              layoutId={tutor.id}
              key={tutor.id}
              className="glass-card group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-b-4 border-transparent hover:border-primary"
              onClick={() => navigateTo("tutorProfile", tutor)}            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-20 h-20 rounded-3xl bg-gray-100 object-cover shadow-lg border-4 border-white"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-4 border-white rounded-full shadow-sm"
                      title="Online"
                    />
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                      <Star size={18} fill="currentColor" />
                      {tutor.rating}
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                      {tutor.reviewCount} verified reviews
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {tutor.name}
                </h3>

                <p className="text-primary/70 text-xs font-bold uppercase tracking-widest mt-1 mb-4">
                  {tutor.subjects.join(" • ")}
                </p>

                <p className="text-sm text-text-muted line-clamp-2 mb-6 leading-relaxed italic">
                  "{tutor.bio}"
                </p>

                <div className="flex items-center gap-6 py-6 border-y border-gray-50 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">
                      Session Rate
                    </span>
                    <span className="text-lg font-bold">
                      ${tutor.hourlyRate}
                      <small className="text-xs font-normal text-text-muted ml-0.5">
                        /hr
                      </small>
                    </span>
                  </div>

                  <div className="w-px h-10 bg-gray-100" />

                  <div className="flex flex-col">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">
                      Booked sessions
                    </span>
                    <span className="text-lg font-bold">Live</span>
                  </div>
                </div>

                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-primary transition-all duration-300 shadow-xl shadow-gray-900/10">
                  View Portfolio & Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};