import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Tutor } from "../types";
import { createBooking } from "../bookingService";
import { getIdToken } from "../authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TutorProfileProps {
  tutor: Tutor;
  navigateTo: (page: string, tutor: Tutor | null) => void;
}

type AvailabilitySlot = {
  tutorId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  subject?: string;
};

export const TutorProfile = ({ tutor, navigateTo }: TutorProfileProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);

        const token = await getIdToken();

        const response = await fetch(
          `${API_BASE_URL}/tutors/availability?tutorId=${encodeURIComponent(
            tutor.id
          )}`,
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined
        );

        if (!response.ok) {
          throw new Error("Failed to load availability");
        }

        const data = await response.json();
        setSlots(data.items || []);
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, [tutor.id]);

  const handleBook = async (slot: AvailabilitySlot) => {
    try {
      setBookingSlotId(slot.slotId);

      await createBooking({
        tutorId: tutor.id,
        timeSlot: slot.slotId,
      });

      alert("Booking created successfully!");
      navigateTo("bookings", null);
    } catch (err) {
      console.error(err);
      alert("Failed to create booking");
    } finally {
      setBookingSlotId(null);
    }
  };

  const availableSlots = slots.filter((slot) => slot.status === "available");

  return (
    <div className="space-y-10 pb-20">
      <button
        onClick={() => navigateTo("tutors", null)}
        className="flex items-center gap-3 text-text-muted hover:text-primary transition-all font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Tutors
      </button>

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="glass-card p-10 text-center space-y-5">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-36 h-36 rounded-[2rem] bg-white object-cover shadow-xl border-8 border-white mx-auto"
            referrerPolicy="no-referrer"
          />

          <h1 className="text-4xl font-black tracking-tight">{tutor.name}</h1>

          <p className="text-primary font-bold text-xs uppercase tracking-[0.25em]">
            {tutor.subjects.join(" • ")}
          </p>

          <p className="text-sm text-text-muted leading-relaxed max-w-2xl mx-auto italic">
            "{tutor.bio}"
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 text-primary rounded-2xl text-xs font-black uppercase tracking-widest">
            ${tutor.hourlyRate}/hr
          </div>
        </div>

        <div className="glass-card p-10 space-y-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Available Slots
            </h2>
            <p className="text-sm text-text-muted font-bold mt-1">
              Choose a slot and book directly.
            </p>
          </div>

          {loading ? (
            <p className="text-text-muted font-bold">Loading slots...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-text-muted font-bold">
              No available slots for this tutor.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {availableSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 rounded-3xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                      <Calendar size={24} />
                    </div>

                    <div>
                      <p className="font-black text-lg">
                        {slot.subject || "Tutoring Session"}
                      </p>
                      <p className="text-sm font-bold text-text-muted">
                        {slot.date} | {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-primary">
                      ${tutor.hourlyRate}
                    </span>

                    <button
                      onClick={() => handleBook(slot)}
                      disabled={bookingSlotId === slot.slotId}
                      className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 disabled:opacity-60"
                    >
                      {bookingSlotId === slot.slotId ? "Booking..." : "Book"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};