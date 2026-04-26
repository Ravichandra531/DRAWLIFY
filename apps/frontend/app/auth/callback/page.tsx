"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } else {
            router.push("/signin?error=google_failed");
        }
    }, [params, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
            <div className="animate-spin w-8 h-8 border-4 border-[#6c5ce7] border-t-transparent rounded-full" />
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="animate-spin w-8 h-8 border-4 border-[#6c5ce7] border-t-transparent rounded-full" />
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
