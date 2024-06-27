// File: app/actions/auth.ts
"use server";

import { z } from "zod";
import { cookies } from 'next/headers';

const AuthCredentialsValidator = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|//<>]/,
      "Password must contain at least one special character"
    ),
});

export async function loginUser(
  data: z.infer<typeof AuthCredentialsValidator>
) {
  const validatedFields = AuthCredentialsValidator.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { error: "Backend URL is not configured" };
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
    if (response.ok) {
      const { token } = await response.json();
      console.log("token", token);
      cookies().set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development'
      });
      return { success: true };
    } else {
      const errorData = await response.json();
      return { error: errorData.error || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}