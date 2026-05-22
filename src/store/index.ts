import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, GenerationConfig, Generation } from "@/types";

// ─── Auth Store ────────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: "newscraft-auth" }
  )
);

// ─── Generation Store ──────────────────────────────────────────────────────────
interface GenerationStore {
  currentConfig: Partial<GenerationConfig>;
  generations: Generation[];
  isGenerating: boolean;
  setConfig: (partial: Partial<GenerationConfig>) => void;
  resetConfig: () => void;
  addGeneration: (generation: Generation) => void;
  updateGeneration: (id: string, partial: Partial<Generation>) => void;
  setGenerating: (value: boolean) => void;
}

const defaultConfig: Partial<GenerationConfig> = {
  language: "en",
  tone: "formal",
  templateId: "bharath_reporter",
  publicationName: "Bharath Reporter",
  publicationDate: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  layoutColumns: 3,
  imageUrls: [],
  fontFamily: "playfair",
};

export const useGenerationStore = create<GenerationStore>()((set) => ({
  currentConfig: defaultConfig,
  generations: [
    {
      id: "gen_1",
      userId: "user_1",
      config: {
        language: "en",
        tone: "formal",
        templateId: "bharath_reporter",
        headline: "The Rise of Artificial Intelligence in Media",
        articleContent: "AI is reshaping how journalists write and publish stories across the globe.",
        publicationName: "Bharath Reporter",
        publicationDate: new Date().toLocaleDateString('en-CA'),
        layoutColumns: 3,
      },
      status: "completed",
      png_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop",
      pdf_url: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      id: "gen_2",
      userId: "user_1",
      config: {
        language: "te",
        tone: "formal",
        templateId: "rti_express",
        headline: "భారత ఆర్థిక వ్యవస్థ వృద్ధి",
        articleContent: "భారత ఆర్థిక వ్యవస్థ అద్భుతమైన వృద్ధి పథంలో సాగుతోంది.",
        publicationName: "RTI Express",
        publicationDate: new Date().toLocaleDateString('en-CA'),
        layoutColumns: 3,
      },
      status: "completed",
      png_url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop",
      pdf_url: undefined,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "gen_3",
      userId: "user_1",
      config: {
        language: "hi",
        tone: "sensational",
        templateId: "national_news",
        headline: "अंतरिक्ष में भारत की नई छलांग",
        articleContent: "भारत ने अंतरिक्ष विज्ञान में एक नया इतिहास रच दिया है।",
        publicationName: "National News Reporter",
        publicationDate: new Date().toLocaleDateString('en-CA'),
        layoutColumns: 3,
      },
      status: "completed",
      png_url: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=600&auto=format&fit=crop",
      pdf_url: undefined,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    }
  ],
  isGenerating: false,
  setConfig: (partial) =>
    set((state) => ({
      currentConfig: { ...state.currentConfig, ...partial },
    })),
  resetConfig: () => set({ currentConfig: defaultConfig }),
  addGeneration: (generation) =>
    set((state) => ({
      generations: [generation, ...state.generations],
    })),
  updateGeneration: (id, partial) =>
    set((state) => ({
      generations: state.generations.map((g) => (g.id === id ? { ...g, ...partial } : g)),
    })),
  setGenerating: (value) => set({ isGenerating: value }),
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIStore {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  language: string;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarOpen: true,
      language: "en",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: "newscraft-ui" }
  )
);
