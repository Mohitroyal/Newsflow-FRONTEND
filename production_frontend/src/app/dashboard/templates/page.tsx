"use client";

import { useState, useEffect } from "react";
import { Lock, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUIStore } from "@/store";

const templates = [
  { id: "bharath_reporter", nameKey: "bharathName", descKey: "bharathDesc", columns: 3, isPremium: false, tags: ["Heritage", "All Languages"] },
  { id: "rti_express", nameKey: "rtiName", descKey: "rtiDesc", columns: 3, isPremium: false, tags: ["Investigative", "All Languages"] },
  { id: "national_news", nameKey: "nationalName", descKey: "nationalDesc", columns: 3, isPremium: false, tags: ["Global Record", "All Languages"] },
  { id: "extra_news", nameKey: "extraName", descKey: "extraDesc", columns: 3, isPremium: false, tags: ["Visual Wrap", "All Languages"] },
  { id: "classic-split", nameKey: "classicName", descKey: "classicDesc", columns: 2, isPremium: false, tags: ["All Languages", "Popular"] },
  { id: "broadsheet", nameKey: "broadsheetName", descKey: "broadsheetDesc", columns: 3, isPremium: false, tags: ["English", "Hindi"] },
  { id: "hero-image", nameKey: "heroName", descKey: "heroDesc", columns: 1, isPremium: false, tags: ["All Languages"] },
  { id: "tabloid", nameKey: "tabloidName", descKey: "tabloidDesc", columns: 2, isPremium: false, tags: ["English", "Telugu"] },
  { id: "magazine", nameKey: "magazineName", descKey: "magazineDesc", columns: 3, isPremium: false, tags: ["All Languages"] },
];

