// login functions
import type { Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../db/supabase";
import jwt from "jsonwebtoken";

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
const seed = Bun.env.PASSWORDSEED;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = AuthCredentialsValidator.parse(req.body);
    const { data, error } = await supabase
      .from("user-auth-details")
      .select("*")
      .eq("username", username)
      .single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    if (data.isVerified === false) {
        return res.status(403).json({ error: "Email not verified" });
    }
    const { password: hashedPassword, id } = data;
    const isMatch = await Bun.password.verify(password + seed, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    } else {
        const token = jwt.sign({ id }, Bun.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });

        return res.status(200).json({ token });   
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
