"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { CheckIcon, LoaderPinwheelIcon } from "@/components/icons";
import Link from "next/link";


export default function VerifyPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verification_code = searchParams.get("verification_code");
  const backendurl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${backendurl}/api/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verification_code }),
        });
        if (response.ok) {
          setIsVerified(true);
        } else {
          setErrorMessage("Failed to verify user");
        }
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    if (email && verification_code) {
      verifyUser();
    }
  }, [email, verification_code]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#09090B]">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center animate-spin">
              <LoaderPinwheelIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Verifying your account...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
              <CheckIcon className="h-12 w-12 text-white" />
            </div>
            <p className="text-green-500 font-bold text-2xl">
              Verification Successful!
            </p>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700 dark:focus-visible:ring-green-800"
              prefetch={false}
            >
                Go to the dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-red-500 font-bold text-2xl">{errorMessage}</p>
          </div>
        )}
      </div>
    </Suspense>
  );
}
