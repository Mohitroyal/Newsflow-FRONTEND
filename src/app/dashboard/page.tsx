"use client";

import { useState, useEffect } from "react";
import { FileText, ArrowUpRight, Clock, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGenerationStore, useAuthStore, useUIStore } from "@/store";

const dashboardTranslations = {
  en: {
    overview: "Overview",
    welcome: "Welcome back, {name}! Here's what's happening with your account.",
    newGeneration: "New Generation",
    totalGenerated: "Total Generated",
    lifetimeTotal: "Lifetime total",
    timeSaved: "Time Saved",
    perClipping: "~30m per clipping",
    upgradePro: "Upgrade to Pro",
    upgradeDesc: "Unlock premium templates and API access.",
    viewPlans: "View plans",
    recentGenerations: "Recent Generations",
    view: "View",
    untitledNewspaper: "Untitled Newspaper",
    noGenerations: "No generations yet. Create your first clipping!",
    goToGenerator: "Go to generator"
  },
  te: {
    overview: "అవలోకనం",
    welcome: "తిరిగి స్వాగతం, {name}! మీ ఖాతాలో ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
    newGeneration: "కొత్త సృష్టి",
    totalGenerated: "మొత్తం సృష్టించబడినవి",
    lifetimeTotal: "జీవితకాల మొత్తం",
    timeSaved: "ఆదా చేసిన సమయం",
    perClipping: "ఒక క్లిప్పింగ్‌కు ~30 నిమిషాలు",
    upgradePro: "ప్రో కి అప్‌గ్రేడ్ చేయండి",
    upgradeDesc: "ప్రీమియం టెంప్లేట్లు మరియు API యాక్సెస్‌ను అన్‌లాక్ చేయండి.",
    viewPlans: "ప్లాన్లను చూడండి",
    recentGenerations: "ఇటీవలి సృష్టిలు",
    view: "వీక్షించండి",
    untitledNewspaper: "శీర్షిక లేని వార్తాపత్రిక",
    noGenerations: "ఇంకా ఏమీ సృష్టించబడలేదు. మీ మొదటి క్లిప్పింగ్‌ను సృష్టించండి!",
    goToGenerator: "జనరేటర్‌కు వెళ్లండి"
  },
  hi: {
    overview: "अवलोकन",
    welcome: "वापस स्वागत है, {name}! यहाँ आपके खाते में क्या हो रहा है, इसकी जानकारी है।",
    newGeneration: "नया निर्माण",
    totalGenerated: "कुल जनरेट किया गया",
    lifetimeTotal: "लाइफटाइम कुल",
    timeSaved: "समय की बचत",
    perClipping: "प्रति क्लिपिंग ~30 मिनट",
    upgradePro: "प्रो में अपग्रेड करें",
    upgradeDesc: "प्रीमियम टेम्पलेट्स और एपीआई एक्सेस अनलॉक करें।",
    viewPlans: "योजनाएं देखें",
    recentGenerations: "हालिया जनरेशन",
    view: "देखें",
    untitledNewspaper: "बिना शीर्षक वाला समाचार पत्र",
    noGenerations: "अभी तक कोई जनरेशन नहीं। अपनी पहली क्लिपिंग बनाएं!",
    goToGenerator: "जनरेटर पर जाएं"
  },
  kn: {
    overview: "ಅವಲೋಕನ",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ, {name}! ನಿಮ್ಮ ಖಾತೆಯ ಇತ್ತೀಚಿನ ವಿವರಗಳು ಇಲ್ಲಿವೆ.",
    newGeneration: "ಹೊಸ ಸೃಷ್ಟಿ",
    totalGenerated: "ಒಟ್ಟು ಸೃಷ್ಟಿ",
    lifetimeTotal: "ಜೀವಿತಾವಧಿ ಒಟ್ಟು",
    timeSaved: "ಉಳಿಸಿದ ಸಮಯ",
    perClipping: "ಪ್ರತಿ ಕ್ಲಿಪ್ಪಿಂಗ್‌ಗೆ ~30 ನಿಮಿಷಗಳು",
    upgradePro: "ಪ್ರೊಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    upgradeDesc: "ಪ್ರೀಮಿಯಂ ಟೆಂಪ್ಲೇಟ್‌ಗಳು ಮತ್ತು API ಪ್ರವೇಶವನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ.",
    viewPlans: "ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    recentGenerations: "ಇತ್ತೀಚಿನ ಸೃಷ್ಟಿಗಳು",
    view: "ವೀಕ್ಷಿಸಿ",
    untitledNewspaper: "ಶೀರ್ಷಿಕೆ ಇಲ್ಲದ ಪತ್ರಿಕೆ",
    noGenerations: "ಇನ್ನೂ ಯಾವುದೇ ಸೃಷ್ಟಿಗಳು ಇಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಕ್ಲಿಪ್ಪಿಂಗ್ ರಚಿಸಿ!",
    goToGenerator: "ಜನರೇಟರ್‌ಗೆ ಹೋಗಿ"
  },
  ta: {
    overview: "மேலோட்டம்",
    welcome: "மீண்டும் வருக, {name}! உங்கள் கணக்கின் தற்போதைய விவரங்கள் இதோ.",
    newGeneration: "புதிய உருவாக்கம்",
    totalGenerated: "மொத்தம் உருவாக்கப்பட்டது",
    lifetimeTotal: "வாழ்நாள் மொத்தம்",
    timeSaved: "சேமிக்கப்பட்ட நேரம்",
    perClipping: "ஒரு கிளிப்பிங்கிற்கு ~30 நிமிடங்கள்",
    upgradePro: "புரோவுக்கு மேம்படுத்தவும்",
    upgradeDesc: "பிரீமியம் வார்ப்புருக்கள் மற்றும் ஏபிஐ அணுகலைத் திறக்கவும்.",
    viewPlans: "திட்டங்களைக் காண்க",
    recentGenerations: "சமீபத்திய உருவாக்கங்கள்",
    view: "காண்க",
    untitledNewspaper: "தலைப்பற்ற செய்தித்தாள்",
    noGenerations: "இன்னும் எதுவும் உருவாக்கப்படவில்லை. உங்கள் முதல் கிளிப்பிங்கை உருவாக்குங்கள்!",
    goToGenerator: "ஜெனரேட்டருக்குச் செல்லவும்"
  },
  ml: {
    overview: "അവലോകനം",
    welcome: "വീണ്ടും സ്വാഗതം, {name}! നിങ്ങളുടെ അക്കൗണ്ടിൽ സംഭവിക്കുന്നത് ഇവിടെ കാണാം.",
    newGeneration: "പുതിയ സൃഷ്ടി",
    totalGenerated: "ആകെ സൃഷ്ടിച്ചത്",
    lifetimeTotal: "ആയുഷ്കാല ആകെത്തുക",
    timeSaved: "ലാഭിച്ച സമയം",
    perClipping: "ഒരു ക്ലിപ്പിംഗിന് ~30 മിനിറ്റ്",
    upgradePro: "പ്രോയിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യുക",
    upgradeDesc: "പ്രീമിയം ടെംപ്ലേറ്റുകളും API ആക്സസും അൺലോക്ക് ചെയ്യുക.",
    viewPlans: "പ്ലാനുകൾ കാണുക",
    recentGenerations: "സമീപകാല സൃഷ്ടികൾ",
    view: "കാണുക",
    untitledNewspaper: "പേരിടാത്ത പത്രം",
    noGenerations: "ഇതുവരെ സൃഷ്ടികളൊന്നുമില്ല. നിങ്ങളുടെ ആദ്യത്തെ ക്ലിപ്പിംഗ് സൃഷ്ടിക്കൂ!",
    goToGenerator: "ജനറേറ്ററിലേക്ക് പോകുക"
  }
};

