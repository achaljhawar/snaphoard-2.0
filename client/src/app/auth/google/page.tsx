"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleRedirect } from "@/actions/googleoauth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const googleOauth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        try {
          const result = await handleGoogleRedirect(code);
          if (result.success) {
            setLoading(false);
            router.replace(result.newUser ? "/auth/newuser" : "/dashboard");
          } else {
            throw new Error(result.error || "Authentication failed");
          }
        } catch (error) {
          console.error(error);
          setError("Authentication failed. Please try again.");
          setLoading(false);
        }
      } else {
        router.replace("/auth/login");
      }
    };

    googleOauth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex fixed inset-0 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex fixed inset-0 items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return null;
}