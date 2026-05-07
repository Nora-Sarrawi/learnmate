import React from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import { mockMaterials } from '../data';
import { UserRole } from '../types';

interface MaterialsPageProps {
  role: UserRole;
}

export const MaterialsPage = ({ role }: MaterialsPageProps) => (
  <div className="space-y-10">
    <header className="flex flex-wrap justify-between items-center gap-6">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Study Materials</h1>
        <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">Your digital library</p>
      </div>
      {role === 'tutor' && (
        <button className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Upload size={20} /> Upload Material
        </button>
      )}
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockMaterials.map((file) => (
        <motion.div 
          whileHover={{ y: -5 }}
          key={file.id} 
          className="glass-card p-8 group border-b-4 border-transparent hover:border-primary transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-text-muted hover:text-primary bg-gray-50 rounded-lg transition-all shadow-sm"><Download size={18} /></button>
              <button className="p-2 text-text-muted hover:text-error bg-gray-50 rounded-lg transition-all shadow-sm"><Trash2 size={18} /></button>
            </div>
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{file.name}</h3>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">{file.subject}</p>
          <div className="pt-6 border-t border-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Tutor</span>
              <span className="text-xs font-bold">{file.tutorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Uploaded</span>
              <span className="text-xs font-bold">{file.uploadDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Size</span>
              <span className="text-xs font-bold text-text-muted">{file.size}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
