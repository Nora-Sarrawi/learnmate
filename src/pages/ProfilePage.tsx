import React from 'react';
import { User, ShieldCheck, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfilePageProps {
  user: UserType | null;
  onLogout: () => void;
}

export const ProfilePage = ({ user, onLogout }: ProfilePageProps) => (
  <div className="max-w-4xl mx-auto space-y-12 pb-10">
    <header className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-10">
        <div className="relative">
          <img 
            src={user?.avatar || "https://picsum.photos/seed/user/200/200"} 
            alt={user?.name || "User"} 
            className="w-32 h-32 rounded-[2.5rem] bg-gray-100 object-cover shadow-2xl border-4 border-white"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{user?.name || 'Alex Johnson'}</h1>
          <p className="text-sm font-bold text-primary uppercase tracking-[0.3em]">{user?.role === 'tutor' ? 'Professional Instructor' : 'Senior Engineering Student'}</p>
          <div className="flex gap-4 mt-4">
            <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest shadow-sm">ID: {Math.floor(Math.random() * 90000) + 10000}</div>
            <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest shadow-sm">Joined June 2025</div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 px-6 py-3 bg-error/10 text-error rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-error hover:text-white transition-all active:scale-95"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </header>

    <div className="grid grid-cols-1 gap-10">
      <div className="glass-card p-10 space-y-8">
        <h3 className="text-lg font-bold flex items-center gap-3"><User size={20} className="text-primary" /> Personal Information</h3>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">Full Name</label>
            <p className="font-bold text-sm">{user?.name || 'Alex Johnson'}</p>
          </div>
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">Email Address</label>
            <p className="font-bold text-sm">{user?.email || 'alex.j@stustudy.edu'}</p>
          </div>
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">Phone</label>
            <p className="font-bold text-sm">+1 (555) 012-3492</p>
          </div>
        </div>
      </div>
    </div>

    <div className="glass-card p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-3"><ShieldCheck size={20} className="text-primary" /> Security</h3>
      </div>
      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">Password Management</p>
          <p className="text-xs text-text-muted mt-1 italic">Keep your account secure by updating your credentials regularly.</p>
        </div>
        <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary hover:text-primary transition-all">Change Password</button>
      </div>
    </div>
  </div>
);
