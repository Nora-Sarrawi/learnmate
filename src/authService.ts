import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
} from "aws-amplify/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export type TutorSignupData = {
  subjects?: string;
  bio?: string;
  hourlyRate?: string;
};

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "student" | "tutor",
  tutorData?: TutorSignupData
) {
  const userAttributes: Record<string, string> = {
    email,
    name,
    "custom:role": role,
  };

  if (role === "tutor") {
    userAttributes["custom:subjects"] =
      tutorData?.subjects || "General Tutoring";
    userAttributes["custom:bio"] =
      tutorData?.bio || "Experienced tutor ready to help students succeed.";
    userAttributes["custom:hourlyRate"] =
      tutorData?.hourlyRate || "25";
  }

  return signUp({
    username: email,
    password,
    options: { userAttributes },
  });
}

export async function confirmUser(email: string, code: string) {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
}

export async function loginUser(email: string, password: string) {
  return signIn({
    username: email,
    password,
  });
}

export async function logoutUser() {
  return signOut();
}

export async function getIdToken() {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
}

export async function getCurrentUserFromApi() {
  const token = await getIdToken();

  if (!token) {
    throw new Error("No ID token found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}