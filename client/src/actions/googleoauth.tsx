"use server";

import { cookies } from "next/headers";

export const handleGoogleRedirect = async (code: string) => {
  console.log("Google OAuth code:", code);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${code}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { token } = await response.json();
    const isNewUser = response.status === 201;

    cookies().set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
    });

    return { success: true, newUser: isNewUser };
  } catch (error) {
    console.error("Google OAuth error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
};
