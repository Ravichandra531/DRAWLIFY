"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface AuthPageProps {
    isSignin: boolean;
}

export function AuthPage({ isSignin }: AuthPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isSignin ? "/login" : "/signup";
            const data = isSignin
                ? { username, password } // Backend uses username for login too
                : { username, password, email };

            const response = await axios.post(`${BACKEND_URL}${endpoint}`, data);

            if (isSignin) {
                localStorage.setItem("token", response.data.token);
                router.push("/dashboard");
            } else {
                router.push("/signin");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "Something went wrong");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-[#fdfbf7] text-gray-900 font-sans">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-12">
                            <span className="font-bold text-3xl tracking-tight" style={{ fontFamily: "var(--font-caveat), cursive" }}>Drawlify</span>
                        </Link>

                        <h1 className="text-4xl font-bold mb-3 tracking-tight">
                            {isSignin ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-gray-500 mb-10">
                            {isSignin ? "Sign in to access your boards and collaborate." : "Start sketching your ideas with teams today."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe"
                                    className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#6c5ce7] focus:ring-4 focus:ring-[#6c5ce7]/5 outline-none transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>
                            {!isSignin && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#6c5ce7] focus:ring-4 focus:ring-[#6c5ce7]/5 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#6c5ce7] focus:ring-4 focus:ring-[#6c5ce7]/5 outline-none transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-[#6c5ce7] text-white font-bold rounded-2xl shadow-xl shadow-[#6c5ce7]/20 hover:shadow-2xl hover:shadow-[#6c5ce7]/30 hover:brightness-110 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    isSignin ? "Sign in" : "Create account"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500">
                                {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
                                <Link href={isSignin ? "/signup" : "/signin"} className="text-[#6c5ce7] font-bold hover:underline">
                                    {isSignin ? "Sign up" : "Sign in"}
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Hero Content */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#6c5ce7] via-[#a29bfe] to-[#81ecec] items-center justify-center overflow-hidden">
                {/* Abstract background elements */}
                <motion.div
                    className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-white/10 backdrop-blur-3xl"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-white/10 backdrop-blur-3xl"
                    animate={{ y: [30, -30, 30] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

                <div className="relative z-10 max-w-lg text-center px-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            Trusted by 10,000+ creators
                        </div>
                        <h2 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                            The whiteboard for<br />high-performing teams
                        </h2>
                        <p className="text-white/80 text-lg mb-12">
                            &quot;Drawlify helped us visualize complex system architectures in minutes. It&apos;s fast, intuitive, and beautiful.&quot;
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#6c5ce7] bg-gray-200 overflow-hidden shadow-lg relative">
                                        <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" width={48} height={48} />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-sm font-medium">5.0 rating from users</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}