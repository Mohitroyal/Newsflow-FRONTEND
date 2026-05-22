import os

target_file = "src/app/dashboard/generate/page.tsx"
with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Chevron imports
if "ChevronDown" not in content:
    content = content.replace("Loader2 } from \"lucide-react\";", "Loader2, ChevronDown, ChevronUp } from \"lucide-react\";")

# 2. Add MobileCollapsible function
mobile_collapsible = """// We will use a wrapper for collapsible sections on mobile
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

function GenerateForm() {"""

if "function MobileCollapsible" not in content:
    content = content.replace("function GenerateForm() {", mobile_collapsible)

# 3. We need to find the `return (` of GenerateForm and replace the entire JSX to split mobile/desktop.
# It's much safer to replace the Desktop layout container line.

desktop_target = """<div className="flex flex-col lg:flex-row gap-6 h-full lg:max-h-[calc(100vh-10rem)] overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0">"""
desktop_replacement = """<div className="hidden lg:flex gap-6 h-full max-h-[calc(100vh-10rem)]">"""
content = content.replace(desktop_target, desktop_replacement)

# Remove the flex-col lg: hidden hacks inside the desktop panel to make it purely desktop again
content = content.replace("""<div className="w-full lg:w-[450px] shrink-0 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">""", """<div className="w-[450px] shrink-0 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">""")

content = content.replace("""{/* Right Panel - Preview */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-0">""", """{/* Right Panel - Preview */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col">""")

# 4. Now, we insert the Mobile UI right BEFORE the Desktop UI
# To do this, we find:
# return (
#    <>
#      <div className="hidden lg:flex gap-6 h-full max-h-[calc(100vh-10rem)]">
# We insert the Mobile UI between `<>` and the Desktop UI.

mobile_ui = """      {/* MOBILE UI */}
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

"""

insert_target = """  return (
    <>"""
if "MOBILE UI" not in content:
    content = content.replace(insert_target, insert_target + "\n" + mobile_ui)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Split UI successfully")
