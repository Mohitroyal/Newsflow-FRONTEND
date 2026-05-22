import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Generation, GenerationConfig } from "@/types";

export const generationService = {
  async generate(config: GenerationConfig): Promise<ApiResponse<Generation>> {
    const res = await api.post("/generate/", config);
    return res.data;
  },

  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Generation>> {
    const res = await api.get("/generate/", { params: { page, pageSize } });
    return res.data;
  },

  async getById(id: string): Promise<ApiResponse<Generation>> {
    const res = await api.get(`/generate/${id}`);
    return res.data;
  },

  async getByIdPublic(id: string): Promise<ApiResponse<Generation>> {
    const res = await api.get(`/generate/${id}/public`);
    return res.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete(`/generate/${id}`);
    return res.data;
  },

  async exportPng(id: string): Promise<Blob> {
    const res = await api.get(`/generations/${id}/export/png`, { responseType: "blob" });
    return res.data;
  },

  async exportPdf(id: string): Promise<Blob> {
    const res = await api.get(`/generations/${id}/export/pdf`, { responseType: "blob" });
    return res.data;
  },

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
