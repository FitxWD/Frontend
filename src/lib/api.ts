import { auth } from "@/lib/firebase";

export async function apiFetch(path: string, init?: RequestInit) {
  const u = auth.currentUser;
  const token = u ? await u.getIdToken() : null;

  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
}