"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Clock, MoreVertical, Trash2, Eye, Edit } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGenerationStore, useUIStore } from "@/store";
import { useGeneration } from "@/hooks/useGeneration";

const historyTranslations = {
  en: {
    title: "History",
    subtitle: "All your generated newspaper clippings",
    newGen: "+ New Generation",
    totalGen: "Total Generated",
    thisMonth: "This Month",
    exportsDown: "Exports Downloaded",
    allGen: "All Generations",
    search: "Search...",
    empty: "No generations yet. Create your first newspaper clipping!",
    untitled: "Untitled",
    completed: "completed"
  },
  te: {
    title: "చరిత్ర",
    subtitle: "మీ సృష్టించబడిన అన్ని వార్తాపత్రిక క్లిప్పింగ్‌లు",
    newGen: "+ కొత్త సృష్టి",
    totalGen: "మొత్తం సృష్టించబడినవి",
    thisMonth: "ఈ నెల",
    exportsDown: "డౌన్‌లోడ్ చేయబడిన ఎగుమతులు",
    allGen: "అన్ని సృష్టిలు",
    search: "శోధించండి...",
    empty: "ఇంకా ఏమీ సృష్టించబడలేదు. మీ మొదటి వార్తాపత్రిక క్లిప్పింగ్‌ను సృష్టించండి!",
    untitled: "శీర్షిక లేనిది",
    completed: "పూర్తయింది"
  },
  hi: {
    title: "इतिहास",
    subtitle: "आपके द्वारा जनरेट किए गए सभी समाचार पत्र कतरन",
    newGen: "+ नया निर्माण",
    totalGen: "कुल जनरेट किया गया",
    thisMonth: "इस महीने",
    exportsDown: "डाउनलोड किए गए निर्यात",
    allGen: "सभी जनरेशन",
    search: "खोजें...",
    empty: "अभी तक कोई जनरेशन नहीं। अपनी पहली समाचार पत्र क्लिपिंग बनाएं!",
    untitled: "बिना शीर्षक का",
    completed: "पूरा हुआ"
  },
  kn: {
    title: "ಇತಿಹಾಸ",
    subtitle: "ನಿಮ್ಮ ಎಲ್ಲಾ ರಚಿಸಲಾದ ಪತ್ರಿಕೆ ಕ್ಲಿಪ್ಪಿಂಗ್‌ಗಳು",
    newGen: "+ ಹೊಸ ಸೃಷ್ಟಿ",
    totalGen: "ಒಟ್ಟು ಸೃಷ್ಟಿ",
    thisMonth: "ಈ ತಿಂಗಳು",
    exportsDown: "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದ ರಫ್ತುಗಳು",
    allGen: "ಎಲ್ಲಾ ಸೃಷ್ಟಿಗಳು",
    search: "ಹುಡುಕಿ...",
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಸೃಷ್ಟಿಗಳು ಇಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಪತ್ರಿಕೆ ಕ್ಲಿಪ್ಪಿಂಗ್ ರಚಿಸಿ!",
    untitled: "ಶೀರ್ಷಿಕೆ ರಹಿತ",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ"
  },
  ta: {
    title: "வரலாறு",
    subtitle: "உங்களுடைய உருவாக்கப்பட்ட அனைத்து செய்தித்தாள் துண்டுகள்",
    newGen: "+ புதிய உருவாக்கம்",
    totalGen: "மொத்தம் உருவாக்கப்பட்டது",
    thisMonth: "இந்த மாதம்",
    exportsDown: "பதிவிறக்கம் செய்யப்பட்ட ஏற்றுமதிகள்",
    allGen: "அனைத்து உருவாக்கங்கள்",
    search: "தேடு...",
    empty: "இன்னும் எதுவும் உருவாக்கப்படவில்லை. உங்கள் முதல் செய்தித்தாள் கிளிப்பிங்கை உருவாக்குங்கள்!",
    untitled: "தலைப்பற்றது",
    completed: "நிறைவடைந்தது"
  },
  ml: {
    title: "ചരിത്രം",
    subtitle: "നിങ്ങളുടെ സൃഷ്ടിച്ച എല്ലാ പത്ര ക്ലിപ്പിംഗുകളും",
    newGen: "+ പുതിയ സൃഷ്ടി",
    totalGen: "ആകെ സൃഷ്ടിച്ചത്",
    thisMonth: "ഈ മാസം",
    exportsDown: "ഡൗൺലോഡ് ചെയ്തവ",
    allGen: "എല്ലാ സൃഷ്ടികളും",
    search: "തിരയുക...",
    empty: "ഇതുവരെ സൃഷ്ടികളൊന്നുമില്ല. നിങ്ങളുടെ ആദ്യത്തെ പത്ര ക്ലിപ്പിംഗ് സൃഷ്ടിക്കൂ!",
    untitled: "പേരിടാത്തത്",
    completed: "പൂർത്തിയായി"
  }
};

export default function HistoryPage() {
  const generations = useGenerationStore((state) => state.generations);
  const { language } = useUIStore();
  const { exportFile } = useGeneration();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLanguage = mounted ? language : "en";
  const t = historyTranslations[activeLanguage as keyof typeof historyTranslations] || historyTranslations.en;

  const stats = [
    { label: t.totalGen, value: generations.length.toString(), icon: FileText },
    { label: t.thisMonth, value: generations.length.toString(), icon: Clock },
    { label: t.exportsDown, value: "0", icon: Download },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
        </div>
        <Link href="/dashboard/generate" className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
          {t.newGen}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-primary-500/10 p-2.5 rounded-xl">
              <stat.icon className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">{t.allGen}</h2>
          <input
            type="text"
            placeholder={t.search}
            className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 w-48"
          />
        </div>

        <div className="divide-y divide-white/5">
          {generations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {t.empty}
            </div>
          ) : (
            generations.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors group"
              >
                {/* Newspaper thumbnail */}
                <div className="w-10 h-14 bg-neutral-800 rounded border border-white/10 mr-4 flex-shrink-0 flex flex-col p-1 gap-0.5">
                  <div className="w-full h-1.5 bg-neutral-700 rounded-sm"></div>
                  <div className="w-3/4 h-1 bg-neutral-700 rounded-sm"></div>
                  <div className="flex-1 bg-neutral-700 rounded-sm mt-1"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.config?.publicationName || t.untitled}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{item.config?.language || "en"}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{item.config?.templateId || "default"}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-CA') : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/preview?id=${item.id}`} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Preview">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/dashboard/editor?id=${item.id}`} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Customize Visually">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => exportFile(item.id, "png")}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <span className="ml-4 px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                  {t.completed}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
