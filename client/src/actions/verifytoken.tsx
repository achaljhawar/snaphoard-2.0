"use server";

import { cookies } from "next/headers";

export async function verifyToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  
  if (!token) {
    return { error: "No token found" };
  }
  console.log(token);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

  try {
    const response = await fetch(`${backendUrl}/api/auth/checkauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { error: data.error || "Token verification failed" };
    }
  } catch (error) {
    console.error("Verify token error:", error);
    return { error: "An unexpected error occurred" };
  }
}