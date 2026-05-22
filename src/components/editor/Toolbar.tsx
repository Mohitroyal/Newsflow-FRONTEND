"use client";

import { Save, ZoomIn, ZoomOut, Download, Maximize2, Minimize2, Undo, Redo, Layout } from "lucide-react";
import { useGeneration } from "@/hooks/useGeneration";

export default function Toolbar({ zoom, setZoom, onSave, generation, isFullscreen, setIsFullscreen }: any) {
  const { exportFile } = useGeneration();
  return (
    <div className="h-14 bg-neutral-950 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <Layout className="h-5 w-5 text-primary-500" />
          <span>Editor</span>
        </div>
        
        <div className="h-6 w-px bg-white/10 mx-2" />
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Undo">
            <Undo className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Redo">
            <Redo className="h-4 w-4" />
          </button>
        </div>
        
        <div className="h-6 w-px bg-white/10 mx-2" />
        
        <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center text-gray-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)} 
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        
        {generation?.png_url && (
          <button 
            onClick={() => exportFile(generation.id, "png")}
            className="flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="h-3 w-3" /> PNG
          </button>
        )}
        {generation?.pdf_url && (
          <button 
            onClick={() => exportFile(generation.id, "pdf")}
            className="flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="h-3 w-3" /> PDF
          </button>
        )}
        
        <button 
          onClick={onSave}
          className="flex items-center gap-2 text-sm font-medium text-black bg-primary-500 hover:bg-primary-400 px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" /> Save & Render
        </button>
      </div>
    </div>
  );
}
