import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, FileText } from 'lucide-react';
import { mockBookings, mockMaterials } from '../data';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardProps {
  stats: any[];
  navigateTo: (page: string) => void;
}

export const Dashboard = ({ stats, navigateTo }: DashboardProps) => (
  <div className="space-y-8">
    <header className="flex flex-wrap justify-between items-end gap-4">
      <div>
        <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Welcome back, Alex!</p>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigateTo('tutors')} className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Find Tutors</button>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6 border-b-2 border-transparent hover:border-primary transition-all cursor-default"
        >
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className={`text-xs mt-2 font-medium ${stat.trendColor}`}>{stat.trend}</p>
        </motion.div>
      ))}
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Upcoming Sessions</h2>
            <button onClick={() => navigateTo('bookings')} className="text-primary text-sm font-bold hover:underline">View Schedule</button>
          </div>
          <div className="space-y-4">
            {mockBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 3).map((booking) => (
              <div key={booking.id} className="glass-card p-5 flex items-center border-l-4 border-primary">
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{booking.subject}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{booking.tutorName} • {booking.date} at {booking.startTime}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {mockBookings.filter(b => b.status === 'completed').slice(0, 2).map((booking) => (
              <div key={booking.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Session Completed</p>
                  <p className="text-[10px] text-text-muted">{booking.subject} with {booking.tutorName}</p>
                </div>
                <span className="text-[10px] text-gray-400">Yesterday</span>
              </div>
            ))}
            {mockMaterials.slice(0, 2).map((file) => (
              <div key={file.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">New Material Uploaded</p>
                  <p className="text-[10px] text-text-muted">{file.name}</p>
                </div>
                <span className="text-[10px] text-gray-400">{file.uploadDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-10 bg-gray-900 text-white border-none relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="max-w-xl space-y-4 relative z-10">
          <h3 className="text-2xl font-black tracking-tight">Daily Study Tip</h3>
          <p className="text-sm text-white/70 leading-relaxed font-medium">Review your Quantum Physics notes at least 30 minutes before Dr. Wilson's session today. Active recall is 3x more effective than passive reading for high-complexity topics.</p>
          <button onClick={() => navigateTo('materials')} className="text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Go to Library →</button>
        </div>
      </div>
  </div>
);
