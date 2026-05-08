import { getIdToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getIdToken();

    if (!token) {
        throw new Error("No ID token found. Please login again.");
    }

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

// ======================
// CREATE BOOKING
// ======================
export async function createBooking(data: {
    tutorId: string;
    timeSlot: string;
}) {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/students/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create booking");
    }

    return response.json();
}

// ======================
// GET MY BOOKINGS
// ======================
export async function getMyBookings() {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/students/bookings`, {
        method: "GET",
        headers,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
}

// ======================
// CANCEL BOOKING
// ======================
export async function cancelBooking(bookingId: string) {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/students/bookings`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
        throw new Error("Failed to cancel booking");
    }

    return response.json();
}