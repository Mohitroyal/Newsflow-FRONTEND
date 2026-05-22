"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useGenerationStore, useUIStore } from "@/store";
import { generationService } from "@/services/generation.service";
import EditorSidebar from "@/components/editor/EditorSidebar";
import Toolbar from "@/components/editor/Toolbar";
import DraggableBlock from "@/components/editor/DraggableBlock";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Capacitor } from "@capacitor/core";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") as string;
  const { generations, updateGeneration } = useGenerationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [generation, setGeneration] = useState<any>(null);
  const [layout, setLayout] = useState<any>({
    blocks: [],
    backgroundColor: "#ffffff",
    fontFamily: "playfair",
  });
  
  const [zoom, setZoom] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await generationService.getById(id);
        if (res.success && res.data) {
          setGeneration(res.data);
          
          if (res.data.custom_layout) {
            setLayout(res.data.custom_layout);
          } else {
            const content = res.data.content_formatted || {};
            const initialBlocks: any[] = [];
            let currentY = 40;

            // Masthead Logo
            const brandKey = res.data.logo_id || "bharath_reporter";
            let host = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-space-name.hf.space";
            const logoUrl = `${host}/static/logos/${brandKey}.svg`;
            initialBlocks.push({ id: "header-logo", type: "image", src: logoUrl, x: 160, y: currentY, w: 800, h: 120 });
            currentY += 160;

            // Headline
            const headlineText = content.headline || res.data.headline || "Headline";
            initialBlocks.push({ id: "headline", type: "text", content: headlineText, x: 40, y: currentY, w: 1040, h: 120, fontSize: 56, fontWeight: "900", textAlign: "center", color: "#000" });
            currentY += 140;

            if (content.subheadline) {
              initialBlocks.push({ id: "subheadline", type: "text", content: content.subheadline, x: 40, y: currentY, w: 1040, h: 60, fontSize: 24, fontWeight: "normal", fontStyle: "italic", textAlign: "center", color: "#444" });
              currentY += 80;
            }

            const metaText = `${content.byline ? "By " + content.byline : ""} ${content.dateline ? "| " + content.dateline : ""}`.trim();
            if (metaText) {
              initialBlocks.push({ id: "meta", type: "text", content: metaText, x: 40, y: currentY, w: 1040, h: 30, fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#666" });
              currentY += 60;
            }

            // Images
            if (res.data.image_urls && res.data.image_urls.length > 0) {
              const imgCount = res.data.image_urls.length;
              const gap = 25;
              const imgW = (1040 - (gap * (imgCount - 1))) / imgCount;
              let imgX = 40;
              res.data.image_urls.forEach((url: string, i: number) => {
                initialBlocks.push({ id: `img-${i}`, type: "image", src: url, x: imgX, y: currentY, w: imgW, h: 320 });
                imgX += imgW + gap;
              });
              currentY += 360;
            } else if (res.data.image_url) {
              initialBlocks.push({ id: "main-img", type: "image", src: res.data.image_url, x: 160, y: currentY, w: 800, h: 420 });
              currentY += 460;
            }

            // Sections (Dynamic columns)
            if (content.sections && Array.isArray(content.sections)) {
              const numCols = res.data.layout_columns || 3;
              const totalWidth = 1040;
              const colGap = 40;
              const colWidth = (totalWidth - (colGap * (numCols - 1))) / numCols;
              let colYs = Array(numCols).fill(currentY);

              content.sections.forEach((para: any, i: number) => {
                const text = typeof para === 'string' ? para : para.content || "";
                if (!text) return;
                
                // Find shortest column
                let minColIdx = 0;
                for (let j = 1; j < numCols; j++) {
                  if (colYs[j] < colYs[minColIdx]) minColIdx = j;
                }

                const pX = 40 + (colWidth + colGap) * minColIdx;
                const pY = colYs[minColIdx];
                // approximate height based on characters and column width
                const charPerLine = colWidth / 8; // approx 8px per char
                const lines = Math.ceil(text.length / charPerLine);
                const approxHeight = Math.max(80, lines * 25);

                initialBlocks.push({ id: `para-${i}`, type: "text", content: text, x: pX, y: pY, w: colWidth, h: approxHeight, fontSize: 16, fontWeight: "normal", textAlign: "justify", color: "#111" });
                
                colYs[minColIdx] += approxHeight + 25;
              });
            }

            setLayout({
              backgroundColor: "#ffffff",
              fontFamily: res.data.font_family || "playfair",
              blocks: initialBlocks
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const saveLayout = async () => {
    try {
      await api.put(`/generate/${id}/layout`, { custom_layout: layout });
      // The backend will now render in background.
      router.push(`/dashboard/preview?id=${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save layout");
    }
  };

  const updateBlock = (blockId: string, updates: any) => {
    if (updates._delete) {
      setLayout((prev: any) => ({
        ...prev,
        blocks: prev.blocks.filter((b: any) => b.id !== blockId)
      }));
      return;
    }
    setLayout((prev: any) => ({
      ...prev,
      blocks: prev.blocks.map((b: any) => b.id === blockId ? { ...b, ...updates } : b)
    }));
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>;
  if (!generation) return <div className="flex h-screen items-center justify-center text-white">Generation not found.</div>;

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-900' : 'h-[calc(100vh-6rem)]'}`}>
      <Toolbar 
        zoom={zoom} 
        setZoom={setZoom} 
        onSave={saveLayout} 
        generation={generation}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar layout={layout} setLayout={setLayout} selectedBlockId={selectedBlockId} updateBlock={updateBlock} />
        
        <div 
          className="flex-1 bg-neutral-800 overflow-auto flex justify-center p-12 relative custom-scrollbar"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBlockId(null);
          }}
        >
           <div 
            className="bg-white shadow-2xl relative"
            style={{ 
              width: 1120 * zoom, 
              height: 1600 * zoom,
              transformOrigin: "top center",
              backgroundColor: layout.backgroundColor,
              fontFamily: layout.fontFamily === 'playfair' || layout.fontFamily === 'merriweather' ? 'var(--font-serif)' : 
                          layout.fontFamily === 'inter' ? 'var(--font-sans)' : 
                          layout.fontFamily === 'courier' ? 'monospace' : 'inherit'
            }}
          >
            {layout.blocks.map((block: any) => (
              <DraggableBlock 
                key={block.id} 
                block={block} 
                updateBlock={updateBlock} 
                zoom={zoom}
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
