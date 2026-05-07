import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, History } from 'lucide-react';
import { mockBookings } from '../data';
import { StatusBadge } from '../components/StatusBadge';

interface MyBookingsProps {
  navigateTo: (page: string) => void;
}

export const MyBookings = ({ navigateTo }: MyBookingsProps) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const filteredBookings = mockBookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    return b.status === activeTab;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Sessions</h1>
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">Tracking your growth path</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border border-gray-200 shadow-sm shrink-0">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg' : 'text-text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={booking.id} 
            className="glass-card p-10 flex flex-col xl:flex-row gap-10 items-center hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-primary group"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
              <Calendar size={40} />
            </div>
            <div className="flex-1 text-center xl:text-left space-y-2">
              <div className="flex flex-wrap justify-center xl:justify-start items-center gap-4">
                <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{booking.subject}</h3>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-sm font-bold flex items-center justify-center xl:justify-start gap-3 text-text-muted uppercase tracking-widest">
                <Clock size={16} className="text-primary" /> {booking.date} <span className="opacity-30">|</span> {booking.startTime} - {booking.endTime}
              </p>
              <div className="flex items-center justify-center xl:justify-start gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <p className="text-sm font-bold">Mentored by <span className="text-primary underline underline-offset-4 decoration-2 decoration-primary/20">{booking.tutorName}</span></p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full xl:w-auto">
              {booking.status === 'confirmed' && (
                <button className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">Join Call</button>
              )}
              {booking.status === 'pending' || booking.status === 'confirmed' ? (
                <>
                  <button className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl text-xs font-black text-text-muted hover:border-primary hover:text-primary uppercase tracking-[0.2em] bg-white transition-all">Reschedule</button>
                  <button className="w-full sm:w-auto px-10 py-4 border-2 border-transparent hover:border-error hover:text-error rounded-2xl text-xs font-black text-text-muted uppercase tracking-[0.2em] transition-all">Cancel</button>
                </>
              ) : (
                 <button className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl text-xs font-black text-text-muted hover:border-primary hover:text-primary uppercase tracking-[0.2em] bg-white transition-all">Rebook Tutor</button>
              )}
            </div>
          </motion.div>
        )) : (
          <div className="glass-card p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <History size={40} />
            </div>
            <p className="text-text-muted font-bold">No sessions found for this category.</p>
            <button 
              onClick={() => navigateTo('tutors')}
              className="text-primary font-bold hover:underline"
            >
              Find a mentor now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
