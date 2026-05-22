import re

with open('src/app/dashboard/generate/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
imports_target = """import { useState, useEffect, useCallback } from "react";
import { Upload, Type, LayoutTemplate, Globe, Download, Maximize2, Sparkles, Newspaper, Check, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneration } from "@/hooks/useGeneration";
import { useGenerationStore, useUIStore } from "@/store";
import { generationService } from "@/services/generation.service";
import type { Language, TemplateId, Tone } from "@/types";
import { useDropzone } from "react-dropzone";"""

imports_replacement = """import { useState, useEffect, useCallback } from "react";
import { Upload, Type, LayoutTemplate, Globe, Download, Maximize2, Sparkles, Newspaper, Check, X, Image as ImageIcon, Loader2, Camera as CameraIcon, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneration } from "@/hooks/useGeneration";
import { useGenerationStore, useUIStore } from "@/store";
import { generationService } from "@/services/generation.service";
import type { Language, TemplateId, Tone } from "@/types";
import { useDropzone } from "react-dropzone";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";"""

content = content.replace(imports_target, imports_replacement)

# 2. Extract GenerateForm
pattern = re.compile(r'function GenerateForm\(\) \{.*?(?=export default function GeneratorPage\(\) \{)', re.DOTALL)

generate_form_new = """function GenerateForm() {
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
  
  const editConfig = editId ? generations.find(g => g.id === editId)?.config : null;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [articleContent, setArticleContent] = useState(editConfig?.articleContent || currentConfig.articleContent || "");
  const [headline, setHeadline] = useState(editConfig?.headline || currentConfig.headline || "");
  const [language, setLanguage] = useState<Language>((editConfig?.language as Language) || (currentConfig.language as Language) || "en");
  const [tone, setTone] = useState<Tone>((editConfig?.tone as Tone) || (currentConfig.tone as Tone) || "formal");
  
  const lockedTemplateId: string = (() => {
    if (editConfig?.templateId) return editConfig.templateId;
    if (templateParam) return templateParam;
    return currentConfig.templateId || "bharath_reporter";
  })();

  const defaultLogoId: TemplateId = (() => {
    const coreBrands = ["bharath_reporter", "rti_express", "national_news", "extra_news"];
    if (editConfig?.templateId && coreBrands.includes(editConfig.templateId)) return editConfig.templateId as TemplateId;
    if (currentConfig.templateId && coreBrands.includes(currentConfig.templateId)) return currentConfig.templateId as TemplateId;
    return "bharath_reporter" as TemplateId;
  })();

  const [logoId, setLogoId] = useState<TemplateId>(defaultLogoId);
  const [imageUrls, setImageUrls] = useState<string[]>(editConfig?.imageUrls || currentConfig.imageUrls || []);
  
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
  const [fontFamily, setFontFamily] = useState<string>(editConfig?.fontFamily || currentConfig.fontFamily || "playfair");
  const [publicationName, setPublicationName] = useState(
    editConfig?.publicationName || (currentConfig.publicationName && currentConfig.publicationName !== "The Daily Chronicle"
      ? currentConfig.publicationName
      : "Bharath Reporter")
  );
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const latestGeneration = generations[0];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      setImageUrls((prev) => [...prev, ...urls].slice(0, 3));
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
    const config = {
      articleContent,
      headline,
      language,
      tone,
      templateId: lockedTemplateId,
      logoId,
      imageUrl: imageUrls[0] || "",
      imageUrls,
      layoutColumns,
      publicationName,
      fontFamily,
      publicationDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    };
    
    setConfig(config);
    setCurrentStep(5);
    const gen = await generate(config);
    
    if (gen && lockedTemplateId === "custom") {
      router.push(`/dashboard/editor/${gen.id}`);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-neutral-900 md:border md:border-white/10 md:rounded-3xl overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-neutral-800">
          <div 
            className="h-full bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-neutral-950/50 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-white">{t.generateNewspaper}</h2>
            <p className="text-xs text-gray-400">Step {currentStep} of {totalSteps}</p>
          </div>
          {currentStep > 1 && currentStep < 5 && (
            <button onClick={prevStep} className="p-2 bg-white/5 rounded-full text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-neutral-900 pb-24">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Language Selection */}
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Choose Language</h3>
                    <p className="text-xs text-gray-400">Select the language for your newspaper.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        language === lang.id ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-black/40"
                      }`}
                    >
                      <span className={`font-bold ${language === lang.id ? "text-primary-400" : "text-gray-300"}`}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Article Input */}
            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Type className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Article Content</h3>
                    <p className="text-xs text-gray-400">Write or paste your story here.</p>
                  </div>
                </div>
                
                <textarea 
                  rows={8}
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder={t.articlePlaceholder}
                  className="w-full flex-1 bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary-500 resize-none min-h-[250px]"
                />
              </motion.div>
            )}

            {/* Step 3: Image Upload */}
            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Attach Media</h3>
                    <p className="text-xs text-gray-400">Upload images for your article (max 3).</p>
                  </div>
                </div>

                {/* Capacitor Native Upload Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => handleNativeImage(CameraSource.Camera)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-transform"
                  >
                    <CameraIcon className="w-6 h-6 text-gray-300 mb-2" />
                    <span className="text-xs font-semibold text-white">Take Photo</span>
                  </button>
                  <button 
                    onClick={() => handleNativeImage(CameraSource.Photos)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-transform"
                  >
                    <ImageIcon className="w-6 h-6 text-gray-300 mb-2" />
                    <span className="text-xs font-semibold text-white">Choose Gallery</span>
                  </button>
                </div>

                {/* Web Fallback Drag and Drop */}
                <div className="hidden md:block">
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-primary-500 bg-primary-500/10" : "border-white/20 bg-black"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <p className="text-sm text-gray-300 font-medium">Drag & drop for web</p>
                  </div>
                </div>

                {isUploading && (
                  <div className="flex items-center justify-center gap-2 p-4 text-primary-400">
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                  </div>
                )}

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-white/20 aspect-square group bg-black">
                        <img src={url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Template Selection */}
            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <LayoutTemplate className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Select Template</h3>
                    <p className="text-xs text-gray-400">Choose the newspaper brand & style.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {TEMPLATES_LIST.map((tpl) => (
                    <div 
                      key={tpl.id}
                      onClick={() => setLogoId(tpl.id)}
                      className={`relative flex items-center gap-4 p-3 border rounded-2xl transition-all ${
                        logoId === tpl.id ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-black/40"
                      }`}
                    >
                      <div className={`w-20 h-12 rounded-lg ${tpl.bgColor} border ${tpl.borderColor} p-1 flex items-center justify-center shrink-0`}>
                        {tpl.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                        <p className="text-[10px] text-gray-400">{tpl.tag}</p>
                      </div>
                      {logoId === tpl.id && <Check className="w-5 h-5 text-primary-500" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Generation & Preview */}
            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center"
              >
                {isLoading ? (
                  <div className="text-center space-y-4 py-20">
                    <div className="relative mx-auto w-24 h-24">
                      <div className="absolute inset-0 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-white font-medium text-lg">AI is Crafting...</p>
                    <p className="text-sm text-gray-400 max-w-[250px] mx-auto text-center">Rendering the newspaper layout and optimizing assets.</p>
                  </div>
                ) : latestGeneration?.png_url ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-4 px-2">
                      <h3 className="text-white font-bold text-lg">Your Newspaper</h3>
                      <button onClick={() => setIsFullscreen(true)} className="p-2 bg-white/10 rounded-full">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    
                    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden relative cursor-pointer" onClick={() => setIsFullscreen(true)}>
                      <img src={latestGeneration.png_url} className="w-full h-auto object-cover" alt="Preview" />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-6">
                      <button 
                        onClick={() => handleDownloadNative(latestGeneration.png_url, "png")}
                        className="bg-primary-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save PNG
                      </button>
                      <button 
                        onClick={() => handleDownloadNative(latestGeneration.pdf_url, "pdf")}
                        className="bg-white/10 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Export PDF
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-red-400">Failed to generate clipping.</p>
                    <button onClick={prevStep} className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-white">Go Back</button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {currentStep < 5 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-neutral-950 border-t border-white/10 flex justify-end">
            {currentStep < 4 ? (
              <button 
                onClick={nextStep}
                disabled={(currentStep === 2 && !articleContent.trim())}
                className="w-full bg-primary-500 text-black py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleGenerate}
                className="w-full bg-white text-black py-3.5 rounded-xl font-bold flex justify-center items-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Generate Newspaper
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Interactive Modal with Zoom */}
      <AnimatePresence>
        {isFullscreen && latestGeneration?.png_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-[110] flex justify-between items-center">
              <span className="text-white font-bold shadow-black">Preview</span>
              <button onClick={() => setIsFullscreen(false)} className="p-2 bg-white/20 rounded-full">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit={true}
            >
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center p-4">
                <img
                  src={latestGeneration.png_url}
                  alt="Fullscreen Preview"
                  className="max-w-full max-h-[90vh] object-contain shadow-2xl bg-white rounded-md"
                />
              </TransformComponent>
            </TransformWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
"""

content = re.sub(pattern, generate_form_new, content)

with open('src/app/dashboard/generate/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("GenerateForm successfully replaced with mobile wizard logic!")
