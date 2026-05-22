"use client";

import { useState, useCallback } from "react";
import { generationService } from "@/services/generation.service";
import { useGenerationStore } from "@/store";
import type { GenerationConfig } from "@/types";

/**
 * Hook encapsulating the newspaper generation flow.
 * Returns trigger function, loading state, and error.
 */
export function useGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addGeneration } = useGenerationStore();

    const generate = useCallback(async (config: GenerationConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await generationService.generate(config);
      if (res.success && res.data?.id) {
        let generation = res.data;
        addGeneration(generation);
        
        // Poll for completion
        while (generation.status === "processing" || generation.status === "rendering" || generation.status === "pending") {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const pollRes = await generationService.getById(generation.id);
          if (pollRes.success && pollRes.data) {
            generation = pollRes.data;
            useGenerationStore.getState().updateGeneration(generation.id, generation);
          }
        }
        
        if (generation.status === "failed") {
          setError("Generation failed during background processing.");
        }
        
        return generation;
      }
    } catch (err: unknown) {
      const responseData = (err as any)?.response?.data;
      const message =
        responseData?.detail ?? responseData?.message ?? "Generation failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [addGeneration]);

  const exportFile = useCallback(async (id: string, format: "png" | "pdf") => {
    try {
      const generation = useGenerationStore.getState().generations.find(g => g.id === id);
      if (!generation) throw new Error("Generation not found");
      
      const url = format === "png" ? generation.png_url : generation.pdf_url;
      if (!url) throw new Error("URL not available");
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `newscraft-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      setError(`Failed to export ${format.toUpperCase()}`);
    }
  }, []);

  return { generate, exportFile, isLoading, error };
}
