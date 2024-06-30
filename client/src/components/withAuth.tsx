"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/actions/verifytoken";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const Auth = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const result = await verifyToken();

          if (result.error) {
            throw new Error(result.error);
          }

          if (result.success) {
            setLoading(false);
          } else {
            throw new Error("Authentication failed");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          router.replace("/auth/login");
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="flex fixed inset-0 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return Auth;
};

export default withAuth;
