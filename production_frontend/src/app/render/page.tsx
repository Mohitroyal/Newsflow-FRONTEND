"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { generationService } from "@/services/generation.service";

function RenderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const [layout, setLayout] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await generationService.getByIdPublic(id);
        if (res.success && res.data?.custom_layout) {
          setLayout(res.data.custom_layout);
        } else {
            // fallback layout if nothing was saved yet
            setLayout({
                backgroundColor: "#ffffff",
                fontFamily: res.data?.font_family || "playfair",
                blocks: []
            });
        }
      } catch (err) {
        console.error("Failed to load generation for rendering", err);
      }
    }
    load();
  }, [id]);

  if (!layout) return <div>Loading...</div>;

  return (
    <div 
      className="newspaper-container"
      style={{
        width: "1200px",
        minHeight: "1600px",
        backgroundColor: layout.backgroundColor,
        fontFamily: layout.fontFamily === 'playfair' || layout.fontFamily === 'merriweather' ? 'var(--font-serif)' : 
                    layout.fontFamily === 'inter' ? 'var(--font-sans)' : 
                    layout.fontFamily === 'courier' ? 'monospace' : 'inherit',
        position: "relative",
        overflow: "hidden"
      }}
    >
      {layout.blocks.map((block: any) => (
        <div
          key={block.id}
          style={{
            position: "absolute",
            left: block.x,
            top: block.y,
            width: block.w,
            height: block.h,
          }}
        >
          {block.type === "text" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                fontSize: `${block.fontSize}px`,
                fontWeight: block.fontWeight,
                textAlign: block.textAlign as any,
                color: block.color,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                overflow: "hidden"
              }}
            >
              {block.content}
            </div>
          ) : block.type === "image" ? (
            <img 
              src={block.src} 
              alt="" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function RenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RenderContent />
    </Suspense>
  );
}
