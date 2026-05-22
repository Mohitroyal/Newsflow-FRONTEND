"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Globe, Camera, Download, LayoutTemplate, Zap, Calendar, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore, useUIStore } from "@/store";

const recentDownloadsTranslations = {
  en: [
    { title: "AI Summit 2026", lang: "English", date: "May 15, 2026", format: "PDF" },
    { title: "Modi's New Policies", lang: "Telugu", date: "May 14, 2026", format: "PNG" },
    { title: "Markets Hit Record", lang: "English", date: "May 13, 2026", format: "PDF" },
  ],
  te: [
    { title: "AI సమ్మిట్ 2026", lang: "ఇంగ్లీష్", date: "మే 15, 2026", format: "PDF" },
    { title: "మోదీ నూతన విధానాలు", lang: "తెలుగు", date: "మే 14, 2026", format: "PNG" },
    { title: "మార్కెట్లు రికార్డు సృష్టించాయి", lang: "ఇంగ్లీష్", date: "మే 13, 2026", format: "PDF" },
  ],
  hi: [
    { title: "एआई शिखर सम्मेलन 2026", lang: "अंग्रेज़ी", date: "मई 15, 2026", format: "PDF" },
    { title: "मोदी की नई नीतियां", lang: "तेलुगु", date: "मई 14, 2026", format: "PNG" },
    { title: "बाजार ने रिकॉर्ड बनाया", lang: "अंग्रेज़ी", date: "मई 13, 2026", format: "PDF" },
  ],
  kn: [
    { title: "ಎಐ ಶೃಂಗಸಭೆ 2026", lang: "ಇಂಗ್ಲಿಷ್", date: "ಮೇ 15, 2026", format: "PDF" },
    { title: "ಮೋದಿಯವರ ಹೊಸ ನೀತಿಗಳು", lang: "ತೆಲುಗು", date: "ಮೇ 14, 2026", format: "PNG" },
    { title: "ಮಾರುಕಟ್ಟೆಗಳು ದಾಖಲೆ ಬರೆದವು", lang: "ಇಂಗ್ಲಿಷ್", date: "ಮೇ 13, 2026", format: "PDF" },
  ],
  ta: [
    { title: "செயற்கை நுண்ணறிவு உச்சி மாநாடு 2026", lang: "ஆங்கிலம்", date: "மே 15, 2026", format: "PDF" },
    { title: "மோடியின் புதிய கொள்கைகள்", lang: "தெலுங்கு", date: "மே 14, 2026", format: "PNG" },
    { title: "சந்தைகள் சாதனை படைத்தன", lang: "ஆங்கிலம்", date: "மே 13, 2026", format: "PDF" },
  ],
  ml: [
    { title: "എഐ ഉച്ചകോടി 2026", lang: "ഇംഗ്ലീഷ്", date: "മേയ് 15, 2026", format: "PDF" },
    { title: "മോദിയുടെ പുതിയ നയങ്ങൾ", lang: "തെലുങ്ക്", date: "മേയ് 14, 2026", format: "PNG" },
    { title: "വിപണികൾ റെക്കോർഡ് കുറിച്ചു", lang: "ഇംഗ്ലീഷ്", date: "മേയ് 13, 2026", format: "PDF" },
  ],
};

