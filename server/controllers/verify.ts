import type { Request, Response } from "express";
import { supabase } from "../db/supabase";
import { z } from "zod";
const VerifyUserValidator = z.object({
  email: z.string().email("Invalid email address"),
  verification_code: z
    .string()
    .length(8, "Verification code must be 8 characters"),
});
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email, verification_code } = VerifyUserValidator.parse(req.body);
    const { data, error } = await supabase
      .from("user-auth-details")
      .select("*")
      .eq("email", email)
      .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    if (data.verification_code !== verification_code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    const { error: updateError } = await supabase
        .from("user-auth-details")
        .update({ is_verified: true })
        .eq("email", email);
    return res.status(200).json({ message: "User verified" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
