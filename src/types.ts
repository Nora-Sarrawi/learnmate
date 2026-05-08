export type UserRole = 'student' | 'tutor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
  avatar?: string;
  subjects?: string | string[];
  bio?: string;
  hourlyRate?: number;
}

export interface Tutor {
  id: string;
  name: string;
  email?: string;
  role: "tutor";
  avatar: string;
  subjects: string[];
  bio: string;
  hourlyRate: number;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface Material {
  id: string;
  userId: string;
  name: string;
  uploadDate: string;
  tutorName: string;
  subject: string;
  size: string;
  type: string;
}
