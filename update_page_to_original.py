import os
import re

original_file = r"C:\Users\MOHIT\Downloads\final newscraft\newscraft-ai-figma-design\src\app\dashboard\generate\page.tsx"
target_file = "src/app/dashboard/generate/page.tsx"

with open(original_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Capacitor imports
imports_target = """import { useDropzone } from "react-dropzone";"""
imports_replacement = """import { useDropzone } from "react-dropzone";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';"""
content = content.replace(imports_target, imports_replacement)

# 2. Add Native Functions inside GenerateForm
functions_target = """  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 3
  });"""

functions_replacement = """  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
  };"""
content = content.replace(functions_target, functions_replacement)

# 3. Fix Layout Classes for Responsiveness
layout_target = """<div className="flex gap-6 h-full max-h-[calc(100vh-10rem)]">
        {/* Left Panel - Controls */}
        <div className="w-[450px] shrink-0 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">"""

layout_replacement = """<div className="flex flex-col lg:flex-row gap-6 h-full lg:max-h-[calc(100vh-10rem)] overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-[450px] shrink-0 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col">"""
content = content.replace(layout_target, layout_replacement)

# Also fix the Right panel min-height for mobile so it doesn't collapse
right_panel_target = """{/* Right Panel - Preview */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col">"""
right_panel_replacement = """{/* Right Panel - Preview */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-0">"""
content = content.replace(right_panel_target, right_panel_replacement)

# 4. Add Native Camera Buttons & fix upload block
upload_target = """{imageUrls.length < 3 && (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary-500 bg-primary-500/10" : "border-white/20 hover:border-white/40 bg-black"
                  }`}
                >"""

upload_replacement = """{imageUrls.length < 3 && (
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
                >"""
if "import { Camera as CameraIcon" not in content:
    content = content.replace("Image as ImageIcon", "Image as ImageIcon, Camera as CameraIcon")
content = content.replace(upload_target, upload_replacement)

# Close the newly added Fragment for upload block
upload_end_target = """<ImageIcon className="h-8 w-8 text-gray-500" />
                      <p className="text-sm text-gray-300 font-medium">{t.dragDrop}</p>
                      <p className="text-xs text-gray-500">{t.clickToBrowse} {3 - imageUrls.length} {t.more}</p>
                    </div>
                  )}
                </div>
              )}"""

upload_end_replacement = """<ImageIcon className="h-8 w-8 text-gray-500" />
                      <p className="text-sm text-gray-300 font-medium">{t.dragDrop}</p>
                      <p className="text-xs text-gray-500">{t.clickToBrowse} {3 - imageUrls.length} {t.more}</p>
                    </div>
                  )}
                </div>
                </>
              )}"""
content = content.replace(upload_end_target, upload_end_replacement)

# 5. Replace Download native calls
dl_png_target = """onClick={() => exportFile(latestGeneration.id, "png")}"""
dl_png_replace = """onClick={() => handleDownloadNative(latestGeneration.png_url || "", "png")}"""
content = content.replace(dl_png_target, dl_png_replace)

dl_pdf_target = """onClick={() => exportFile(latestGeneration.id, "pdf")}"""
dl_pdf_replace = """onClick={() => handleDownloadNative(latestGeneration.pdf_url || "", "pdf")}"""
content = content.replace(dl_pdf_target, dl_pdf_replace)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully restored original page.tsx and added mobile responsiveness.")