export default function DashboardPage() {
  const { generations } = useGenerationStore();
  const { user } = useAuthStore();
  const { language } = useUIStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLanguage = mounted ? language : "en";
  const t = dashboardTranslations[activeLanguage as keyof typeof dashboardTranslations] || dashboardTranslations.en;

  const totalGenerated = generations.length;
  
  // Format the welcome message with the user's name
  const welcomeText = t.welcome.replace("{name}", user?.firstName || "Creator");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.overview}</h1>
          <p className="text-gray-400 text-sm mt-1">{welcomeText}</p>
        </div>
        <Link 
          href="/dashboard/generate"
          className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {t.newGeneration}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary-500/20 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{t.totalGenerated}</p>
              <h3 className="text-2xl font-bold text-white">{totalGenerated}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight className="h-3 w-3" />
            <span>{t.lifetimeTotal}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-accent-500/20 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{t.timeSaved}</p>
              <h3 className="text-2xl font-bold text-white">{totalGenerated * 0.5}h</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight className="h-3 w-3" />
            <span>{t.perClipping}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-900/40 to-accent-900/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">{t.upgradePro}</h3>
            <p className="text-sm text-gray-300 mb-4 max-w-[200px]">{t.upgradeDesc}</p>
            <Link href="/dashboard/subscription" className="text-sm font-medium text-white underline underline-offset-4 hover:text-primary-400">
              {t.viewPlans} &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">{t.recentGenerations}</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/10">
            {generations.length > 0 ? (
              generations.slice(0, 5).map((gen) => (
                <div key={gen.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-neutral-800 rounded flex flex-col p-1 gap-0.5 border border-white/10 relative overflow-hidden">
                      {gen.png_url && <img src={gen.png_url} alt="Thumbnail" className="absolute inset-0 w-full h-full object-contain opacity-60" />}
                      <div className="relative z-10">
                        <div className="w-full h-2 bg-white/20 rounded-sm"></div>
                        <div className="w-3/4 h-1.5 bg-white/20 rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1 truncate max-w-[300px]">{gen.config?.headline || t.untitledNewspaper}</h4>
                      <p className="text-xs text-gray-500 uppercase">{gen.config?.language || "en"} • {gen.status} • {new Date(gen.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/generate`} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/10 flex items-center gap-2">
                    {t.view} <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">{t.noGenerations}</p>
                <Link href="/dashboard/generate" className="text-primary-400 text-sm mt-2 hover:underline">
                  {t.goToGenerator} &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