const profileTranslations = {
  en: {
    title: "Profile",
    subtitle: "Manage your personal information and preferences",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    preferredLanguage: "Preferred Language",
    saveChanges: "Save Changes",
    changesSaved: "Changes Saved",
    creditsLeft: "Credits Left",
    templatesSaved: "Templates Saved",
    totalExports: "Total Exports",
    memberSince: "Member Since",
    recentDownloads: "Recent Downloads",
    memberDate: "May 2026",
  },
  te: {
    title: "ప్రొఫైల్",
    subtitle: "మీ వ్యక్తిగત సమాచారం మరియు ప్రాధాన్యతలను నిర్వహించండి",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    email: "ఇమెయిల్ చిరునామా",
    preferredLanguage: "ప్రాధాన్య భాష",
    saveChanges: "మార్పులను సేవ్ చేయి",
    changesSaved: "మార్పులు సేవ్ చేయబడ్డాయి",
    creditsLeft: "మిగిలిన క్రెడిట్స్",
    templatesSaved: "టెంప్లేట్లు సేవ్ చేయబడ్డాయి",
    totalExports: "మొత్తం ఎగుమతులు",
    memberSince: "సభ్యత్వం ప్రారంభం",
    recentDownloads: "ఇటీవలి డౌన్‌లోడ్‌లు",
    memberDate: "మే 2026",
  },
  hi: {
    title: "प्रोफ़ाइल",
    subtitle: "अपनी व्यक्तिगत जानकारी और प्राथमिकताएं प्रबंधित करें",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल पता",
    preferredLanguage: "पसंदीदा भाषा",
    saveChanges: "बदलाव सहेजें",
    changesSaved: "बदलाव सहेजे गए",
    creditsLeft: "बचे हुए क्रेडिट",
    templatesSaved: "सहेजे गए टेम्पलेट",
    totalExports: "कुल निर्यात",
    memberSince: "सदस्यता की तिथि",
    recentDownloads: "हाल ही में डाउनलोड किए गए",
    memberDate: "मई 2026",
  },
  kn: {
    title: "ಪ್ರೊಫೈಲ್",
    subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    firstName: "ಮೊದಲ ಹೆಸರು",
    lastName: "ಕೊನೆಯ ಹೆಸರು",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    changesSaved: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ",
    creditsLeft: "ಉಳಿದಿರುವ ಕ್ರೆಡಿಟ್‌ಗಳು",
    templatesSaved: "ಉಳಿಸಿದ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
    totalExports: "ಒಟ್ಟು ರಫ್ತುಗಳು",
    memberSince: "ಸದಸ್ಯರಾದ ದಿನಾಂಕ",
    recentDownloads: "ಇತ್ತೀಚಿನ ಡೌನ್‌ಲೋಡ್‌ಗಳು",
    memberDate: "ಮೇ 2026",
  },
  ta: {
    title: "சுயவிவரம்",
    subtitle: "உங்கள் தனிப்பட்ட தகவல் மற்றும் விருப்பங்களை நிர்வகிக்கவும்",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    email: "மின்னஞ்சல் முகவரி",
    preferredLanguage: "விருப்பமான மொழி",
    saveChanges: "மாற்றங்களைச் சேமி",
    changesSaved: "மாற்றங்கள் சேமிக்கப்பட்டன",
    creditsLeft: "மீதமுள்ள கிரెடிட்கள்",
    templatesSaved: "சேமிக்கப்பட்ட வார்ப்புруக்கள்",
    totalExports: "மொத்த ஏற்றுமதிகள்",
    memberSince: "உறுப்பினரான தேதி",
    recentDownloads: "சமீபத்திய பதிவிறக்கங்கள்",
    memberDate: "மே 2026",
  },
  ml: {
    title: "പ്രൊഫൈൽ",
    subtitle: "നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങളും മുൻഗണനകളും നിയന്ത്രിക്കുക",
    firstName: "ആദ്യ നാമം",
    lastName: "അവസാന നാമം",
    email: "ഇമെയിൽ വിലാസം",
    preferredLanguage: "മുൻഗണനാ ഭാഷ",
    saveChanges: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
    changesSaved: "മാറ്റങ്ങൾ സംരക്ഷിച്ചു",
    creditsLeft: "ബാക്കി ക്രെഡിറ്റുകൾ",
    templatesSaved: "സംരക്ഷിച്ച ടെംപ്ലേറ്റുകൾ",
    totalExports: "ആകെ കയറ്റുമതികൾ",
    memberSince: "അംഗത്വം ആരംഭിച്ചത്",
    recentDownloads: "സമീപകാല ഡൗൺലോഡുകൾ",
    memberDate: "മേയ് 2026",
  }
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { language, setLanguage } = useUIStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [prefLanguage, setPrefLanguage] = useState("en");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (mounted) {
      setPrefLanguage(language || "en");
    }
  }, [language, mounted]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      firstName,
      lastName,
      email,
    });
    setLanguage(prefLanguage); // Changes layout and components UI language globally
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getInitials = () => {
    const f = firstName.charAt(0) || "U";
    const l = lastName.charAt(0) || "";
    return (f + l).toUpperCase();
  };

  // Get active translations or fallback to English
  const activeLanguage = mounted ? language : "en";
  const t = profileTranslations[activeLanguage as keyof typeof profileTranslations] || profileTranslations.en;
  const listDownloads = recentDownloadsTranslations[activeLanguage as keyof typeof recentDownloadsTranslations] || recentDownloadsTranslations.en;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
      </div>

      {/* Avatar & Basic Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl font-mono">
              {getInitials()}
            </div>
            <button type="button" className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.firstName}</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.lastName}</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.preferredLanguage}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  value={prefLanguage}
                  onChange={(e) => setPrefLanguage(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="ml">Malayalam (മലയാളം)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    {t.changesSaved}
                  </>
                ) : (
                  t.saveChanges
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: LayoutTemplate, label: t.templatesSaved, value: "5" },
          { icon: Download, label: t.totalExports, value: "31" },
          { icon: Calendar, label: t.memberSince, value: t.memberDate },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <stat.icon className="h-5 w-5 text-primary-400" />
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Downloads */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">{t.recentDownloads}</h2>
        </div>
        <div className="divide-y divide-white/5">
          {listDownloads.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between px-6 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-gray-500">{item.lang} · {item.date}</p>
              </div>
              <span className="text-xs font-mono font-bold text-primary-400 bg-primary-500/10 px-2 py-1 rounded-lg border border-primary-500/20">
                {item.format}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
