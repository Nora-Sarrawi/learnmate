import React, { useState } from "react";
import { ArrowLeft, Calendar, Upload, AlertCircle } from "lucide-react";
import { Tutor } from "../types";
import { createBooking } from "../bookingService";

interface BookingPageProps {
  tutor: Tutor;
  navigateTo: (page: string, tutor: Tutor | null) => void;
}

export const BookingPage = ({ tutor, navigateTo }: BookingPageProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTimeSlot = "2026-04-25T10:00";

  const handleBookSession = async () => {
    setError("");
    setLoading(true);

    try {
      await createBooking({
        tutorId: tutor.id,
        timeSlot: selectedTimeSlot,
      });

      alert("Session booked successfully!");
      navigateTo("bookings", null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to book session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex items-center gap-10">
        <button
          onClick={() => navigateTo("profile", tutor)}
          className="p-4 bg-white border border-gray-200 hover:border-primary rounded-2xl transition-all shadow-sm group"
        >
          <ArrowLeft size={24} className="group-hover:text-primary transition-colors" />
        </button>

        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Checkout</h1>
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">
            Finalizing your mentorship
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-10">
          <div className="glass-card p-10 border-t-4 border-success">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <Calendar size={20} className="text-primary" />
              Session Configuration
            </h3>

            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-4">
                  Date
                </label>

                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div
                      key={i}
                      className="text-[10px] font-black text-center py-2 opacity-30"
                    >
                      {d}
                    </div>
                  ))}

                  {Array.from({ length: 31 }).map((_, i) => (
                    <button
                      key={i}
                      className={`aspect-square rounded-xl text-xs font-bold transition-all ${
                        i + 1 === 25
                          ? "bg-primary text-white shadow-xl scale-110 z-10"
                          : "hover:bg-primary-light text-text-main"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-4">
                  Selected Time Slot
                </label>

                <div className="flex gap-2">
                  <div className="flex-1 p-4 bg-primary-light/50 border-2 border-primary rounded-2xl text-primary text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em]">
                      Selected Slot
                    </p>
                    <p className="text-lg font-black font-mono">
                      {selectedTimeSlot}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <Upload size={20} className="text-primary" />
              Resource Sharing
            </h3>

            <div className="border-4 border-dashed border-gray-50 rounded-[2.5rem] p-12 text-center hover:border-primary/20 hover:bg-gray-50/50 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-primary" />
              </div>

              <p className="font-black text-sm uppercase tracking-widest mb-2">
                Upload Files
              </p>

              <p className="text-xs text-text-muted font-bold tracking-tight">
                Upload lecture notes or assignments for {tutor.name} to review.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="glass-card p-10 bg-gray-900 border-none relative overflow-hidden text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />

            <h3 className="text-2xl font-black mb-10 tracking-tight">
              Order Details
            </h3>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Mentor
                </span>
                <span className="font-bold text-sm">{tutor.name}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Subject
                </span>
                <span className="font-bold text-sm">{tutor.subjects[0]}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Appointment
                </span>
                <span className="font-bold text-sm">{selectedTimeSlot}</span>
              </div>

              <div className="pt-8 flex justify-between items-center">
                <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
                  Total Investment
                </span>
                <span className="text-4xl font-black tabular-nums tracking-tighter shadow-sm text-primary">
                  ${tutor.hourlyRate}
                </span>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <textarea
                placeholder="Briefly describe what you'd like to focus on during this session..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-white/20 min-h-[140px] leading-relaxed transition-all"
              />

              {error && (
                <p className="text-error text-xs font-bold text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleBookSession}
                disabled={loading}
                className="w-full bg-white text-gray-900 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-primary hover:text-white hover:scale-[1.02] transition-all shadow-xl shadow-black/40 disabled:opacity-60"
              >
                {loading ? "Booking..." : "Book Session Now"}
              </button>
            </div>
          </div>

          <div className="p-8 bg-indigo-50/50 rounded-3xl flex gap-5 border border-indigo-100">
            <AlertCircle className="text-primary shrink-0" size={24} />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                Cancellation Policy
              </p>
              <p className="text-xs text-indigo-900/70 font-bold leading-relaxed">
                Full refund if cancelled up to 24 hours before the session. 50%
                refund after that window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};