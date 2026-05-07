import { getIdToken } from "./authService";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  availability: "/tutors/availability",
  materials: "/tutors/materials",
  materialUploadUrl: "/tutors/materials/upload-url",
};

export type AvailabilitySlot = {
  tutorId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  subject?: string;
  createdBy?: string;
};

export type MaterialFile = {
  key: string;
  fileName: string;
  size: number;
  lastModified: string;
  downloadUrl: string;
  expiresInSeconds: number;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();

  if (!token) {
    throw new Error("No ID token found. Please login again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAvailability(tutorId: string) {
  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.availability}?tutorId=${encodeURIComponent(tutorId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load availability");
  }

  const data = await response.json();
  return data.items as AvailabilitySlot[];
}

export async function createAvailability(slot: {
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject?: string;
  status?: string;
}) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${API_PATHS.availability}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(slot),
  });

  if (!response.ok) {
    throw new Error("Failed to create availability slot");
  }

  return response.json();
}

export async function updateAvailability(
  tutorId: string,
  slotId: string,
  updates: Partial<AvailabilitySlot>,
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.availability}/${encodeURIComponent(tutorId)}/${encodeURIComponent(slotId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update availability slot");
  }

  return response.json();
}

export async function deleteAvailability(tutorId: string, slotId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.availability}/${encodeURIComponent(tutorId)}/${encodeURIComponent(slotId)}`,
    {
      method: "DELETE",
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete availability slot");
  }

  return response.json();
}

export async function getMaterials(tutorId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.materials}?tutorId=${encodeURIComponent(tutorId)}`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load materials");
  }

  const data = await response.json();
  return data.items as MaterialFile[];
}

export async function getMaterialUploadUrl(params: {
  tutorId: string;
  fileName: string;
  contentType: string;
}) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.materialUploadUrl}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(params),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to generate upload URL");
  }

  return response.json() as Promise<{
    message: string;
    uploadUrl: string;
    key: string;
    expiresInSeconds: number;
  }>;
}

export async function uploadFileToS3(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
}

export async function deleteMaterial(key: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}${API_PATHS.materials}?key=${encodeURIComponent(key)}`,
    {
      method: "DELETE",
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete material");
  }

  return response.json();
}
