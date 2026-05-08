import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tutor, User } from "./types";

import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

import { Dashboard } from "./pages/Dashboard";
import { TutorsList } from "./pages/TutorsList";
import { TutorProfile } from "./pages/TutorProfile";
import { BookingPage } from "./pages/BookingPage";
import { MyBookings } from "./pages/MyBookings";
import { MaterialsPage } from "./pages/MaterialsPage";
import { ProfilePage } from "./pages/ProfilePage";

import { TutorDashboard } from "./pages/tutor/TutorDashboard";
import { BookingRequests } from "./pages/tutor/BookingRequests";
import { Availability } from "./pages/tutor/Availability";

import { logoutUser, getCurrentUserFromApi } from "./authService";

type AuthView = "landing" | "login" | "signup";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>("landing");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const apiUser = await getCurrentUserFromApi();

        setUser({
          id: apiUser.userId,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role,
        } as User);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage("dashboard");
    setSelectedTutor(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setCurrentPage("dashboard");
      setSelectedTutor(null);
      setAuthView("landing");
    }
  };

  const stats = [
    {
      label: "Upcoming Sessions",
      value: "4",
      trend: "↑ 2 from last week",
      trendColor: "text-success",
    },
    {
      label: "Learning Hours",
      value: "24.5h",
      trend: "Across 4 subjects",
      trendColor: "text-text-muted",
    },
    {
      label: "Active Tutors",
      value: "3",
      trend: "Mathematics, Physics, UI",
      trendColor: "text-text-muted",
    },
  ];

  const navigateTo = (page: string, tutor: Tutor | null = null) => {
    setCurrentPage(page);
    setSelectedTutor(tutor);

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const renderView = () => {
    if (!user) return null;

    if (user.role === "tutor") {
      switch (currentPage) {
        case "dashboard":
          return <TutorDashboard stats={stats} navigateTo={navigateTo} />;
        case "requests":
          return <BookingRequests />;
        case "availability":
          return <Availability />;
        case "materials":
          return <MaterialsPage role={user.role} />;
        case "profile":
          return <ProfilePage user={user} onLogout={handleLogout} />;
        case "tutorProfile":
          return selectedTutor ? (
            <TutorProfile tutor={selectedTutor} navigateTo={navigateTo} />
          ) : (
            <TutorsList navigateTo={navigateTo} />
          );
        default:
          return <TutorDashboard stats={stats} navigateTo={navigateTo} />;
      }
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard stats={stats} navigateTo={navigateTo} />;

      case "tutors":
        return <TutorsList navigateTo={navigateTo} />;

      case "tutorProfile":
        return selectedTutor ? (
          <TutorProfile tutor={selectedTutor} navigateTo={navigateTo} />
        ) : (
          <TutorsList navigateTo={navigateTo} />
        );

      case "profile":
        return <ProfilePage user={user} onLogout={handleLogout} />;

      case "booking":
        return selectedTutor ? (
          <BookingPage tutor={selectedTutor} navigateTo={navigateTo} />
        ) : (
          <TutorsList navigateTo={navigateTo} />
        );

      case "bookings":
        return <MyBookings navigateTo={navigateTo} />;

      case "materials":
        return <MaterialsPage role={user.role} />;

      default:
        return <Dashboard stats={stats} navigateTo={navigateTo} />;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-sm font-black uppercase tracking-widest text-text-muted">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    if (authView === "login") {
      return <LoginPage setView={setAuthView} onLogin={handleLoginSuccess} />;
    }

    if (authView === "signup") {
      return <SignupPage setView={setAuthView} />;
    }

    return <LandingPage setView={setAuthView} />;
  }

  return (
    <div className="min-h-screen bg-bg selection:bg-primary/10 selection:text-primary transition-colors duration-300">
      <Sidebar
        currentPage={currentPage}
        isSidebarOpen={isSidebarOpen}
        navigateTo={navigateTo}
        user={user}
        onLogout={handleLogout}
      />

      <main
        className={`transition-all duration-500 min-h-screen pt-4 pb-32 lg:pb-20 ${
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          <nav className="flex justify-end mb-10 gap-6 items-center">
            <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                Spring Session 2026
              </span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              <Plus
                className={`transform transition-transform duration-500 ${
                  isSidebarOpen ? "rotate-45" : ""
                }`}
              />
            </button>
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (selectedTutor?.id || "")}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        role={user.role}
      />
    </div>
  );
}