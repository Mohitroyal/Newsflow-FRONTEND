"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      // Small delay to ensure Supabase client has parsed the URL hash
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        // Map Supabase user to our internal User format
        const user = {
          id: session.user.id,
          email: session.user.email!,
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || "User",
          lastName: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
          full_name: session.user.user_metadata?.full_name || "User",
          createdAt: new Date().toISOString(),
          plan: "free" as const,
          role: "user",
          credits: 100 // default mock credits
        };
        
        login(user, session.access_token);
        router.push("/dashboard");
      } else {
        console.error("No session found in callback", error);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router, login]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        <p className="text-gray-400 text-sm">Completing authentication...</p>
      </div>
    </div>
  );
}
