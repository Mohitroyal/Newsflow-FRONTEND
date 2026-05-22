"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, LayoutTemplate, History, CreditCard, User, Settings, LogOut, Newspaper, Bell, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useAuthStore } from "@/store";

const layoutTranslations = {
  en: {
    dashboard: "Dashboard",
    generate: "Generate",
    templates: "Templates",
    history: "History",
    subscription: "Subscription",
    profile: "Profile",
    settings: "Settings",
    signOut: "Sign Out",
    main: "Main",
    account: "Account",
    search: "Search generations, templates...",
    credits: "Credits"
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    generate: "సృష్టించు",
    templates: "టెంప్లేట్లు",
    history: "చరిత్ర",
    subscription: "సబ్‌స్క్రిప్షన్",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్‌లు",
    signOut: "సైన్ అవుట్ చేయండి",
    main: "ప్రధాన",
    account: "ఖాతా",
    search: "తరాలు, టెంప్లేట్ల కోసం శోధించండి...",
    credits: "క్రెడిట్స్"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    generate: "बनाएं",
    templates: "टेम्पलेट्स",
    history: "इतिहास",
    subscription: "सदस्यता",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    signOut: "साइन आउट करें",
    main: "मुख्य",
    account: "खाता",
    search: "पीढ़ियों, टेम्पलेट्स खोजें...",
    credits: "क्रेडिट"
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    generate: "ರಚಿಸಿ",
    templates: "ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
    history: "ಇತಿಹಾಸ",
    subscription: "ಚಂದಾದಾರಿಕೆ",
    profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    signOut: "ಸೈನ್ ಔಟ್ ಮಾಡಿ",
    main: "ಮುಖ್ಯ",
    account: "ಖಾತೆಗೆ",
    search: "ಹುಡುಕಿ...",
    credits: "ಕ್ರೆಡಿಟ್‌ಗಳು"
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    generate: "உருவாக்கு",
    templates: "வார்ப்புருக்கள்",
    history: "வரலாறு",
    subscription: "சந்தா",
    profile: "சுயவிவரம்",
    settings: "அமைப்புகள்",
    signOut: "வெளியேறு",
    main: "முக்கிய",
    account: "கணக்கு",
    search: "தேடு...",
    credits: "கிரெடிட்கள்"
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    generate: "ഉണ്ടാക്കുക",
    templates: "ടെംപ്ലേറ്റുകൾ",
    history: "ചരിത്രം",
    subscription: "സബ്‌സ്‌ക്രിപ്‌ഷൻ",
    profile: "പ്രൊഫൈൽ",
    settings: "ക്രമീകരണങ്ങൾ",
    signOut: "സൈൻ ഔട്ട് ചെയ്യുക",
    main: "പ്രധാനം",
    account: "അക്കൗണ്ട്",
    search: "തിരയുക...",
    credits: "ക്രെഡിറ്റുകൾ"
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useUIStore();
  const { logout, user, isAuthenticated } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;
  if (!isAuthenticated) return null;

  const activeLanguage = language || "en";
  const t = layoutTranslations[activeLanguage as keyof typeof layoutTranslations] || layoutTranslations.en;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const sidebarLinks = [
    { icon: LayoutDashboard, label: t.dashboard, href: "/dashboard" },
    { icon: FileText, label: t.generate, href: "/dashboard/generate" },
    { icon: LayoutTemplate, label: t.templates, href: "/dashboard/templates" },
    { icon: History, label: t.history, href: "/dashboard/history" },
  ];

  const bottomLinks = [
    { icon: User, label: t.profile, href: "/dashboard/profile" },
    { icon: Settings, label: t.settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white dark:bg-white dark:text-black p-1 rounded-lg">
              <Newspaper className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">NewsCraft AI</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="mb-4 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.main}</div>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          <div className="mt-8 mb-4 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.account}</div>
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            {t.signOut}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-neutral-950/50 backdrop-blur">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={t.search}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl p-0 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline">Mark all as read</span>
                    </div>
                    <div className="p-6 text-center">
                      <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                        <Bell className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">You're all caught up!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check back later for new alerts.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shadow-sm border border-white/20 uppercase font-mono">
                  {user ? ((user.firstName?.charAt(0) || user.email?.charAt(0) || "U") + (user.lastName?.charAt(0) || "")).substring(0, 2) : "US"}
                </div>
              </button>
              
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    
                    <div className="px-2 py-1">
                      <Link href="/dashboard/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <User className="h-4 w-4 text-gray-500" />
                        {t.profile}
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <Settings className="h-4 w-4 text-gray-500" />
                        {t.settings}
                      </Link>
                      <Link href="/dashboard/subscription" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        {t.subscription}
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-white/5 my-1"></div>
                    
                    <div className="px-2 py-1">
                      <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut className="h-4 w-4" />
                        {t.signOut}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
