"use client";

import { Download, Share2, Edit, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGenerationStore } from "@/store";
import { useGeneration } from "@/hooks/useGeneration";

import { Suspense } from "react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const generations = useGenerationStore((state) => state.generations);
  const { exportFile } = useGeneration();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const [generation, setGeneration] = useState(generations.find(g => g.id === id) || generations[0]);

  useEffect(() => {
    if (id) {
      const found = generations.find(g => g.id === id);
      if (found) setGeneration(found);
    }
  }, [id, generations]);

  if (!generation) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center flex-col">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Toolbar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/history" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">
              {generation.config?.headline || generation.config?.publicationName || "Untitled Generation"}
            </h1>
            <p className="text-xs text-gray-500">
              {generation.config?.language || "English"} · {generation.config?.templateId || "Classic"} · {generation.createdAt ? new Date(generation.createdAt).toLocaleDateString('en-CA') : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 disabled:opacity-30 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-300 font-medium px-2">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 disabled:opacity-30 text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {generation.config?.templateId === 'custom' && (
            <Link href={`/dashboard/editor?id=${generation.id}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm px-3 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <Edit className="h-4 w-4" />
              Customize Layout
            </Link>
          )}

          <button className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm px-3 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
            <Share2 className="h-4 w-4" />
            Share
          </button>

          <div className="relative group">
            <button className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
              <Download className="h-4 w-4" />
              Download
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 bg-neutral-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={() => exportFile(generation.id, "png")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-t-xl"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button 
                onClick={() => exportFile(generation.id, "pdf")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-b-xl border-t border-white/10"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Preview Canvas */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-auto bg-neutral-800/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[800px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative"
        >
          {generation.png_url ? (
             <img 
              src={generation.png_url} 
              alt="Newspaper Preview" 
              className="w-full h-auto bg-white"
            />
          ) : (
            <div className="w-full aspect-[1/1.4] bg-[#fdfbf7] flex items-center justify-center text-black p-8 text-center">
              <div>
                <h3 className="text-xl font-bold">Image Not Available</h3>
                <p className="text-gray-500 mt-2">The generated image could not be loaded.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center"><Loader2 className="h-8 w-8 text-primary-500 animate-spin" /></div>}>
      <PreviewContent />
    </Suspense>
  );
}
