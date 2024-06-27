"use client"
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    const Auth = (props: P) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await fetch("/api/checkauth", {
                        
                    });
                } catch (error) {
                    router.replace("/login");
                }
            }
        })
    }
}