"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Type, LayoutTemplate, Globe, Download, Maximize2, Sparkles, Newspaper, Check, X, Image as ImageIcon, Camera as CameraIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneration } from "@/hooks/useGeneration";
import { useGenerationStore, useUIStore } from "@/store";
import { generationService } from "@/services/generation.service";
import type { Language, TemplateId, Tone } from "@/types";
import { useDropzone } from "react-dropzone";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const TEMPLATES_LIST = [
  {
    id: "bharath_reporter" as const,
    name: "Bharath Reporter",
    description: "Traditional Royal Broadsheet",
    accent: "from-green-600 to-orange-500",
    themeName: "Heritage Green & Saffron",
    tag: "National Heritage",
    textColor: "text-green-500",
    bgColor: "bg-white",
    borderColor: "border-[#15a850]/30",
    colors: ["#15a850", "#f28e1c", "#ffffff"],
    icon: (
      <svg viewBox="0 0 100 35" className="w-full h-full">
        <rect x="2" y="2" width="96" height="31" fill="none" stroke="#15a850" strokeWidth="0.8" />
        <rect x="3.5" y="3.5" width="93" height="28" fill="none" stroke="#f28e1c" strokeWidth="0.3" />
        <text x="6" y="7" fontSize="2" fill="#cc3333" fontWeight="bold" fontFamily="sans-serif">LICENCE No: HDP/010</text>
        <text x="6" y="22" fontSize="16" fontWeight="bold" fill="#15a850" stroke="#000" strokeWidth="0.3" fontFamily="serif">భారత్</text>
        <g transform="translate(6, 25)">
          <rect x="0" y="0" width="45" height="5" fill="#f28e1c" />
          <text x="2" y="3.5" fontSize="2.8" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">BHARATH REPORTER</text>
          
          <rect x="46" y="0" width="40" height="5" fill="#15a850" />
          <text x="66" y="3.5" fontSize="2.8" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">రిపోర్టర్</text>
        </g>
      </svg>
    )
  },
  {
    id: "rti_express" as const,
    name: "RTI Express",
    description: "Fearless Investigative",
    accent: "from-blue-600 to-blue-800",
    themeName: "Investigative Royal Blue",
    tag: "Fearless Press",
    textColor: "text-blue-600",
    bgColor: "bg-white",
    borderColor: "border-[#1d70b8]/30",
    colors: ["#1d70b8", "#ffffff"],
    icon: (
      <svg viewBox="0 0 100 35" className="w-full h-full">
        <rect x="2" y="2" width="96" height="31" fill="none" stroke="#1d70b8" strokeWidth="0.8" />
        <rect x="3.2" y="3.2" width="93.6" height="28.6" fill="none" stroke="#1d70b8" strokeWidth="0.3" />
        
        <g transform="translate(6, 5)">
          <rect x="0" y="2" width="12" height="18" fill="none" stroke="#1d70b8" strokeWidth="0.8" />
          <rect x="3" y="5" width="12" height="18" fill="#ffffff" stroke="#1d70b8" strokeWidth="0.8" />
          <circle cx="9" cy="11" r="2.5" fill="#1d70b8" />
          <rect x="8.2" y="11" width="1.6" height="7" fill="#1d70b8" />
        </g>
        
        <text x="25" y="16" fontSize="12" fontWeight="bold" fill="#1d70b8" fontFamily="serif">RTI</text>
        <text x="25" y="26" fontSize="10.5" fontWeight="bold" fill="#1d70b8" fontFamily="serif">EXPRESS</text>
        
        <line x1="25" y1="29" x2="45" y2="29" stroke="#1d70b8" strokeWidth="0.3" />
        <text x="58" y="30.5" fontSize="3" fontStyle="italic" fontWeight="bold" fill="#1d70b8" textAnchor="middle" fontFamily="serif">Right to News</text>
        <line x1="71" y1="29" x2="92" y2="29" stroke="#1d70b8" strokeWidth="0.3" />
      </svg>
    )
  },
  {
    id: "national_news" as const,
    name: "National News Reporter",
    description: "Elite Global Journal",
    accent: "from-purple-600 to-indigo-800",
    themeName: "Imperial Purple & Crimson",
    tag: "Global Record",
    textColor: "text-purple-400",
    bgColor: "bg-[#761c9e]",
    borderColor: "border-[#761c9e]/40",
    colors: ["#761c9e", "#ffffff", "#cc2424", "#1b2e4b"],
    icon: (
      <svg viewBox="0 0 100 35" className="w-full h-full">
        <rect x="0" y="0" width="100" height="35" fill="#761c9e" />
        <rect x="1.5" y="1.5" width="97" height="32" fill="none" stroke="#ffffff" strokeWidth="0.4" />
        <rect x="2.5" y="2.5" width="95" height="30" fill="none" stroke="#000000" strokeWidth="0.3" />
        
        <text x="6" y="20" fontSize="12.5" fontWeight="bold" fill="#ffffff" fontFamily="serif">నేషనల్ న్యూస్</text>
        
        <g transform="translate(85, 23) rotate(-10)">
          <text x="0" y="0" fontSize="4.2" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">రిపోర్టర్</text>
        </g>
        
        <g transform="translate(6, 23)">
          <rect x="0" y="0" width="70" height="8" fill="#ffffff" />
          <rect x="0.5" y="0.5" width="69" height="7" fill="#000000" />
          
          <rect x="1" y="1" width="43" height="6" fill="#cc2424" />
          <text x="3" y="5.2" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">NATIONAL</text>
          
          <rect x="45" y="1" width="23" height="6" fill="#1b2e4b" />
          <text x="46" y="5.2" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">NEWS</text>
        </g>
      </svg>
    )
  },
  {
    id: "extra_news" as const,
    name: "The Extra News",
    description: "Wrapped Inline Image Style",
    accent: "from-blue-500 to-blue-700",
    themeName: "Classic Blue Extra",
    tag: "Visual Wrap",
    textColor: "text-blue-500",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-600/30",
    colors: ["#3b82f6", "#1e40af", "#ffffff"],
    icon: (
      <svg viewBox="0 0 100 35" className="w-full h-full">
        <rect x="0" y="0" width="100" height="35" fill="#3b82f6" />
        <text x="6" y="11" fontSize="6.5" fontStyle="italic" fontWeight="bold" fill="#ffffff" fontFamily="serif">THE</text>
        <text x="6" y="28" fontSize="17.5" fontWeight="900" fill="#ffffff" fontFamily="sans-serif" letterSpacing="0.8">EXTRA NEWS</text>
      </svg>
    )
  }
];

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

