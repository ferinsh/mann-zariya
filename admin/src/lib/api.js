import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;

export async function adminFetch(endpoint, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const headers = {
    Authorization: `Bearer ${session.access_token}`,
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return response;
}