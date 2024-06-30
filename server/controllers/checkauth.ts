import type { Request, Response } from "express";
import { supabase } from "../db/supabase";
import jwt from "jsonwebtoken";
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
export const checkAuth = async (req: Request, res: Response) => {
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

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Valid token" });
  } catch (error) {
    console.error("checkAuth error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
