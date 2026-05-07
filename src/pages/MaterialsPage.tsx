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

interface MaterialsPageProps {
  role: UserRole;
  tutorId?: string;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString();
}

export const MaterialsPage = ({
  role,
  tutorId: providedTutorId,
}: MaterialsPageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [materials, setMaterials] = useState<MaterialFile[]>([]);
  const [currentTutorId, setCurrentTutorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadMaterials = async (targetTutorId: string) => {
    const files = await getMaterials(targetTutorId);
    setMaterials(files);
  };

  useEffect(() => {
    async function initializeMaterials() {
      try {
        setLoading(true);
        setError("");

        if (providedTutorId) {
          setCurrentTutorId(providedTutorId);
          await loadMaterials(providedTutorId);
          return;
        }
        const currentUser = await getCurrentUserFromApi();
        const tutorId = currentUser.userId;

        if (role === "tutor") {
          if (!tutorId) {
            throw new Error(
              "Tutor ID was not found in the current user profile.",
            );
          }

          setCurrentTutorId(tutorId);
          await loadMaterials(tutorId);
          return;
        }

        setCurrentTutorId(null);
        setMaterials([]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load materials",
        );
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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !currentTutorId) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploadInfo = await getMaterialUploadUrl({
        tutorId: currentTutorId,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      });

      await uploadFileToS3(uploadInfo.uploadUrl, file);
      await loadMaterials(currentTutorId);

      event.target.value = "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload material",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (file: MaterialFile) => {
    window.open(file.downloadUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (key: string) => {
    if (!currentTutorId) {
      return;
    }

    const confirmed = window.confirm("Delete this material?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingKey(key);
      setError("");

      await deleteMaterial(key);
      await loadMaterials(currentTutorId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete material",
      );
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

      {role !== "tutor" && !providedTutorId && (
        <div className="glass-card p-8 text-sm font-bold text-text-muted">
          Materials are shown when a tutor or session is selected.
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
