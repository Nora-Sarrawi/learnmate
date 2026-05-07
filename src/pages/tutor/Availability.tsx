import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Clock, Calendar, Loader2 } from "lucide-react";
import {
  AvailabilitySlot,
  createAvailability,
  deleteAvailability,
  getAvailability,
  updateAvailability,
} from "../../api";
import { getCurrentUserFromApi } from "../../authService";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getDayName(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export const Availability = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [currentTutorId, setCurrentTutorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    subject: "General",
  });

  const loadAvailability = async (tutorId: string) => {
    const data = await getAvailability(tutorId);
    setSlots(data);
  };

  useEffect(() => {
    async function initializeAvailability() {
      try {
        setLoading(true);
        setError("");

        const currentUser = await getCurrentUserFromApi();
        const tutorId = currentUser.userId;

        if (!tutorId) {
          throw new Error(
            "Tutor ID was not found in the current user profile.",
          );
        }

        setCurrentTutorId(tutorId);

        await loadAvailability(tutorId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load availability",
        );
      } finally {
        setLoading(false);
      }
    }

    initializeAvailability();
  }, []);

  const slotsByDay = useMemo(() => {
    return days.reduce<Record<string, AvailabilitySlot[]>>((acc, day) => {
      acc[day] = slots.filter((slot) => getDayName(slot.date) === day);
      return acc;
    }, {});
  }, [slots]);

  const resetForm = () => {
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      subject: "General",
    });
  };

  const handleOpenAddForm = () => {
    setError("");
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    resetForm();
    setShowAddForm(false);
    setError("");
  };

  const handleCreateSlot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentTutorId) {
      return;
    }

    if (!form.date || !form.startTime || !form.endTime) {
      setError("Please fill in the date, start time, and end time.");
      return;
    }

    if (form.endTime <= form.startTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createAvailability({
        tutorId: currentTutorId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        subject: form.subject.trim() || "General",
        status: "available",
      });

      await loadAvailability(currentTutorId);

      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add availability slot",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slot: AvailabilitySlot) => {
    if (!currentTutorId) {
      return;
    }

    const confirmed = window.confirm("Delete this availability slot?");
    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await deleteAvailability(slot.tutorId, slot.slotId);
      await loadAvailability(currentTutorId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete availability slot",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (slot: AvailabilitySlot) => {
    if (!currentTutorId) {
      return;
    }

    const nextStatus = slot.status === "available" ? "booked" : "available";

    try {
      setSaving(true);
      setError("");

      await updateAvailability(slot.tutorId, slot.slotId, {
        status: nextStatus,
      });

      await loadAvailability(currentTutorId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update availability slot",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Availability
          </h1>
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">
            Manage your teaching hours
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          disabled={saving || !currentTutorId}
          className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          Add Time Slot
        </button>
      </header>

      {error && (
        <div className="glass-card p-5 border border-error/20 text-error font-bold">
          {error}
        </div>
      )}

      {showAddForm && (
        <form
          onSubmit={handleCreateSlot}
          className="glass-card p-8 space-y-6 border border-gray-100"
        >
          <div>
            <h2 className="text-xl font-black tracking-tight mb-2">
              Add Availability Slot
            </h2>
            <p className="text-xs font-bold text-text-muted uppercase tracking-[0.25em]">
              Choose when students can book you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Start Time
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    startTime: event.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                End Time
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    endTime: event.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    subject: event.target.value,
                  }))
                }
                placeholder="General"
                className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelAdd}
              disabled={saving}
              className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-gray-50 transition-all disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !currentTutorId}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save Slot
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-text-muted font-bold">
          <Loader2 size={20} className="animate-spin" />
          Loading availability...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {days.map((day) => {
            const daySlots = slotsByDay[day] || [];

            return (
              <div
                key={day}
                className="glass-card p-8 space-y-8 border-t-4 border-gray-100 hover:border-primary transition-all group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tight">{day}</h3>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Calendar size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <div
                        key={slot.slotId}
                        className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group/slot hover:border-primary transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Clock size={16} className="text-primary" />
                          <div>
                            <span className="text-sm font-black font-mono">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                              {slot.subject || "General"} • {slot.status}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover/slot:opacity-100 transition-all">
                          <button
                            onClick={() => handleToggleStatus(slot)}
                            disabled={saving}
                            className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all"
                          >
                            {slot.status === "available"
                              ? "Mark Booked"
                              : "Mark Available"}
                          </button>

                          <button
                            onClick={() => handleDeleteSlot(slot)}
                            disabled={saving}
                            className="p-2 text-text-muted hover:text-error transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-center text-[10px] font-black uppercase tracking-widest text-text-muted bg-gray-50/20">
                      No slots defined
                    </div>
                  )}
                </div>

                <button
                  onClick={handleOpenAddForm}
                  disabled={saving || !currentTutorId}
                  className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Quick Add Slot
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
