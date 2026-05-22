import os

with open('src/app/dashboard/generate/page.tsx', 'r', encoding='utf-8') as f:
    original_code = f.read()

new_generate_form = """
import { ChevronDown, ChevronUp } from "lucide-react";

// We will use a wrapper for collapsible sections on mobile
function MobileCollapsible({ title, icon, subtitle, children, defaultOpen = true }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 lg:p-6 lg:cursor-default lg:pointer-events-none"
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
        <div className="lg:hidden text-gray-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div className={`px-4 pb-4 lg:px-6 lg:pb-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
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
      pasteToStart: "Paste your article text to start",
      viewFullscreen: "View Fullscreen"
    },
    te: {
      generateNewspaper: "?????????????? ???????????",
      configureDetails: "????? ?? ??????????? ???????? ????????? ??????",
      language: "???",
      articleContent: "?????? ???????",
      articlePlaceholder: "?? ????? ???????? ????? ?????????? ???? AI?? ????????????????...",
      featuredImages: "????? ????? ????? ???????? (????????? 3)",
      dragDrop: "?????????? ????? ?????? & ??????",
      clickToBrowse: "???? ????? ?????? ???? ?????? ??????",
      more: "???????",
      uploading: "???????? ???????????...",
      typographyStyle: "????????? ????",
      selectLogo: "???????????? ?????? ?????????",
      layoutTemplate: "??????? ?????????:",
      setFromTemplates: "(?????????? ???? ????? ???? ?????????)",
      aiCrafting: "AI ?????????????...",
      generateClipping: "??????????? ???????????",
      applyingFormat: "AI ?????????????? ????????????????...",
      editorsWorking: "?? ????????? ?? ??????????? ?????????? ??? ????????????",
      readyToGenerate: "?????????????? ???????? ????",
      pasteToStart: "???????????????? ?? ????? ???????? ??????????",
      viewFullscreen: "?????? ??????????? ???????????"
    },
    hi: {
      generateNewspaper: "????? ?????",
      configureDetails: "???? ???? ???????? ????? ????????? ????",
      language: "????",
      articleContent: "??? ???????",
      articlePlaceholder: "???? ??? ??? ???? ????? ???? ?? AI ?? ????? ???...",
      featuredImages: "????? ??? ????? (?????? 3)",
      dragDrop: "????? ?? ???? ?????? ?? ??????",
      clickToBrowse: "?? ??????? ???? ?? ??? ????? ????",
      more: "??",
      uploading: "????? ?? ??? ??...",
      typographyStyle: "??????????? ????",
      selectLogo: "????? ?? ???? ?????",
      layoutTemplate: "????? ????????:",
      setFromTemplates: "(???????? ????? ?? ??? ???? ???)",
      aiCrafting: "AI ??? ??? ??...",
      generateClipping: "???????? ?????",
      applyingFormat: "AI ??????????? ???? ?? ??? ??...",
      editorsWorking: "????? ?????? ???? ???????? ????? ?? ??? ?? ??? ???",
      readyToGenerate: "????? ?? ??? ?????",
      pasteToStart: "???? ???? ?? ??? ???? ??? ??? ????? ????",
      viewFullscreen: "??????????? ??? ?????"
    }
  };

  const t = generateTranslations[activeUiLanguage as keyof typeof generateTranslations] || generateTranslations.en;

  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const editId = searchParams.get("editId");
  
  const { generate, exportFile, isLoading, error } = useGeneration();
  const { currentConfig, setConfig, generations } = useGenerationStore();
  
  const editConfig = editId ? generations.find(g => g.id === editId)?.config : null;

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
    const gen = await generate(config);
    
    if (gen && lockedTemplateId === "custom") {
      router.push(`/dashboard/editor?id=${gen.id}`);
    }
    // Scroll to top on mobile to see the preview
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto gap-6 p-4 lg:p-6">
        
        {/* Left Side: Controls */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto custom-scrollbar lg:pr-2 pb-24 lg:pb-0">
          
          <MobileCollapsible title="Choose Language" subtitle="Select the language for your newspaper." icon={<Globe className="w-5 h-5 text-primary-400" />}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    language === lang.id ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-black/40"
                  }`}
                >
                  <span className={`font-bold text-sm ${language === lang.id ? "text-primary-400" : "text-gray-300"}`}>{lang.label}</span>
                </button>
              ))}
            </div>
          </MobileCollapsible>

          <MobileCollapsible title="Article Content" subtitle="Write or paste your story here." icon={<Type className="w-5 h-5 text-blue-400" />}>
            <textarea 
              rows={8}
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              placeholder={t.articlePlaceholder}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary-500 resize-y min-h-[200px]"
            />
          </MobileCollapsible>

          <MobileCollapsible title="Attach Media" subtitle="Upload images for your article (max 3)." icon={<ImageIcon className="w-5 h-5 text-purple-400" />} defaultOpen={false}>
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
          </MobileCollapsible>

          <MobileCollapsible title="Select Template" subtitle="Choose the newspaper brand & style." icon={<LayoutTemplate className="w-5 h-5 text-orange-400" />} defaultOpen={false}>
            <div className="flex flex-col gap-3">
              {TEMPLATES_LIST.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => setLogoId(tpl.id)}
                  className={`relative flex items-center gap-4 p-3 border rounded-2xl cursor-pointer transition-all ${
                    logoId === tpl.id ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-black/40 hover:bg-white/5"
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
          </MobileCollapsible>

          {/* Action Button for Desktop (and standard flow) */}
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !articleContent.trim()}
            className="hidden lg:flex w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-2xl font-bold justify-center items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isLoading ? "Generating Layout..." : "Generate Newspaper"}
          </button>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full lg:w-1/2 flex flex-col bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden order-first lg:order-last min-h-[300px] lg:min-h-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
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
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h3 className="text-white font-bold">Your Newspaper</h3>
                <button onClick={() => setIsFullscreen(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col items-center">
                <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden relative cursor-pointer hover:shadow-primary-500/20 transition-shadow" onClick={() => setIsFullscreen(true)}>
                  <img src={latestGeneration.png_url} className="w-full h-auto object-cover" alt="Preview" />
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mt-6 pb-4">
                  <button 
                    onClick={() => handleDownloadNative(latestGeneration.png_url || "", "png")}
                    className="bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" /> Save PNG
                  </button>
                  <button 
                    onClick={() => handleDownloadNative(latestGeneration.pdf_url || "", "pdf")}
                    className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <Newspaper className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-white font-bold">Ready to Generate</p>
              <p className="text-sm text-gray-400 mt-2">{t.pasteToStart}</p>
            </div>
          )}
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/90 backdrop-blur-md border-t border-white/10 z-50">
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !articleContent.trim()}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isLoading ? "Generating Layout..." : "Generate Newspaper"}
          </button>
        </div>

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

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary-500" /></div>}>
      <GenerateForm />
    </Suspense>
  );
}
"""

start_idx = original_code.find('function GenerateForm() {')
if start_idx != -1:
    final_code = original_code[:start_idx] + new_generate_form
    if "import { ChevronDown" not in final_code:
        final_code = final_code.replace('import { Upload, Type, LayoutTemplate, Globe, Download, Maximize2, Sparkles, Newspaper, Check, X, Image as ImageIcon, Loader2, Camera as CameraIcon, ChevronRight, ChevronLeft, Save } from "lucide-react";', 'import { Upload, Type, LayoutTemplate, Globe, Download, Maximize2, Sparkles, Newspaper, Check, X, Image as ImageIcon, Loader2, Camera as CameraIcon, ChevronRight, ChevronLeft, Save, ChevronDown, ChevronUp } from "lucide-react";')
    with open('src/app/dashboard/generate/page.tsx', 'w', encoding='utf-8') as f:
        f.write(final_code)
    print("Successfully updated generate/page.tsx")
else:
    print("Failed to find GenerateForm")
