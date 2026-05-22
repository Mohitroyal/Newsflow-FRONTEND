"use client";

import Link from "next/link";
import { Newspaper, Mail, Lock, User, CheckSquare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.signup({
        firstName,
        lastName,
        email,
        password,
        acceptTerms: true
      });
      if (res.success) {
        setIsRegistered(true);
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
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
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/40 to-black/80 z-10" />
        <div className="relative z-20 text-center p-12 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-sm text-gray-300 mb-8">
              <span>✦</span> Join 10,000+ creators today
            </div>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {["en", "te", "hi", "ta", "kn", "ml"].map((lang) => (
                <div key={lang} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <span className="text-xl">🗞️</span>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-mono">{lang}</p>
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-serif font-bold text-white leading-tight">
              Generate Stunning<br />Newspaper Clippings
            </h1>
            <p className="text-gray-400 mt-4">in 6+ Indian & world languages instantly</p>
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
          {isRegistered ? (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-2 border border-indigo-500/20">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Check your email</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                We've sent a verification link to <span className="text-white font-medium">{email}</span>.<br />
                Please click the link in the email to activate your account and prevent duplicates.
              </p>
              <div className="pt-4">
                <Link href="/login" className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-gray-100 transition-all hover:scale-[1.02]">
                  Go to Sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Link href="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
                  <div className="bg-white text-black p-1.5 rounded-lg">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-xl font-bold text-white">NewsCraft AI</span>
                </Link>
                <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
                <p className="text-sm text-gray-400 mt-2">Start generating for free — no credit card required</p>
              </div>

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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-500">Or sign up with email</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="John" className="w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Doe" className="w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min. 8 characters" className="w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-400">
                    I agree to the{" "}
                    <Link href="/terms" className="text-white underline underline-offset-2">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-white underline underline-offset-2">Privacy Policy</Link>
                  </p>
                </div>

                <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-gray-100 transition-all hover:scale-[1.02] mt-2">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-white hover:text-primary-400 transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