// ... existing code ...

// We will use a wrapper for collapsible sections on mobile
function MobileCollapsible({ title, icon, subtitle, children, defaultOpen = true }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-white font-bold">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div className={`px-4 pb-4 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}

function GenerateForm() {
  const router = useRouter();
  const { language: uiLanguage } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const activeUiLanguage = mounted ? uiLanguage : "en";

  const generateTranslations = {
    en: {
      generateNewspaper: "Generate Newspaper",
      configureDetails: "Configure your clipping details below",
      language: "Language",
      articleContent: "Article Content",
      articlePlaceholder: "Paste your article text here or let AI generate it...",
      featuredImages: "Featured Article Images (Max 3)",
      dragDrop: "Drag & drop image here",
      clickToBrowse: "or click to browse up to",
      more: "more",
      uploading: "Uploading...",
      typographyStyle: "Typography Style",
      selectLogo: "Select Newspaper Logo",
      layoutTemplate: "Layout Template:",
      setFromTemplates: "(set from Templates page)",
      aiCrafting: "AI is Crafting...",
      generateClipping: "Generate Clipping",
      applyingFormat: "Applying AI Formatting...",
      editorsWorking: "Our editors are working on your broadsheet layout",
      readyToGenerate: "Ready to Generate",
      pasteToStart: "Paste your article text on the left to start",
      viewFullscreen: "View Fullscreen"
    },
    te: {
      generateNewspaper: "వార్తాపత్రికను సృష్టించండి",
      configureDetails: "దిగువ మీ క్లిప్పింగ్ వివరాలను కాన్ఫిగర్ చేయండి",
      language: "భాష",
      articleContent: "వ్యాసం కంటెంట్",
      articlePlaceholder: "మీ వ్యాస వచనాన్ని ఇక్కడ అతికించండి లేదా AIని సృష్టించనివ్వండి...",
      featuredImages: "ఫీచర్ చేసిన వ్యాస చిత్రాలు (గరిష్టంగా 3)",
      dragDrop: "చిత్రాన్ని ఇక్కడ లాగండి & వదలండి",
      clickToBrowse: "లేదా ఇక్కడ క్లిక్ చేసి బ్రౌజ్ చేయండి",
      more: "మరిన్ని",
      uploading: "అప్‌లోడ్ చేయబడుతోంది...",
      typographyStyle: "టైపోగ్రఫీ శైలి",
      selectLogo: "వార్తాపత్రిక లోగోను ఎంచుకోండి",
      layoutTemplate: "లేఅవుట్ టెంప్లేట్:",
      setFromTemplates: "(టెంప్లేట్ల పేజీ నుండి సెట్ చేయబడింది)",
      aiCrafting: "AI సృష్టిస్తోంది...",
      generateClipping: "క్లిప్పింగ్ సృష్టించండి",
      applyingFormat: "AI ఫార్మాటింగ్‌ను వర్తింపజేస్తోంది...",
      editorsWorking: "మా సంపాదకులు మీ బ్రాడ్‌షీట్ లేఅవుట్‌లో పని చేస్తున్నారు",
      readyToGenerate: "సృష్టించడానికి సిద్ధంగా ఉంది",
      pasteToStart: "ప్రారంభించడానికి ఎడమవైపు మీ వ్యాస వచనాన్ని అతికించండి",
      viewFullscreen: "పూర్తి స్క్రీన్‌లో వీక్షించండి"
    },
    hi: {
      generateNewspaper: "अखबार बनाएं",
      configureDetails: "नीचे अपना क्लिपिंग विवरण कॉन्फ़िगर करें",
      language: "भाषा",
      articleContent: "लेख सामग्री",
      articlePlaceholder: "अपना लेख पाठ यहाँ पेस्ट करें या AI को बनाने दें...",
      featuredImages: "विशेष लेख चित्र (अधिकतम 3)",
      dragDrop: "चित्र को यहां खींचें और छोड़ें",
      clickToBrowse: "या ब्राउज़ करने के लिए क्लिक करें",
      more: "और",
      uploading: "अपलोड हो रहा है...",
      typographyStyle: "टाइपोग्राफी शैली",
      selectLogo: "अखबार का लोगो चुनें",
      layoutTemplate: "लेआउट टेम्पलेट:",
      setFromTemplates: "(टेम्पलेट पृष्ठ से सेट किया गया)",
      aiCrafting: "AI बना रहा है...",
      generateClipping: "क्लिपिंग बनाएं",
      applyingFormat: "AI फ़ॉर्मेटिंग लागू कर रहा है...",
      editorsWorking: "हमारे संपादक आपके ब्रॉडशीट लेआउट पर काम कर रहे हैं",
      readyToGenerate: "बनाने के लिए तैयार",
      pasteToStart: "शुरू करने के लिए बाईं ओर अपना लेख पाठ पेस्ट करें",
      viewFullscreen: "फ़ुलस्क्रीन में देखें"
    }
  };

  const t = generateTranslations[activeUiLanguage as keyof typeof generateTranslations] || generateTranslations.en;

  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const editId = searchParams.get("editId");
  
  const { generate, exportFile, isLoading, error } = useGeneration();
  const { currentConfig, setConfig, generations } = useGenerationStore();
  
  // If editing an existing generation, use its config
  const editConfig = editId ? generations.find(g => g.id === editId)?.config : null;

  const [articleContent, setArticleContent] = useState(editConfig?.articleContent || currentConfig.articleContent || "");
  const [headline, setHeadline] = useState(editConfig?.headline || currentConfig.headline || "");
  const [language, setLanguage] = useState<Language>((editConfig?.language as Language) || (currentConfig.language as Language) || "en");
  const [tone, setTone] = useState<Tone>((editConfig?.tone as Tone) || (currentConfig.tone as Tone) || "formal");
  
  // Resolve layoutId from URL (set by Templates page) — this is locked
  const lockedTemplateId: string = (() => {
    if (editConfig?.templateId) return editConfig.templateId;
    if (templateParam) return templateParam;
    return currentConfig.templateId || "bharath_reporter";
  })();

  // Separate: which LOGO/IDENTITY is selected (only 4 core publication brands)
  // Default logo to the locked template if it's one of the 4 core brands
  const defaultLogoId: TemplateId = (() => {
    const coreBrands = ["bharath_reporter", "rti_express", "national_news", "extra_news"];
    if (editConfig?.templateId && coreBrands.includes(editConfig.templateId)) return editConfig.templateId as TemplateId;
    if (currentConfig.templateId && coreBrands.includes(currentConfig.templateId)) return currentConfig.templateId as TemplateId;
    return "bharath_reporter" as TemplateId;
  })();

  const [logoId, setLogoId] = useState<TemplateId>(defaultLogoId);
  const [imageUrls, setImageUrls] = useState<string[]>(editConfig?.imageUrls || currentConfig.imageUrls || []);
  
  // Resolve layoutColumns based on locked template param if present
  let initialColumns = 3;
  if (editConfig?.layoutColumns) {
    initialColumns = editConfig.layoutColumns;
  } else if (templateParam) {
    if (templateParam === "classic-split" || templateParam === "tabloid") {
      initialColumns = 2;
    } else if (templateParam === "hero-image" || templateParam === "custom") {
      initialColumns = 1;
    } else {
      initialColumns = 3;
    }
  } else if (currentConfig.layoutColumns) {
    initialColumns = currentConfig.layoutColumns;
  }
  const [layoutColumns, setLayoutColumns] = useState<number>(initialColumns);
  
  const [isUploading, setIsUploading] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>(editConfig?.fontFamily || currentConfig.fontFamily || "calibri");
  const [publicationName, setPublicationName] = useState(
    editConfig?.publicationName || (currentConfig.publicationName && currentConfig.publicationName !== "The Daily Chronicle"
      ? currentConfig.publicationName
      : "Bharath Reporter")
  );
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const latestGeneration = generations[0];

  // When logo changes, update publication name to match
  useEffect(() => {
    if (logoId === "bharath_reporter") {
      setPublicationName("Bharath Reporter");
    } else if (logoId === "rti_express") {
      setPublicationName("RTI Express");
    } else if (logoId === "national_news") {
      setPublicationName("National News Reporter");
    } else if (logoId === "extra_news") {
      setPublicationName("The Extra News");
    }
  }, [logoId]);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of acceptedFiles) {
        const res = await generationService.uploadImage(file);
        if (res.success && res.data.url) {
          urls.push(res.data.url);
        }
      }
      setImageUrls((prev) => [...prev, ...urls].slice(0, 3)); // Max 3 images
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 3
  });

  const handleNativeImage = async (source: CameraSource) => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source
      });
      if (image.webPath) {
        setIsUploading(true);
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `upload_${Date.now()}.${image.format}`, { type: `image/${image.format}` });
        const res = await generationService.uploadImage(file);
        if (res.success && res.data.url) {
          setImageUrls((prev) => [...prev, res.data.url].slice(0, 3));
        }
        setIsUploading(false);
      }
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  };

  const handleDownloadNative = async (url: string, type: 'png' | 'pdf') => {
    if (Capacitor.isNativePlatform()) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          await Filesystem.writeFile({
            path: `newscraft_${Date.now()}.${type}`,
            data: base64data,
            directory: Directory.Documents,
          });
          alert(`Saved to Documents folder`);
        };
      } catch (e) {
        console.error('Download failed', e);
      }
    } else {
      exportFile(latestGeneration.id, type);
    }
  };

  const handleGenerate = async () => {
    const localeMap: Record<string, string> = {
      en: "en-US", hi: "hi-IN", te: "te-IN", ta: "ta-IN", kn: "kn-IN", ml: "ml-IN"
    };

    const config = {
      articleContent,
      headline,
      language,
      tone,
      templateId: lockedTemplateId,  // layout from Templates page
      logoId,                          // brand/logo identity from logo selector
      imageUrl: imageUrls[0] || "",
      imageUrls,
      layoutColumns,
      publicationName,
      fontFamily,
      publicationDate: new Date().toLocaleDateString(localeMap[language] || "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    };
    
    setConfig(config);
    const gen = await generate(config);
    
    if (gen) {
      if (lockedTemplateId === "custom") {
        router.push(`/dashboard/editor/${gen.id}`);
      }
      // For all other templates, we DO NOT redirect.
      // The user will simply view the generated clipping in the right panel on this same page.
    }
  };

  return (
    <>
      {/* MOBILE UI */}
      <div className="flex flex-col lg:hidden w-full h-full pb-24 space-y-4 px-4 pt-4 overflow-y-auto custom-scrollbar">
        
        {/* Mobile Header */}
        <div className="mb-2">
            <h2 className="text-2xl font-bold text-white">{t.generateNewspaper}</h2>
            <p className="text-sm text-gray-400 mt-1">{t.configureDetails}</p>
        </div>

        {error && (
            <div className="bg-red-950/50 border border-red-900/50 text-red-500 p-3 rounded-xl text-sm">
            {error}
            </div>
        )}

        {/* Mobile Language */}
        <MobileCollapsible title={t.language} icon={<Globe className="w-5 h-5 text-primary-400" />} subtitle="Select your preferred language.">
            <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "en", label: "English" },
                  { id: "te", label: "Telugu" },
                  { id: "hi", label: "Hindi" },
                  { id: "kn", label: "Kannada" },
                  { id: "ta", label: "Tamil" },
                  { id: "ml", label: "Malayalam" }
                ].map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as Language)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      language === lang.id ? "border-primary-500 bg-primary-500/10 text-primary-400" : "border-white/10 bg-black/40 text-gray-400"
                    }`}
                  >
                    <span className="font-bold text-sm">{lang.label}</span>
                  </button>
                ))}
            </div>
        </MobileCollapsible>

        {/* Mobile Content */}
        <MobileCollapsible title={t.articleContent} icon={<Type className="w-5 h-5 text-blue-400" />} subtitle="Write or paste your story here.">
            <textarea 
                rows={6}
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder={t.articlePlaceholder}
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary-500 resize-y"
            />
        </MobileCollapsible>

        {/* Mobile Media */}
        <MobileCollapsible title={t.featuredImages} icon={<ImageIcon className="w-5 h-5 text-purple-400" />} subtitle="Upload images (max 3)." defaultOpen={false}>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                    onClick={() => handleNativeImage && handleNativeImage(CameraSource.Camera)}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-transform"
                >
                    <CameraIcon className="w-5 h-5 text-gray-300 mb-1" />
                    <span className="text-[10px] font-semibold text-white">Take Photo</span>
                </button>
                <button 
                    onClick={() => handleNativeImage && handleNativeImage(CameraSource.Photos)}
                    className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-transform"
                >
                    <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                    <span className="text-[10px] font-semibold text-white">Gallery</span>
                </button>
            </div>
            
            {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-white/20 aspect-video group bg-black">
                      <img src={url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-contain" />
                      <button 
                        onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[10px] font-bold"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
            )}
        </MobileCollapsible>

        {/* Mobile Templates */}
        <MobileCollapsible title="Select Template" icon={<LayoutTemplate className="w-5 h-5 text-orange-400" />} subtitle="Choose your newspaper brand." defaultOpen={false}>
            <div className="flex flex-col gap-3">
                {TEMPLATES_LIST.map((tpl) => (
                  <div 
                    key={tpl.id}
                    onClick={() => setLogoId(tpl.id)}
                    className={`relative flex items-center gap-4 p-3 border rounded-2xl cursor-pointer transition-all ${
                      logoId === tpl.id ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/50" : "border-white/10 bg-black/40"
                    }`}
                  >
                    <div className={`w-[70px] h-[36px] rounded-lg ${tpl.bgColor} border ${tpl.borderColor} p-1 flex items-center justify-center shrink-0`}>
                      {tpl.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-sm font-bold text-white truncate">{tpl.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{tpl.tag}</p>
                    </div>
                    {logoId === tpl.id && (
                      <div className="absolute right-3">
                        <Check className="w-4 h-4 text-primary-500" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
        </MobileCollapsible>

        {/* Mobile Preview Area */}
        <div className="mt-4 border border-white/10 rounded-3xl overflow-hidden bg-neutral-900 shadow-xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[300px]">
                <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                <p className="text-white font-medium">Crafting...</p>
              </div>
            ) : latestGeneration?.png_url ? (
              <div className="flex flex-col">
                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h3 className="text-sm text-white font-bold">Preview</h3>
                  <button onClick={() => setIsFullscreen(true)} className="p-1.5 bg-white/10 rounded-full">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="p-4 bg-neutral-800 flex justify-center cursor-pointer" onClick={() => setIsFullscreen(true)}>
                    <img src={latestGeneration.png_url} className="w-full max-w-[300px] shadow-2xl rounded-sm" alt="Preview" />
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 bg-neutral-950">
                    <button 
                        onClick={() => handleDownloadNative(latestGeneration.png_url || "", "png")}
                        className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-primary-600 py-2 rounded-xl"
                    >
                        <Download className="h-3 w-3" /> Save PNG
                    </button>
                    <button 
                        onClick={() => handleDownloadNative(latestGeneration.pdf_url || "", "pdf")}
                        className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-white/10 py-2 rounded-xl"
                    >
                        <Download className="h-3 w-3" /> Save PDF
                    </button>
                </div>
              </div>
            ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center min-h-[250px] bg-neutral-950/50">
                    <Newspaper className="h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-gray-400 text-sm">Tap Generate to create clipping.</p>
                </div>
            )}
        </div>

        {/* Mobile Sticky Generate Button */}
        <div className="fixed bottom-[70px] left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-50">
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !articleContent}
              className="w-full bg-white text-black py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isLoading ? t.aiCrafting : t.generateClipping}
            </button>
        </div>

      </div>


      <div className="hidden lg:flex gap-6 h-full max-h-[calc(100vh-10rem)]">
        {/* Left Panel - Controls */}
        <div className="w-[450px] shrink-0 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 bg-neutral-950/50 shrink-0">
            <h2 className="text-xl font-bold text-white">{t.generateNewspaper}</h2>
            <p className="text-sm text-gray-400 mt-1">{t.configureDetails}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="space-y-5 bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary-400" /> {t.language}
              </label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Type className="h-4 w-4 text-primary-400" /> {t.articleContent}
              </label>
              <textarea 
                rows={5}
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder={t.articlePlaceholder}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary-400" /> {t.featuredImages}
              </label>
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-white/20 aspect-video group bg-black">
                      <img src={url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                          className="bg-red-500 text-white p-1 rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {imageUrls.length < 3 && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4 lg:hidden">
                    <button 
                      onClick={() => handleNativeImage(CameraSource.Camera)}
                      className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-transform"
                    >
                      <CameraIcon className="w-5 h-5 text-gray-300 mb-1" />
                      <span className="text-[10px] font-semibold text-white">Take Photo</span>
                    </button>
                    <button 
                      onClick={() => handleNativeImage(CameraSource.Photos)}
                      className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-transform"
                    >
                      <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                      <span className="text-[10px] font-semibold text-white">Gallery</span>
                    </button>
                  </div>
                  <div 
                  {...getRootProps()} 
                  className={`hidden lg:block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary-500 bg-primary-500/10" : "border-white/20 hover:border-white/40 bg-black"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                      <p className="text-sm text-gray-400">{t.uploading}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                      <p className="text-sm text-gray-300 font-medium">{t.dragDrop}</p>
                      <p className="text-xs text-gray-500">{t.clickToBrowse} {3 - imageUrls.length} {t.more}</p>
                    </div>
                  )}
                </div>
                </>
              )}
            </div>
            
            {/* Font / Typography Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Type className="h-4 w-4 text-primary-400" /> {t.typographyStyle}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "playfair", label: "Playfair", sub: "Classic Serif" },
                  { id: "merriweather", label: "Merriweather", sub: "Editorial" },
                  { id: "inter", label: "Inter", sub: "Modern Sans" },
                  { id: "courier", label: "Courier", sub: "Typewriter" },
                  { id: "calibri", label: "Calibri", sub: "Clean Sans" },
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      fontFamily === font.id
                        ? "border-primary-500 bg-primary-500/10 text-white"
                        : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-sm font-semibold">{font.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{font.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Columns Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-primary-400" /> Layout Columns
              </label>
              <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden p-1">
                {[1, 2, 3].map((col) => (
                  <button
                    key={col}
                    onClick={() => setLayoutColumns(col)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      layoutColumns === col
                        ? "bg-primary-500/20 text-primary-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {col} {col === 1 ? 'Column' : 'Columns'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary-400" /> {t.selectLogo}
              </label>

              {/* Read-only active template badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400">
                <LayoutTemplate className="h-3.5 w-3.5 text-primary-400" />
                <span>{t.layoutTemplate}</span>
                <span className="text-white font-semibold capitalize">{lockedTemplateId.replace(/_/g, ' ').replace(/-/g, ' ')}</span>
                <span className="ml-auto text-[10px] text-gray-600 italic">{t.setFromTemplates}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {TEMPLATES_LIST.map((tpl) => {
                  const isSelected = logoId === tpl.id;
                  return (
                    <motion.div 
                      key={tpl.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setLogoId(tpl.id)}
                      className={`relative flex flex-col p-3.5 border rounded-2xl cursor-pointer transition-all overflow-hidden ${
                        isSelected 
                          ? "border-primary-500 bg-primary-500/10 ring-2 ring-primary-500/20" 
                          : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      {/* Badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          {tpl.tag}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-black stroke-[3px]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Logo Mini-Canvas */}
                        <div className={`w-[90px] h-[48px] rounded-lg ${tpl.bgColor} border ${tpl.borderColor} p-1.5 flex items-center justify-center flex-shrink-0 shadow-md`}>
                          {tpl.icon}
                        </div>

                        {/* Brand Info */}
                        <div className="flex-1 min-w-0 pr-16">
                          <h4 className="text-sm font-bold text-white truncate">{tpl.name}</h4>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">{tpl.description}</p>
                          
                          {/* Theme pill / Colors */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex gap-0.5">
                              {tpl.colors.map((c, i) => (
                                <div key={i} className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-gray-500">{tpl.themeName}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
          </div>

          <div className="p-6 pt-4 border-t border-white/10 shrink-0 space-y-4 bg-neutral-900 z-10">
            {error && (
              <div className="bg-red-950/50 border border-red-900/50 text-red-500 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !articleContent}
              className="w-full bg-white text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 animate-pulse" />}
              {isLoading ? t.aiCrafting : t.generateClipping}
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col">
          {/* Preview Toolbar */}
          <div className="h-14 border-b border-white/10 bg-neutral-950/80 backdrop-blur flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="ml-4 text-xs font-mono text-gray-500">
                {latestGeneration?.id ? `clipping_${latestGeneration.id.slice(0, 8)}.png` : "preview_canvas.png"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {latestGeneration?.status === "completed" && (
                <>
                  <button 
                    onClick={() => handleDownloadNative(latestGeneration.png_url || "", "png")}
                    className="flex items-center gap-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="h-3 w-3" /> PNG
                  </button>
                  <button 
                    onClick={() => handleDownloadNative(latestGeneration.pdf_url || "", "pdf")}
                    className="flex items-center gap-2 text-xs font-medium text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="h-3 w-3" /> PDF
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-neutral-800 p-8 flex items-center justify-center">
            {isLoading ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-white font-medium">{t.applyingFormat}</p>
                <p className="text-sm text-gray-400">{t.editorsWorking}</p>
              </div>
            ) : latestGeneration?.png_url ? (
              <div className="relative group cursor-pointer" onClick={() => setIsFullscreen(true)}>
                 <img 
                  src={latestGeneration.png_url} 
                  alt="Newspaper Preview" 
                  className="w-full max-w-[600px] shadow-2xl rounded-sm transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                  <button className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg pointer-events-none">
                    <Maximize2 className="h-4 w-4" /> {t.viewFullscreen}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[500px] aspect-[1/1.4] bg-[#fdfbf7] shadow-2xl relative p-8 flex flex-col items-center justify-center text-center">
                 <Newspaper className="h-16 w-16 text-gray-400 mb-4" />
                 <h3 className="text-gray-400 font-serif text-xl">{t.readyToGenerate}</h3>
                 <p className="text-gray-400 text-sm mt-2">{t.pasteToStart}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && latestGeneration?.png_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110]"
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-h-full max-w-full flex items-center justify-center cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                  src={latestGeneration.png_url}
                  alt="Fullscreen Newspaper Preview"
                  className="max-w-full max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white"
                />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary-500" /></div>}>
      <GenerateForm />
    </Suspense>
  );
}
