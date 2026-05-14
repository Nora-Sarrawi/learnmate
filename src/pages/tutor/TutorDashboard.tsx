import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, DollarSign, AlertCircle, Users } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { getCurrentUserFromApi } from "../../authService";
import { getAvailability, AvailabilitySlot } from "../../api";

interface TutorDashboardProps {
  navigateTo: (page: string) => void;
}

export const TutorDashboard = ({ navigateTo }: TutorDashboardProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userData = await getCurrentUserFromApi();
      setUser(userData);

      const availability = await getAvailability(userData.userId);
      setSlots(availability);
    } catch (error) {
      console.error("Failed loading tutor dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-CA");

  const todaySessions = slots.filter((s) => s.date === today);

  const upcoming = slots.filter((s) => s.date >= today);

  const pending = slots.filter((s) => s.status === "pending");

  const tutorStats = [
    {
      label: "Today's Sessions",
      value: todaySessions.length,
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Upcoming Sessions",
      value: upcoming.length,
      icon: Users,
      color: "text-indigo-500",
    },
    {
      label: "Hourly Rate",
      value: `$${user?.hourlyRate ?? "--"}`,
      icon: DollarSign,
      color: "text-green-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="font-bold text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <header>
        <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">
          Tutor Command Center
        </p>
        <h1 className="text-4xl font-black tracking-tight">
          Welcome, {user?.name ?? "Tutor"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.subjects} • {user?.bio}
        </p>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutorStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border shadow-sm hover:border-primary transition-all group"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                {stat.label}
              </p>
              <stat.icon size={18} className={stat.color} />
            </div>
            <h2 className="text-3xl font-black">{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* UPCOMING SESSIONS */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Upcoming Sessions</h2>
          <button
            onClick={() => navigateTo("sessions")}
            className="text-primary text-sm font-bold"
          >
            Full Schedule
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border text-center text-gray-500">
            No upcoming sessions.
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.slice(0, 4).map((slot) => (
              <div
                key={slot.slotId}
                className="bg-white p-5 rounded-3xl border flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {slot.subject || "Tutoring Session"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {slot.date} • {slot.startTime} – {slot.endTime}
                    </p>
                  </div>
                </div>
                <StatusBadge status={slot.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AVAILABILITY SUMMARY */}
      <div className="bg-gray-900 text-white p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/20 blur-[90px] rounded-full" />
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-black mb-4">Your Availability</h3>
          <p className="text-white/70 leading-relaxed">
            You have{" "}
            <span className="text-white font-bold">
              {slots.filter((s) => s.status === "available").length} open slots
            </span>{" "}
            available for booking. Keep your schedule updated to get more
            students.
          </p>
          <button
            onClick={() => navigateTo("availability")}
            className="mt-6 text-primary font-bold text-sm"
          >
            Manage Availability →
          </button>
        </div>
      </div>
    </div>
  );
};