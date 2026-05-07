import React from 'react';
import { LayoutDashboard, Users, Calendar, BookOpen, User, Clock, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface MobileNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  role: UserRole;
}

export const MobileNav = ({ currentPage, setCurrentPage, role }: MobileNavProps) => {
  const studentLinks = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'tutors', icon: Users },
    { id: 'bookings', icon: Calendar },
    { id: 'materials', icon: BookOpen },
    { id: 'profile', icon: User },
  ];

  const tutorLinks = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'requests', icon: Briefcase },
    { id: 'availability', icon: Clock },
    { id: 'materials', icon: BookOpen },
    { id: 'profile', icon: User },
  ];

  const links = role === 'tutor' ? tutorLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center lg:hidden z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {links.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          className={`p-3 rounded-2xl transition-all active:scale-75 ${
            currentPage === item.id 
              ? 'text-primary bg-primary-light scale-110 shadow-lg shadow-primary/10' 
              : 'text-text-muted hover:text-primary'
          }`}
        >
          <item.icon size={22} className={currentPage === item.id ? 'stroke-[2.5]' : ''} />
        </button>
      ))}
    </nav>
  );
};
