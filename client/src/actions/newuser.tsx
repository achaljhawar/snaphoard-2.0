"use server";
import { z } from "zod";
import { cookies } from "next/headers";

const NewUserValidator = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  role: z.enum(["Viewer", "Poster"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

export async function newUser(data: z.infer<typeof NewUserValidator>) {
  const validatedFields = NewUserValidator.safeParse(data);
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "No token found" };
  }
  console.log(token);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
  try {
    const response = await fetch(`${backendUrl}/api/auth/newuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(validatedFields.data),
    });
    if (response.ok) {
      const isNewUser = response.status === 200;
      if (isNewUser) {
        return { success: true, message: "New user updated" };
      } else {
        return { error: "Not a new user" };
      }
    } else {
      const data = await response.json();
      return { error: data.error || "New user creation failed" };
    }
  } catch (error) {
    console.error("New user error:", error);
    return { error: "An unexpected error occurred" };
  }
}
