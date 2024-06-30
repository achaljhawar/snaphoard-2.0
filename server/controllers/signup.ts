// signup functions
import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { authcodecreator, generateEightDigitNumber } from "../lib/utils";
import { z } from "zod";
import { supabase } from "../db/supabase";

const seed = Bun.env.PASSWORDSEED;
const AuthCredentialsValidator = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name must be less than 21 characters")
    .regex(/^[a-zA-Z]+$/, "First name should only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must be less than 21 characters")
    .regex(/^[a-zA-Z]+$/, "Last name should only contain letters"),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?"://{}|<>]/,
      "Password must contain at least one special character"
    ),
  role: z.string().min(1, "Role is required"),
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: Bun.env.EMAIL as string,
    pass: Bun.env.EMAIL_PASSWORD as string,
  },
});

async function sendVerificationEmail(
  email: string,
  verifyUrl: string,
  verification_code: string
) {
  try {
    const mailOptions = {
      to: email,
      subject: "Verify your email address",
      html: `
        <html>
        <head>
           <title>SnapHoard</title>
           <style>
               @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
               body {
                   background-color: white;
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   height: 100vh;
                   margin: 0;
                   font-family: 'Inter', sans-serif;
               }
               .card {
                   background-color: white;
                   border-radius: 0.5rem;
                   padding: 1.5rem;
                   max-width: 600px;
                   text-align: center;
               }
               .title {
                   font-size: 1.875rem;
                   font-weight: 700;
                   color: #1a202c;
                   margin-bottom: 0.5rem;
               }
               .text {
                   color: #6b7280;
               }
               .verification-code {
                   background-color: #f7fafc;
                   border-radius: 0.5rem;
                   padding: 1.5rem;
                   font-size: 4rem;
                   font-weight: 700;
                   color: #1a202c;
               }
               .button {
                   display: inline-flex;
                   align-items: center;
                   justify-content: center;
                   height: 2.5rem;
                   padding-left: 1.5rem;
                   padding-right: 1.5rem;
                   border-radius: 0.375rem;
                   background-color: #1a202c;
                   color: white;
                   transition: background-color 0.15s ease-in-out;
                   text-decoration: none;
               }
               .button:hover {
                   background-color: rgba(26, 32, 44, 0.9);
               }
               .button:focus {
                   outline: 2px solid transparent;
                   outline-offset: 2px;
                   box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
               }
           </style>
        </head>
        <body>
           <div class="card">
               <h1 class="title">Welcome to SnapHoard!</h1>
               <p class="text">
                   To complete your account setup, please enter the verification code below.
               </p>
               <div class="verification-code">${verification_code}</div>
               <p class="text">
                   SnapHoard is a web application where users can be either posters (who upload images with captions) or
                   viewers. Explore the platform and connect with others who share your interests.
               </p>
               <a href="${verifyUrl}" class="button">Go to SnapHoard</a>
           </div>
        </body>
        </html>
        `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password, role } =
      AuthCredentialsValidator.parse(req.body);

    // Check if email or username already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("user-auth-details")
      .select("*")
      .or(`email.eq.${email},username.eq.${username}`)
      .eq("isVerified", true);
    if (checkError) {
      console.error("Error checking existing users:", checkError);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (existingUsers && existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    // Check for existing unverified users
    const { data: existingUnverifiedUser, error: checkUnverifiedError } =
      await supabase
        .from("user-auth-details")
        .select("*")
        .eq("email", email)
        .eq("isVerified", false)
        .eq("username", username);

    if (checkUnverifiedError) {
      console.error(
        "Error checking existing unverified users:",
        checkUnverifiedError
      );
      return res.status(500).json({ error: "Internal server error" });
    }
    if (existingUnverifiedUser && existingUnverifiedUser.length > 0) {
      console.log;
      const isMatch = await Bun.password.verify(
        password + seed,
        existingUnverifiedUser[0].password
      );
      if (isMatch) {
        const verification_code = existingUnverifiedUser[0].verification_code;
        const verifyUrl =
          process.env.FRONTEND_URL +
          "/auth/verify?email=" +
          email +
          "&verification_code=" +
          verification_code;
        await sendVerificationEmail(email, verifyUrl, verification_code);
        return res
          .status(403)
          .json({ error: "User already exists but not verified" });
      } else {
        return res.status(400).json({ error: "User already exists" });
      }
    } else {
      // Adding the user details to the database
      const verification_code = authcodecreator(8);
      const hashedPassword = await Bun.password.hash(password + seed);
      const { data: user, error: userError } = await supabase
        .from("user-auth-details")
        .insert([
          {
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            verification_code,
            role,
            oauthprovider: "email",
            isVerified: false,
          },
        ]);
      if (userError) {
        console.error("Error creating user:", userError);
        return res.status(500).json({ error: "Internal server error" });
      }
      const verifyUrl =
        process.env.FRONTEND_URL +
        "/auth/verify?email=" +
        email +
        "&verification_code=" +
        verification_code;
      await sendVerificationEmail(email, verifyUrl, verification_code);
      return res.status(200).json({
        message: "user created successfully, check your email to verify it",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
