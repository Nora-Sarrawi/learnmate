import React from 'react';
import { Check, X, Clock, Calendar, User, MessageCircle } from 'lucide-react';
import { mockBookings } from '../../data';

export const BookingRequests = () => {
  const pendingRequests = mockBookings.filter(b => b.status === 'pending');

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Booking Requests</h1>
        <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">Review and accept new students</p>
      </header>

      <div className="space-y-6">
        {pendingRequests.length > 0 ? pendingRequests.map((req) => (
          <div key={req.id} className="glass-card p-10 flex flex-col xl:flex-row gap-10 items-center hover:shadow-2xl transition-all group border-l-8 border-amber-500">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
              <User size={40} />
            </div>
            
            <div className="flex-1 space-y-4 text-center xl:text-left">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{req.studentName}</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{req.subject}</p>
              </div>
              
              <div className="flex flex-wrap justify-center xl:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2 text-text-muted font-bold text-xs uppercase tracking-widest">
                  <Calendar size={14} className="text-primary" /> {req.date}
                </div>
                <div className="flex items-center gap-2 text-text-muted font-bold text-xs uppercase tracking-widest">
                  <Clock size={14} className="text-primary" /> {req.startTime} - {req.endTime}
                </div>
              </div>

              {req.notes && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-xs text-text-muted leading-relaxed">
                  "{req.notes}"
                </div>
              )}
            </div>

            <div className="flex gap-4 shrink-0 w-full xl:w-auto">
               <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-success text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-success/20 hover:shadow-success/40 transition-all hover:-translate-y-1">
                 <Check size={18} /> Accept
               </button>
               <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-100 text-text-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-error hover:text-error transition-all">
                 <X size={18} /> Decline
               </button>
               <button className="p-4 bg-indigo-50 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all">
                 <MessageCircle size={20} />
               </button>
            </div>
          </div>
        )) : (
          <div className="glass-card p-20 text-center space-y-4 opacity-60">
             <Clock size={48} className="mx-auto text-gray-300" />
             <p className="font-bold text-text-muted">No pending requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
