import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, FileText, Download, Trash2, Loader2 } from "lucide-react";
import { UserRole } from "../types";
import {
  deleteMaterial,
  getMaterialUploadUrl,
  getMaterials,
  MaterialFile,
  uploadFileToS3,
} from "../api";
import { getCurrentUserFromApi } from "../authService";
import { getMyBookings } from "../bookingService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface MaterialsPageProps {
  role: UserRole;
  tutorId?: string;
}

type MaterialWithTutor = MaterialFile & {
  tutorId?: string;
  tutorName?: string;
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString();
}

async function getTutorsMap() {
  const response = await fetch(`${API_BASE_URL}/auth/tutors`);

  if (!response.ok) {
    return {};
  }

  const data = await response.json();
  const tutors = data.tutors || [];

  return tutors.reduce((acc: Record<string, string>, tutor: any) => {
    acc[tutor.userId] = tutor.name || tutor.email || tutor.userId;
    return acc;
  }, {});
}

export const MaterialsPage = ({
  role,
  tutorId: providedTutorId,
}: MaterialsPageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [materials, setMaterials] = useState<MaterialWithTutor[]>([]);
  const [currentTutorId, setCurrentTutorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadTutorMaterials = async (targetTutorId: string) => {
    const files = await getMaterials(targetTutorId);
    setMaterials(files.map((file) => ({ ...file, tutorId: targetTutorId })));
  };

  const loadStudentMaterials = async () => {
    const bookingsResponse = await getMyBookings();
    const bookings = bookingsResponse.bookings || bookingsResponse.items || [];

    const activeBookings = bookings.filter(
      (booking: any) =>
        booking.status === "confirmed" || booking.status === "pending"
    );

    const uniqueTutorIds = Array.from(
      new Set(activeBookings.map((booking: any) => booking.tutorId))
    ).filter(Boolean) as string[];

    if (uniqueTutorIds.length === 0) {
      setMaterials([]);
      return;
    }

    const tutorsMap = await getTutorsMap();

    const allMaterials = await Promise.all(
      uniqueTutorIds.map(async (tutorId) => {
        const files = await getMaterials(tutorId);

        return files.map((file) => ({
          ...file,
          tutorId,
          tutorName: tutorsMap[tutorId] || tutorId,
        }));
      })
    );

    setMaterials(allMaterials.flat());
  };

  useEffect(() => {
    async function initializeMaterials() {
      try {
        setLoading(true);
        setError("");

        if (providedTutorId) {
          setCurrentTutorId(providedTutorId);
          await loadTutorMaterials(providedTutorId);
          return;
        }

        if (role === "tutor") {
          const currentUser = await getCurrentUserFromApi();
          const tutorId = currentUser.userId;

          if (!tutorId) {
            throw new Error("Tutor ID was not found in the current user profile.");
          }

          setCurrentTutorId(tutorId);
          await loadTutorMaterials(tutorId);
          return;
        }

        await loadStudentMaterials();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load materials");
      } finally {
        setLoading(false);
      }
    }

    initializeMaterials();
  }, [role, providedTutorId]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !currentTutorId) return;

    try {
      setUploading(true);
      setError("");

      const uploadInfo = await getMaterialUploadUrl({
        tutorId: currentTutorId,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      });

      await uploadFileToS3(uploadInfo.uploadUrl, file);
      await loadTutorMaterials(currentTutorId);

      event.target.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload material");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (file: MaterialFile) => {
    window.open(file.downloadUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (key: string) => {
    if (!currentTutorId) return;

    const confirmed = window.confirm("Delete this material?");
    if (!confirmed) return;

    try {
      setDeletingKey(key);
      setError("");

      await deleteMaterial(key);
      await loadTutorMaterials(currentTutorId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete material");
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Study Materials
          </h1>
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.3em]">
            Your digital library
          </p>
        </div>

        {role === "tutor" && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelected}
            />

            <button
              onClick={handleUploadClick}
              disabled={uploading || !currentTutorId}
              className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              {uploading ? "Uploading..." : "Upload Material"}
            </button>
          </>
        )}
      </header>

      {error && (
        <div className="glass-card p-5 border border-error/20 text-error font-bold">
          {error}
        </div>
      )}

      {role !== "tutor" && (
        <div className="glass-card p-8 text-sm font-bold text-text-muted">
          Materials shown here belong to tutors you have booked sessions with.
        </div>
      )}

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-text-muted font-bold">
          <Loader2 size={20} className="animate-spin" />
          Loading materials...
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm font-black uppercase tracking-widest text-text-muted">
          No materials uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((file) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={file.key}
              className="glass-card p-8 group border-b-4 border-transparent hover:border-primary transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-text-muted hover:text-primary bg-gray-50 rounded-lg transition-all shadow-sm"
                    title="Download material"
                  >
                    <Download size={18} />
                  </button>

                  {role === "tutor" && (
                    <button
                      onClick={() => handleDelete(file.key)}
                      disabled={deletingKey === file.key}
                      className="p-2 text-text-muted hover:text-error bg-gray-50 rounded-lg transition-all shadow-sm disabled:opacity-60"
                      title="Delete material"
                    >
                      {deletingKey === file.key ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {file.fileName}
              </h3>

              {file.tutorName && (
                <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-3">
                  Tutor: {file.tutorName}
                </p>
              )}

              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">
                Material
              </p>

              <div className="pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    Uploaded
                  </span>
                  <span className="text-xs font-bold">
                    {formatDate(file.lastModified)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    Size
                  </span>
                  <span className="text-xs font-bold text-text-muted">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};