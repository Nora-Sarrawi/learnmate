import React from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';

export const Availability = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Availability</h1>
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">Manage your teaching hours</p>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
          <Plus size={20} /> Add Time Slot
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {days.map((day, dayIndex) => (
          <div key={day} className="glass-card p-8 space-y-8 border-t-4 border-gray-100 hover:border-primary transition-all group">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight">{day}</h3>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Calendar size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {dayIndex % 2 === 0 ? (
                <>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group/slot hover:border-primary transition-all">
                    <div className="flex items-center gap-4">
                      <Clock size={16} className="text-primary" />
                      <span className="text-sm font-black font-mono">09:00 - 10:30</span>
                    </div>
                    <button className="p-2 text-text-muted hover:text-error opacity-0 group-hover/slot:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group/slot hover:border-primary transition-all">
                    <div className="flex items-center gap-4">
                      <Clock size={16} className="text-primary" />
                      <span className="text-sm font-black font-mono">14:00 - 15:30</span>
                    </div>
                    <button className="p-2 text-text-muted hover:text-error opacity-0 group-hover/slot:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-center text-[10px] font-black uppercase tracking-widest text-text-muted bg-gray-50/20">
                  No slots defined
                </div>
              )}
            </div>

            {dayIndex % 2 === 0 && (
              <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-primary hover:text-primary transition-all">
                Quick Add Slot
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
