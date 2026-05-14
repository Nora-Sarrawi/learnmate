import React from "react";
import { motion } from "motion/react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

interface LandingPageProps {
  setView: (view: "landing" | "login" | "signup") => void;
}

export const LandingPage = ({ setView }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
            ◈
          </div>
          <span className="text-2xl font-black text-primary tracking-tighter">
            LearnMate
          </span>
        </div>

        <button
          onClick={() => setView("login")}
          className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        <section className="text-center space-y-8 max-w-4xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]"
          >
            Reimagining Online Education
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Expert guidance for{" "}
            <span className="text-primary italic">ambitious</span> students.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Connect with world-class tutors from leading universities.
            Personalized 1-on-1 sessions designed to help you master any subject.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 pt-6"
          >
            <button
              onClick={() => setView("signup")}
              className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Get Started Now
            </button>

            <button
              onClick={() => setView("login")}
              className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-xl shadow-black/5"
            >
              Sign In
            </button>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              icon: Star,
              title: "Expert Tutors",
              desc: "Every mentor is vetted for academic excellence and teaching performance.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Results",
              desc: "Our students consistently report higher grades and better understanding.",
            },
            {
              icon: CheckCircle2,
              title: "Flexible Learning",
              desc: "Book sessions anytime. Reschedule with ease. Learn on your terms.",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="glass-card p-10 space-y-4 hover:border-primary transition-colors cursor-default"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <feat.icon size={24} />
              </div>
              <h3 className="text-xl font-bold">{feat.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-primary rounded-[3rem] p-16 text-white text-center space-y-6 relative overflow-hidden shadow-2xl shadow-primary/30 mt-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-[120px]" />
          <h2 className="text-4xl font-black tracking-tight relative z-10">
            Ready to start your journey?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto relative z-10 font-medium">
            Join thousands of students achieving their goals with LearnMate.
          </p>
          <div className="relative z-10 pt-4">
            <button
              onClick={() => setView("signup")}
              className="bg-white text-primary px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Create Your Account
            </button>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-100 mt-20">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">
            ◈
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
            © 2026 LearnMate Global INC
          </p>
        </div>
      </footer>
    </div>
  );
};