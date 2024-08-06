import type { Request, Response } from "express";
import { supabase } from "../db/supabase";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authcodecreator } from "../lib/utils";

interface TokenParams {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface UserInfo {
  id: number;
  email: string;
  password: string;
  isVerified: boolean;
  created_at: Date;
  verification_code: string;
  oauthprovider: string;
  role: string;
  pfp_url: string;
  firstName: string;
  lastName: string;
  "wallet-address": string;
}

async function getTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: TokenParams): Promise<any> {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(url, values, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch authorization tokens:", error);
    throw error;
  }
}

export const googleOAuth = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const code = authHeader.split(" ")[1];
    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    });

    const { data: userInfo } = await axios.get<{
      email: string;
      name: string;
      picture: string;
    }>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    const { email, name, picture } = userInfo;
    const { data: user, error } = await supabase
      .from("user-auth-details")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    if (user) {
      await handleExistingUser(user, email, picture, res);
    } else {
      await createNewUser(email, name, picture, res);
    }
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function handleExistingUser(user: UserInfo, email: string, picture: string, res: Response) {
  if (user.oauthprovider === "google") {
    const token = generateToken(user.id);
    return res.status(user.role === null ? 201 : 200).json({ token });
  } else {
    if (user.pfp_url === null) {
      const { error } = await supabase
        .from("user-auth-details")
        .update({ pfp_url: picture, isVerified: true})
        .eq("email", email);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    const token = generateToken(user.id);
    return res.status(200).json({ token });
  }
}

async function createNewUser(email: string, name: string, picture: string, res: Response) {
  const verification_code = authcodecreator(8);
  const fillerpassword = authcodecreator(8);
  const fillerusername = authcodecreator(8);
  const seed = process.env.PASSWORDSEED;
  const hashedPassword = await Bun.password.hash(fillerpassword + seed);

  const { data, error } = await supabase
    .from("user-auth-details")
    .insert([
      {
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        email,
        username: fillerusername,
        password: hashedPassword,
        verification_code,
        role: null,
        oauthprovider: "google",
        isVerified: true,
        pfp_url: picture,
        "wallet-address": null,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
    }
  
  const token = generateToken(data[0].id);
  return res.status(201).json({ token });
}

function generateToken(userId: number): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
}