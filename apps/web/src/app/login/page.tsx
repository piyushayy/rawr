"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { login, signup, loginWithGoogle } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);

    // Wrapper for server actions to handle loading state and toasts
    const handleAction = async (formData: FormData) => {
        setLoading(true);
        try {
            if (mode === 'login') {
                const result = await login(formData);
                if (result?.error) {
                    toast.error(result.error);
                }
            } else {
                const result = await signup(formData);
                if (result?.error) {
                    toast.error(result.error);
                } else if (result?.success) {
                    toast.success(result.message);
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const redirectUrl = searchParams.get('redirect') || '/account';
        const result = await loginWithGoogle(redirectUrl);
        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rawr-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505]"
            >
                <h1 className="text-4xl font-heading font-black uppercase text-center mb-8 text-rawr-black">
                    {mode === 'login' ? 'Welcome Back' : 'Join The Cult'}
                </h1>

                {/* Tabs */}
                <div className="grid grid-cols-2 mb-8 border-2 border-rawr-black">
                    <button
                        onClick={() => setMode('login')}
                        className={`p-4 font-bold uppercase transition-colors ${mode === 'login' ? 'bg-rawr-black text-white' : 'bg-white text-rawr-black hover:bg-gray-100'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`p-4 font-bold uppercase transition-colors ${mode === 'signup' ? 'bg-rawr-black text-white' : 'bg-white text-rawr-black hover:bg-gray-100'}`}
                    >
                        Create Account
                    </button>
                </div>

                <form action={handleAction} className="flex flex-col gap-6">
                    <input type="hidden" name="redirectUrl" value={searchParams.get('redirect') || '/account'} />
                    <AnimatePresence mode="wait">
                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <label className="font-bold uppercase text-sm" htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        className="w-full p-3 border-2 border-rawr-black focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all bg-gray-50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold uppercase text-sm" htmlFor="phone">Mobile Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        className="w-full p-3 border-2 border-rawr-black focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all bg-gray-50"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold uppercase text-sm" htmlFor="referralCode">Referral Code (Optional)</label>
                                    <input
                                        id="referralCode"
                                        name="referralCode"
                                        type="text"
                                        className="w-full p-3 border-2 border-rawr-black focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all bg-gray-50 uppercase placeholder:normal-case"
                                        placeholder="RAWR-XXXXXX"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="font-bold uppercase text-sm" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full p-3 border-2 border-rawr-black focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all bg-gray-50"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-bold uppercase text-sm" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full p-3 border-2 border-rawr-black focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all bg-gray-50"
                            placeholder="••••••••"
                        />
                        {mode === 'signup' && <p className="text-xs text-gray-500 font-bold uppercase mt-1">Passwords must be at least 6 characters.</p>}
                    </div>

                    {message && (
                        <div className="bg-red-50 text-red-600 p-3 text-sm font-bold uppercase border border-red-200">
                            {message}
                        </div>
                    )}

                    <div className="space-y-4 mt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-lg bg-rawr-red text-white hover:bg-red-700 border-rawr-black shadow-[4px_4px_0px_0px_#050505] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                        >
                            {loading ? "PROCESSING..." : (mode === 'login' ? "SECURE SIGN IN" : "CREATE ACCOUNT")}
                        </Button>

                        <div className="relative flex items-center justify-center my-4">
                            <hr className="w-full border-rawr-black" />
                            <span className="absolute bg-white px-2 font-bold text-sm text-gray-500 uppercase">OR</span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-14 text-lg bg-white text-rawr-black hover:bg-gray-50 border-rawr-black flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
}
