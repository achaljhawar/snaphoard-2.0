import type { Request, Response } from "express";
import { supabase } from "../db/supabase";
import jwt from "jsonwebtoken";
import { z } from "zod";
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
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
export const newUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: "Invalid token" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: "Invalid token" });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const { id, exp } = decoded;

    const currentTime = Math.floor(Date.now() / 1000);
    if (exp < currentTime) {
      return res
        .status(401)
        .json({ message: "Token expired", error: "Token expired" });
    }
    const { data: user, error } = await supabase
      .from("user-auth-details")
      .select("*")
      .eq("id", id)
      .single();
    if (user.role === null && user.oauthprovider === "google") {
      const { username, role } = NewUserValidator.parse(req.body);
      const { data: checkusername, error: checkusernameerror } = await supabase
        .from("user-auth-details")
        .select("*")
        .eq("username", username)
        .single();
      if (checkusername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (checkusernameerror) {
        return res.status(500).json({ error: checkusernameerror.message });
      }
      const { data, error } = await supabase
        .from("user-auth-details")
        .update({ username, role })
        .eq("id", id)
        .select();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ message: "New user updated" });
    }
    return res.status(201).json({ message: "not a new user" });
  } catch (error) {
    console.error("checkAuth error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