const templatesTranslations = {
  en: {
    title: "Templates",
    subtitle: "Choose a layout to start generating",
    free: "Free",
    pro: "Pro",
    upgrade: "Upgrade to Use",
    use: "Use Template",
    tags: {
      "Heritage": "Heritage",
      "All Languages": "All Languages",
      "Investigative": "Investigative",
      "Global Record": "Global Record",
      "Visual Wrap": "Visual Wrap",
      "Popular": "Popular",
      "English": "English",
      "Hindi": "Hindi",
      "Telugu": "Telugu",
    },
    names: {
      bharathName: "Bharath Reporter",
      rtiName: "RTI Express",
      nationalName: "National News Reporter",
      extraName: "The Extra News",
      classicName: "Classic Split",
      broadsheetName: "Broadsheet",
      heroName: "Hero Image",
      tabloidName: "Tabloid",
      magazineName: "Magazine Style",
      customName: "Custom Template",
    },
    descriptions: {
      bharathDesc: "Traditional royal Indian broadsheet",
      rtiDesc: "Fearless investigative morning newspaper",
      nationalDesc: "Elite global broadsheet journal of record",
      extraDesc: "Wrapped inline image style",
      classicDesc: "Two-column layout with prominent headline",
      broadsheetDesc: "Full-width traditional broadsheet style",
      heroDesc: "Large hero image with text below",
      tabloidDesc: "Bold headlines with dramatic imagery",
      magazineDesc: "Modern editorial magazine layout",
      customDesc: "Advanced drag & drop visual editor",
    }
  },
  te: {
    title: "టెంప్లేట్లు",
    subtitle: "సృష్టించడం ప్రారంభించడానికి లేఅవుట్‌ను ఎంచుకోండి",
    free: "ఉచితం",
    pro: "ప్రో",
    upgrade: "ఉపయోగించడానికి అప్‌గ్రేడ్ చేయండి",
    use: "టెంప్లేట్ ఉపయోగించండి",
    tags: {
      "Heritage": "వారసత్వం",
      "All Languages": "అన్ని భాషలు",
      "Investigative": "పరిశోధనాత్మక",
      "Global Record": "గ్లోబల్ రికార్డ్",
      "Visual Wrap": "విజువల్ ర్యాప్",
      "Popular": "జనాదరణ పొందినది",
      "English": "ఇంగ్లీష్",
      "Hindi": "హిందీ",
      "Telugu": "తెలుగు",
    },
    names: {
      bharathName: "భారత్ రిపోర్టర్",
      rtiName: "ఆర్‌టిఐ ఎక్స్‌ప్రెస్",
      nationalName: "నేషనల్ న్యూస్ రిపోర్టర్",
      extraName: "ది ఎక్స్‌ట్రా న్యూస్",
      classicName: "క్లాసిక్ స్ప్లిట్",
      broadsheetName: "బ్రాడ్‌షీట్",
      heroName: "హీరో ఇమేజ్",
      tabloidName: "టాబ్లాయిడ్",
      magazineName: "మ్యాగజൈన్ స్టైల్",
    },
    descriptions: {
      bharathDesc: "సాంప్రదాయ రాయల్ ఇండియన్ బ్రాడ్‌షీట్",
      rtiDesc: "నిర్భయమైన పరిశోధనాత్మక ఉదయపు వార్తాపత్రిక",
      nationalDesc: "ఎలైట్ గ్లోబల్ బ్రాడ్‌షీట్ జర్నల్ ఆఫ్ రికార్డ్",
      extraDesc: "చుట్టబడిన ఇన్‌లైన్ చిత్రం శైలి",
      classicDesc: "ప్రముఖ శీర్షికతో రెండు నిలువు వరుసల లేఅవుట్",
      broadsheetDesc: "పూర్తి వెడల్పు సాంప్రదాయ బ్రాడ్‌షీట్ శైలి",
      heroDesc: "కింద వచనంతో పెద్ద హీరో చిత్రం",
      tabloidDesc: "నాటకీయ చిత్రాలతో కూడిన బోల్డ్ ముఖ్యాంశాలు",
      magazineDesc: "ఆధునిక సంపాదకీయ పత్రిక లేఅవుట్",
    }
  },
  hi: {
    title: "टेम्पलेट्स",
    subtitle: "जनरेट करना शुरू करने के लिए एक लेआउट चुनें",
    free: "मुफ़्त",
    pro: "प्रो",
    upgrade: "उपयोग करने के लिए अपग्रेड करें",
    use: "टेम्पलेट का उपयोग करें",
    tags: {
      "Heritage": "विरासत",
      "All Languages": "सभी भाषाएँ",
      "Investigative": "खोजी",
      "Global Record": "वैश्विक रिकॉर्ड",
      "Visual Wrap": "विजुअल रैप",
      "Popular": "लोकप्रिय",
      "English": "अंग्रेजी",
      "Hindi": "हिंदी",
      "Telugu": "तेलुगु",
    },
    names: {
      bharathName: "भारत रिपोर्टर",
      rtiName: "आरटीआई एक्सप्रेस",
      nationalName: "नेशनल न्यूज़ रिपोर्टर",
      extraName: "द एक्स्ट्रा न्यूज़",
      classicName: "क्लासिक स्प्लिट",
      broadsheetName: "ब्रॉडशीट",
      heroName: "हीरो इमेज",
      tabloidName: "टैब्लॉयड",
      magazineName: "पत्रिका शैली",
    },
    descriptions: {
      bharathDesc: "पारंपरिक शाही भारतीय ब्रॉडशीट",
      rtiDesc: "निडर खोजी सुबह का समाचार पत्र",
      nationalDesc: "कुलीन वैश्विक ब्रॉडशीट जर्नल ऑफ रिकॉर्ड",
      extraDesc: "रैप्ड इनलाइन छवि शैली",
      classicDesc: "प्रमुख मुख्य समाचार के साथ दो-कॉलम लेआउट",
      broadsheetDesc: "पूर्ण-चौड़ाई पारंपरिक ब्रॉडशीट शैली",
      heroDesc: "नीचे पाठ के साथ बड़ी मुख्य छवि",
      tabloidDesc: "नाटकीय दृश्यों के साथ साहसिक सुर्खियां",
      magazineDesc: "आधुनिक संपादकीय पत्रिका लेआउट",
    }
  },
  kn: {
    title: "ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
    subtitle: "ರಚಿಸಲು ಪ್ರಾರಂಭಿಸಲು ವಿನ್ಯಾಸವನ್ನು ಆರಿಸಿ",
    free: "ಉಚಿತ",
    pro: "ಪ್ರೊ",
    upgrade: "ಬಳಸಲು ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    use: "ಟೆಂಪ್ಲೇಟ್ ಬಳಸಿ",
    tags: {
      "Heritage": "ಪರಂಪರೆ",
      "All Languages": "ಎಲ್ಲಾ ಭಾಷೆಗಳು",
      "Investigative": "ತನಿಖಾತ್ಮಕ",
      "Global Record": "ಜಾಗತಿಕ ದಾಖಲೆ",
      "Visual Wrap": "ದೃಶ್ಯ ಸುತ್ತು",
      "Popular": "ಜನಪ್ರಿಯ",
      "English": "ಇಂಗ್ಲಿಷ್",
      "Hindi": "ಹಿಂದಿ",
      "Telugu": "ತೆಲುಗು",
    },
    names: {
      bharathName: "ಭಾರತ್ ರಿಪೋರ್ಟರ್",
      rtiName: "ಆರ್‌ಟಿಐ ಎಕ್ಸ್‌ಪ್ರೆಸ್",
      nationalName: "ನ್ಯಾಷನಲ್ ನ್ಯೂಸ್ ರಿಪೋರ್ಟರ್",
      extraName: "ದಿ ಎಕ್ಸ್‌ಟ್ರಾ ನ್ಯೂಸ್",
      classicName: "ಕ್ಲಾಸಿಕ್ ಸ್ಪ್ಲಿಟ್",
      broadsheetName: "ಬ್ರಾಡ್‌ಶೀಟ್",
      heroName: "ಹೀರೋ ಇಮೇಜ್",
      tabloidName: "ಟ್ಯಾಬ್ಲಾಯ್ಡ್",
      magazineName: "ಮ್ಯಾಗಜೀൻ ಶೈಲಿ",
    },
    descriptions: {
      bharathDesc: "ಸಾಂಪ್ರದಾಯಿಕ ರಾಯಲ್ ಇಂಡಿಯನ್ ಬ್ರಾಡ್‌ಶೀಟ್",
      rtiDesc: "ನಿರ್ಭೀತ ತನಿಖಾ ಮುಂಜಾನೆ ಪತ್ರಿಕೆ",
      nationalDesc: "ಗಣ್ಯ ಜಾಗತಿಕ ಬ್ರಾಡ್‌ಶೀಟ್ ಜರ್ನಲ್ ಆಫ್ ರೆಕಾರ್ಡ್",
      extraDesc: "ಸುತ್ತುವರಿದ ಇನ್ಲೈನ್ ಚಿತ್ರ ಶೈಲಿ",
      classicDesc: "ಪ್ರಮುಖ ಶೀರ್ಷಿಕೆಯೊಂದಿಗೆ ಎರಡು ಕಾಲಮ್ ವಿನ್ಯಾಸ",
      broadsheetDesc: "ಪೂರ್ಣ-ಅಗಲ ಸಾಂప్రದಾಯಿಕ ಬ್ರಾಡ್‌ಶೀಟ್ ಶೈಲಿ",
      heroDesc: "ಕೆಳಗೆ ಪಠ್ಯದೊಂದಿಗೆ ದೊಡ್ಡ ಹೀರೋ ಚಿತ್ರ",
      tabloidDesc: "ಅದ್ಭುತ ಚಿತ್ರಣದೊಂದಿಗೆ ದಪ್ಪ ಶೀರ್ಷಿಕೆಗಳು",
      magazineDesc: "ಆಧುನಿಕ ಸಂಪಾದಕೀಯ ನಿಯತಕಾಲಿಕೆ ವಿನ್ಯಾಸ",
    }
  },
  ta: {
    title: "வார்ப்புருக்கள்",
    subtitle: "உருவாக்கத் தொடங்க ஒரு தளவமைப்பைத் தேர்ந்தெடுக்கவும்",
    free: "இலவசம்",
    pro: "புரோ",
    upgrade: "பயன்படுத்த மேம்படுத்தவும்",
    use: "வார்ப்புருவைப் பயன்படுத்து",
    tags: {
      "Heritage": "பாரம்பரியம்",
      "All Languages": "அனைத்து மொழிகளும்",
      "Investigative": "புலனாய்வு",
      "Global Record": "உலகளாவிய பதிவு",
      "Visual Wrap": "காட்சி உறை",
      "Popular": "பிரபலமானது",
      "English": "ஆங்கிலம்",
      "Hindi": "இந்தி",
      "Telugu": "தெலுங்கு",
    },
    names: {
      bharathName: "பாரத் ரிப்போர்ட்டர்",
      rtiName: "ஆர்டிஐ எக்ஸ்பிரஸ்",
      nationalName: "நேஷனல் நியூஸ் ரிப்போர்ட்டர்",
      extraName: "தி எக்ஸ்ட்ரா நியூஸ்",
      classicName: "கிளாசிக் ஸ்பிலிட்",
      broadsheetName: "பிராட்ஷீட்",
      heroName: "ஹீரோ இமேஜ்",
      tabloidName: "டேப்ளாய்ட்",
      magazineName: "மேகசின் ஸ்டைல்",
    },
    descriptions: {
      bharathDesc: "பாரம்பரிய அரச இந்திய பிராட்ஷீட்",
      rtiDesc: "அச்சமற்ற புலனாய்வு காலை செய்தித்தாள்",
      nationalDesc: "உலகளாவிய முதன்மை பிராட்ஷீட் பதிவு இதழ்",
      extraDesc: "சுற்றப்பட்ட இன்லைன் பட பாணி",
      classicDesc: "முக்கிய தலைப்புடன் கூடிய இரண்டு நெடுவரிசை தளவமைப்பு",
      broadsheetDesc: "முழு அகல பாரம்பரிய பிராட்ஷீட் பாணி",
      heroDesc: "கீழே உரையுடன் கூடிய பெரிய ஹீரோ படம்",
      tabloidDesc: "வியத்தகு படங்களுடன் கூடிய தடித்த தலைப்புகள்",
      magazineDesc: "நவீன தலையங்க இதழ் தளவமைப்பு",
    }
  },
  ml: {
    title: "ടെംപ്ലേറ്റുകൾ",
    subtitle: "സൃഷ്ടിക്കാൻ ആരംഭിക്കുന്നതിന് ഒരു ലേഔട്ട് തിരഞ്ഞെടുക്കുക",
    free: "സൗജന്യ",
    pro: "പ്രോ",
    upgrade: "ഉപയോഗിക്കാൻ അപ്‌ഗ്രേഡ് ചെയ്യുക",
    use: "ടെംപ്ലേറ്റ് ഉപയോഗിക്കുക",
    tags: {
      "Heritage": "പൈതൃകം",
      "All Languages": "എല്ലാ ഭാഷകളും",
      "Investigative": "അന്വേഷണാത്മകം",
      "Global Record": "ആഗോള റെക്കോർഡ്",
      "Visual Wrap": "വിഷ്വൽ റാപ്പ്",
      "Popular": "ജനപ്രിയം",
      "English": "ഇംഗ്ലീഷ്",
      "Hindi": "ഹിന്ദി",
      "Telugu": "തെലുങ്ക്",
    },
    names: {
      bharathName: "ഭാരത് റിപ്പോർട്ടർ",
      rtiName: "ആർടിഐ എക്സ്പ്രസ്സ്",
      nationalName: "നാഷണൽ ന്യൂസ് റിപ്പോർട്ടർ",
      extraName: "ദി എക്സ്ട്രാ ന്യൂസ്",
      classicName: "ക്ലാസിക് സ്പ്ലിറ്റ്",
      broadsheetName: "ബ്രോഡ്ഷീറ്റ്",
      heroName: "ഹീറോ ഇമേജ്",
      tabloidName: "ടാബ്ലോയ്ഡ്",
      magazineName: "മാഗസിൻ സ്റ്റൈൽ",
    },
    descriptions: {
      bharathDesc: "പരമ്പരാഗത റോയൽ ഇന്ത്യൻ ബ്രോഡ്‌ഷീറ്റ്",
      rtiDesc: "ധീരമായ അന്വേഷണാത്മക രാവിലത്തെ പത്രം",
      nationalDesc: "എലൈറ്റ് ഗ്ലോബൽ ബ്രോഡ്ഷീറ്റ് ജേണൽ",
      extraDesc: "ഇൻലൈൻ ഇമേജ് ശൈലി",
      classicDesc: "പ്രമുഖ തലക്കെട്ടോടു കൂടിയ രണ്ട് കോളം ലേഔട്ട്",
      broadsheetDesc: "പരമ്പരാഗത ബ്രോഡ്ഷീറ്റ് ശൈലി",
      heroDesc: "താഴെ വാചകത്തോടുകൂടിയ വലിയ ഹീറോ ചിത്രം",
      tabloidDesc: "നാടകീയമായ ചിത്രങ്ങളുള്ള ബോൾഡ് തലക്കെട്ടുകൾ",
      magazineDesc: "ആധനിക എഡിറ്റോറിയൽ മാഗസിൻ ലേഔട്ട്",
    }
  }
};

