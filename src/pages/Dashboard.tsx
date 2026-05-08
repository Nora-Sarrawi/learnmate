import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import { getMyBookings } from "../bookingService";
import { StatusBadge } from "../components/StatusBadge";
import { mockTutors } from "../data"; // 👈 مهم

interface DashboardProps {
  navigateTo: (page: string) => void;
}

interface Booking {
  bookingId: string;
  tutorId: string;
  subject?: string;
  status: string;
  timeSlot: string;
  createdAt?: string;
}

export const Dashboard = ({ navigateTo }: DashboardProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getMyBookings();

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed loading dashboard", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getTutorName = (tutorId: string) => {
    const tutor = mockTutors.find((t) => t.id === tutorId);
    return tutor ? tutor.name : tutorId;
  };

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );

  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const stats = [
    {
      label: "Upcoming Sessions",
      value: upcoming.length,
      icon: CalendarDays,
    },
    {
      label: "Cancelled",
      value: cancelled.length,
      icon: Clock3,
    },
    {
      label: "Tutors Worked With",
      value: new Set(bookings.map((b) => b.tutorId)).size,
      icon: Users,
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
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">
            Welcome Back
          </p>
          <h1 className="text-3xl font-black">Student Dashboard</h1>
        </div>

        <button
          onClick={() => navigateTo("tutors")}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90"
        >
          Find Tutors
        </button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                  {item.label}
                </p>
                <Icon size={18} className="text-primary" />
              </div>

              <h2 className="text-3xl font-black">{item.value}</h2>
            </motion.div>
          );
        })}
      </div>

      {/* UPCOMING */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Upcoming Sessions</h2>

          <button
            onClick={() => navigateTo("bookings")}
            className="text-primary text-sm font-bold"
          >
            View All
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border text-center text-gray-500">
            No upcoming sessions.
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.slice(0, 4).map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white p-5 rounded-3xl border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">
                    {booking.subject || "Tutoring Session"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {getTutorName(booking.tutorId)}
                  </p>

                  <p className="text-sm text-gray-500">
                    {booking.timeSlot.replace("T", " at ")}
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STUDY TIP */}
      <div className="bg-gray-900 text-white p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/20 blur-[90px] rounded-full" />

        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-black mb-4">Daily Study Tip</h3>

          <p className="text-white/70 leading-relaxed">
            Students who review material 30 minutes before tutoring sessions
            usually learn faster and retain more information.
          </p>

          <button
            onClick={() => navigateTo("materials")}
            className="mt-6 text-primary font-bold text-sm"
          >
            Open Materials →
          </button>
        </div>
      </div>
    </div>
  );
};