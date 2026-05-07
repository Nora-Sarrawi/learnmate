import React from 'react';
import { ArrowLeft, Star, ChevronRight, Plus } from 'lucide-react';
import { Tutor } from '../types';

interface TutorProfileProps {
  tutor: Tutor;
  navigateTo: (page: string, tutor: Tutor | null) => void;
}

export const TutorProfile = ({ tutor, navigateTo }: TutorProfileProps) => (
  <div className="space-y-10 pb-20">
    <button 
      onClick={() => navigateTo('tutors', null)}
      className="flex items-center gap-3 text-text-muted hover:text-primary transition-all font-bold text-sm uppercase tracking-widest group"
    >
      <div className="p-1.5 bg-white rounded-lg border border-gray-200 group-hover:border-primary transition-all"><ArrowLeft size={16} /></div> 
      Back to Directory
    </button>

    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img 
            src={tutor.avatar} 
            alt={tutor.name} 
            className="w-48 h-48 md:w-56 md:h-56 rounded-[3rem] bg-white object-cover shadow-2xl border-8 border-white relative z-10 mx-auto transition-transform hover:scale-105 duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">{tutor.name}</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-4 py-1.5 rounded-full text-sm shadow-sm border border-amber-100">
              <Star size={16} fill="currentColor" /> {tutor.rating}
            </div>
            <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] py-1 border-l-2 border-gray-200 pl-4">
               {tutor.subjects.join(' • ')}
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-2xl mx-auto italic">
          "{tutor.bio}"
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 z-20">
          Booking Details
        </div>
        
        <div className="glass-card p-8 md:p-12 border-2 border-primary/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div className="text-center md:text-left space-y-4">
              <span className="text-[10px] text-text-muted uppercase font-black tracking-[0.3em]">Premium Rate</span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-6xl font-black tabular-nums tracking-tighter text-text-main">${tutor.hourlyRate}</span>
                <span className="text-sm font-bold text-primary uppercase tracking-tighter">/ Session</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-[10px] text-text-muted uppercase font-black tracking-[0.3em]">Instructor Status</span>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/5 text-success rounded-2xl text-[11px] font-black uppercase tracking-widest border border-success/10 shadow-sm">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-ping" />
                Active & Available
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Available Slots</h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tutor.availability.map((slot) => (
                <button 
                  key={slot.id}
                  disabled={slot.isBooked}
                  onClick={() => navigateTo('booking', tutor)}
                  className={`flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all group relative overflow-hidden ${
                    slot.isBooked 
                      ? 'bg-gray-50 border-gray-100 text-gray-300 opacity-40 cursor-not-allowed' 
                      : 'border-transparent bg-gray-50/50 hover:bg-white hover:border-primary hover:shadow-xl text-text-main'
                  }`}
                >
                  <div className="text-left font-bold relative z-10">
                    <p className="text-[9px] text-text-muted uppercase tracking-widest mb-1">{slot.day}</p>
                    <p className="text-sm font-mono tracking-tight">{slot.start} - {slot.end}</p>
                  </div>
                  {slot.isBooked ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-full text-white">Full</span>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <Plus size={18} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-6 flex flex-col items-center gap-6">
              <button 
                onClick={() => navigateTo('booking', tutor)}
                className="w-full max-w-sm bg-primary text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                Secure This Tutor <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-text-muted">
                <span>Instant confirmation</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Verified Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