function NewsThumb({ id, columns }: { id: string; columns: number }) {
  return (
    <div className="w-full h-32 bg-[#fdfbf7] rounded-lg flex flex-col p-2 gap-1 border border-gray-200 overflow-hidden">
      <div className="w-full h-2 bg-gray-800 rounded-sm" />
      <div className="w-3/4 h-1.5 bg-gray-400 rounded-sm" />
      <div className={`flex-1 grid gap-1 mt-1`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-sm flex flex-col gap-0.5 p-1">
            <div className="w-full h-1 bg-gray-400 rounded-sm" />
            <div className="w-2/3 h-1 bg-gray-300 rounded-sm" />
            <div className="flex-1 bg-gray-300 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const { language } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLanguage = mounted ? language : "en";
  const t = templatesTranslations[activeLanguage as keyof typeof templatesTranslations] || templatesTranslations.en;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((template, i) => {
          const name = t.names[template.nameKey as keyof typeof t.names] || template.id;
          const description = t.descriptions[template.descKey as keyof typeof t.descriptions] || "";
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-pointer"
            >
              {template.isPremium && (
                <div className="absolute top-3 right-3 z-10 bg-yellow-500/90 backdrop-blur text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t.pro.toUpperCase()}
                </div>
              )}

              <div className="p-3">
                <NewsThumb id={template.id} columns={template.columns} />
              </div>

              <div className="px-4 pb-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => {
                    const translatedTag = t.tags[tag as keyof typeof t.tags] || tag;
                    return (
                      <span key={tag} className="text-[10px] font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {translatedTag}
                      </span>
                    );
                  })}
                </div>

                {template.isPremium ? (
                  <Link
                    href="/dashboard/subscription"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    <Lock className="h-3 w-3" /> {t.upgrade}
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/generate?template=${template.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Check className="h-3 w-3" /> {t.use}
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
