import React from 'react';
import logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  User,
  LogOut,
  Clock,
  Briefcase
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentPage: string;
  isSidebarOpen: boolean;
  navigateTo: (page: string) => void;
  user: UserType | null;
  onLogout: () => void;
}

export const Sidebar = ({ currentPage, isSidebarOpen, navigateTo, user, onLogout }: SidebarProps) => {
  const studentLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutors', label: 'Find Tutors', icon: Users },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tutorLinks = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'New Requests', icon: Briefcase },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'materials', label: 'Resources', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const links = user?.role === 'tutor' ? tutorLinks : studentLinks;

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
      <div className="flex flex-col h-full py-8">
        <div className="px-6 mb-10 flex items-center gap-3">


          {isSidebarOpen && (
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnMate
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${currentPage === item.id
                ? 'bg-primary-light text-primary font-black'
                : 'text-text-muted hover:bg-gray-50 hover:text-primary font-medium'
                }`}
            >
              <item.icon size={20} className={currentPage === item.id ? 'stroke-[2.5]' : ''} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              {currentPage === item.id && isSidebarOpen && <div className="ml-auto w-1 h-5 bg-primary rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div
            className="p-4 glass-card flex items-center gap-3 overflow-hidden"
          >
            <img
              src={user?.avatar || "https://picsum.photos/seed/user/100/100"}
              alt="User"
              className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name || 'Guest'}</p>
                <p className="text-[10px] font-black uppercase text-text-muted truncate tracking-widest">{user?.role} Account</p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={onLogout}
                className="p-2 text-text-muted hover:text-error transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
