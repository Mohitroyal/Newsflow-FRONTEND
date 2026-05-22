"use client";

import Link from "next/link";
import { Newspaper, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        setSuccessMessage("Email verified successfully! You can now sign in.");
      } else if (params.get("error") === "invalid_token") {
        setError("The email verification link is invalid or has expired.");
      } else if (params.get("error") === "user_not_found") {
        setError("User not found.");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        login(res.data.user, res.data.token);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Page will redirect to Google — no need to setIsLoading(false)
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-black">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-black/80 z-10" />
        <div className="relative z-20 text-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/10 p-4 rounded-2xl inline-block mb-8 backdrop-blur-sm border border-white/20">
              <Newspaper className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
              Transform Text into<br />Timeless Clippings
            </h1>
            <p className="text-lg text-gray-400 max-w-md mx-auto">
              Join thousands of creators using AI to generate authentic newspaper layouts in multiple languages.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
              <div className="bg-white text-black p-1.5 rounded-lg">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white">NewsCraft AI</span>
            </Link>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-2">Enter your credentials to access your account</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">Or continue with</span>
            </div>
          </div>

          {successMessage && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-3 rounded-xl text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email" 
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all" 
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-sm font-medium text-primary-400 hover:text-primary-300">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password" 
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:scale-[1.02]">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-white hover:text-primary-400 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
