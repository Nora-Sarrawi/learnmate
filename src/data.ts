import { Tutor, Booking, Notification, Material } from './types';

export const mockUsers = [
  {
    id: 's1',
    name: 'Alex Johnson',
    email: 'student@example.com',
    password: 'password',
    role: 'student' as const,
    avatar: 'https://picsum.photos/seed/user/200/200'
  },
  {
    id: 't1',
    name: 'Dr. Sarah Wilson',
    email: 'tutor@example.com',
    password: 'password',
    role: 'tutor' as const,
    avatar: 'https://picsum.photos/seed/sarah/200/200'
  }
];

export const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.w@example.com',
    role: 'tutor',
    subjects: ['Advanced Mathematics', 'Physics', 'Quantum Mechanics'],
    bio: 'PhD in Theoretical Physics with 10 years of experience in simplifying complex concepts for undergraduates.',
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 45,
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    availability: [
      { id: 'ts1', day: 'Monday', start: '10:00', end: '11:00', isBooked: false },
      { id: 'ts2', day: 'Monday', start: '14:30', end: '15:30', isBooked: true },
      { id: 'ts3', day: 'Wednesday', start: '09:00', end: '10:00', isBooked: false },
    ]
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    email: 'marcus.c@example.com',
    role: 'tutor',
    subjects: ['Fullstack Development', 'React', 'Node.js'],
    bio: 'Senior Software Engineer specializing in modern web technologies and architectural patterns.',
    rating: 5.0,
    reviewCount: 89,
    hourlyRate: 60,
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    availability: [
       { id: 'ts4', day: 'Tuesday', start: '18:00', end: '19:00', isBooked: false },
       { id: 'ts5', day: 'Thursday', start: '18:00', end: '19:00', isBooked: false },
    ]
  },
  {
    id: 't3',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    role: 'tutor',
    subjects: ['UI/UX Design Systems', 'Visual Design', 'Figma'],
    bio: 'Award-winning product designer focused on creating accessible and delightful user experiences.',
    rating: 4.8,
    reviewCount: 210,
    hourlyRate: 55,
    avatar: 'https://picsum.photos/seed/elena/200/200',
    availability: [
      { id: 'ts6', day: 'Friday', start: '11:00', end: '12:00', isBooked: false },
    ]
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    studentId: 's1',
    tutorId: 't1',
    tutorName: 'Dr. Sarah Wilson',
    studentName: 'Alex Johnson',
    subject: 'Physics: Quantum Mechanics Intro',
    date: '2026-04-19',
    startTime: '14:30',
    endTime: '15:30',
    status: 'confirmed',
    notes: 'Please review the lecture notes ahead of time.',
    attachments: ['Quantum_Lecture_1.pdf']
  },
  {
    id: 'b2',
    studentId: 's1',
    tutorId: 't2',
    tutorName: 'Marcus Chen',
    studentName: 'Alex Johnson',
    subject: 'Fullstack Dev: Next.js API Routes',
    date: '2026-04-21',
    startTime: '18:00',
    endTime: '19:00',
    status: 'pending'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 's1',
    title: 'Payment Successful',
    message: 'Your invoice #2049 for Marcus Chen has been processed.',
    type: 'success',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'n2',
    userId: 's1',
    title: 'New File Shared',
    message: 'Elena Rodriguez shared "Design_Specs_v2.pdf".',
    type: 'info',
    timestamp: '5 hours ago',
    isRead: true
  }
];

export const mockMaterials: Material[] = [
  {
    id: 'm1',
    userId: 's1',
    name: 'Quantum_Lecture_1.pdf',
    uploadDate: '2026-04-18',
    tutorName: 'Dr. Sarah Wilson',
    subject: 'Physics',
    size: '2.4 MB',
    type: 'pdf'
  },
  {
    id: 'm2',
    userId: 's1',
    name: 'Design_Specs_v2.pdf',
    uploadDate: '2026-04-15',
    tutorName: 'Elena Rodriguez',
    subject: 'UI/UX Design',
    size: '5.1 MB',
    type: 'pdf'
  },
  {
    id: 'm3',
    userId: 's1',
    name: 'Math_Homework_W1.docx',
    uploadDate: '2026-04-10',
    tutorName: 'Dr. Sarah Wilson',
    subject: 'Mathematics',
    size: '1.2 MB',
    type: 'docx'
  }
];
