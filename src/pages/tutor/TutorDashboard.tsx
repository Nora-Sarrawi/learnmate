import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockBookings } from '../../data';
import { StatusBadge } from '../../components/StatusBadge';

interface TutorDashboardProps {
  stats: any[];
  navigateTo: (page: string) => void;
}

export const TutorDashboard = ({ stats, navigateTo }: TutorDashboardProps) => {
  // Tutor specific stats
  const tutorStats = [
    { label: "Today's Sessions", value: '2', icon: Clock, color: 'text-primary' },
    { label: "Pending Requests", value: '5', icon: AlertCircle, color: 'text-amber-500' },
    { label: "Active Students", value: '18', icon: Users, color: 'text-indigo-500' },
    { label: "Month Earnings", value: '$2,450', icon: DollarSign, color: 'text-success' },
  ];

  const pendingRequests = mockBookings.filter(b => b.status === 'pending');
  const upcomingSessions = mockBookings.filter(b => b.status === 'confirmed').slice(0, 3);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Tutor Command Center</p>
        <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutorStats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 border-b-4 border-transparent hover:border-primary transition-all group"
          >
            <div className={`p-3 rounded-2xl bg-gray-50 w-fit mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight">Upcoming Sessions</h2>
            <button onClick={() => navigateTo('sessions')} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Full Schedule</button>
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="glass-card p-6 flex items-center justify-between border-l-4 border-primary">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{session.subject}</h3>
                    <p className="text-xs text-text-muted mt-1">Student: <span className="font-bold text-text-main">{session.studentName}</span> • {session.date} at {session.startTime}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                   <StatusBadge status={session.status} />
                   <button className="px-5 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg shadow-primary/20 transition-all">Join Room</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <h2 className="text-2xl font-black tracking-tight">Recent Feedback</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="glass-card p-8 bg-gray-50/50 border-none italic space-y-4">
                 <div className="flex text-amber-500 gap-1"><Clock size={12}/><Clock size={12}/><Clock size={12}/><Clock size={12}/><Clock size={12}/></div>
                 <p className="text-sm text-text-muted font-medium">"Explained the complexity of Quantum mechanics in a way that finally clicked for me. Highly recommended!"</p>
                 <p className="text-[10px] font-black uppercase tracking-widest">- Alex J., Computer Science</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="flex justify-between items-center">
             <h2 className="text-2xl font-black tracking-tight">Today</h2>
           </div>
           <div className="glass-card bg-primary p-8 text-white space-y-10 relative overflow-hidden shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Success Rate</p>
                <p className="text-5xl font-black tabular-nums tracking-tighter">98%</p>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-4">
                  <div className="w-[98%] h-full bg-white" />
                </div>
              </div>
              
              <div className="space-y-4 pt-10 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Pending Reviews</p>
                <div className="space-y-3">
                  {pendingRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="flex items-center justify-between text-xs font-bold">
                       <span>{req.studentName}</span>
                       <span className="opacity-60 text-[10px]">{req.subject}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigateTo('requests')}
                  className="w-full py-4 mt-6 bg-white text-primary rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                >
                  Manage Requests
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
