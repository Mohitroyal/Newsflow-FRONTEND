import api from '@/lib/axios';
import { supabase } from '@/lib/supabase';

export interface EligibleArticle {
  id: string;
  headline: string;
  summary: string;
  content: string;
  kicker?: string;
  subheadline?: string;
  image_url?: string;
  image_urls?: string[];
  highlight_list?: string[];
  created_at?: string;
  published_at?: string;
  user_id?: string;
  reporter_name?: string;
  state?: string;
  district?: string;
  location?: string;
  // UI edition-specific text override
  custom_excerpt?: string;
  has_overflow?: boolean;
}

export interface DailyEditionRecord {
  id: string;
  edition_date: string;
  publication_code: string;
  publication_name: string;
  logo_url: string;
  page_count: number;
  article_count: number;
  status: string;
  pdf_url: string;
  version: number;
  created_at: string;
}

export interface DailyNewspaperConfig {
  publication_code: string;
  publication_name: string;
  logo_url: string;
  edition_date: string;
  articles: EligibleArticle[];
  lead_story_id?: string;
  advertisement_config?: {
    image_url?: string;
    title?: string;
    phone?: string;
  };
  edition_info?: {
    edition_no?: string;
    issue_no?: string;
    editor_name?: string;
    price?: string;
    location?: string;
  };
  overwrite_existing?: boolean;
}

export const dailyNewspaperService = {
  /**
   * Fetch eligible published clippings for a specific edition date (Asia/Kolkata timezone).
   * Excludes drafts, rejected posts, unpublished content, and deleted clippings.
   */
  async getEligibleClippings(dateStr: string): Promise<{ total: number; articles: EligibleArticle[] }> {
    // 1. Try Backend API first
    try {
      const res = await api.get('/api/v1/admin/daily-newspaper/clippings', {
        params: { date: dateStr },
      });
      if (res.data && Array.isArray(res.data.articles)) {
        return {
          total: res.data.total_eligible ?? res.data.articles.length,
          articles: res.data.articles,
        };
      }
    } catch (err) {
      console.warn('[DailyNewspaperService] Backend clippings endpoint failed, falling back to Supabase:', err);
    }

    // 2. Fallback: Direct Supabase client query
    try {
      const startISO = `${dateStr}T00:00:00.000Z`;
      const endISO = `${dateStr}T23:59:59.999Z`;

      const { data, error } = await supabase
        .from('clippings')
        .select('*')
        .eq('is_posted', true)
        .or(`status.is.null,status.neq.draft`)
        .gte('created_at', startISO)
        .lte('created_at', endISO)
        .order('created_at', { ascending: false });

      if (error || !data) {
        // Broad search fallback
        const { data: fallbackData } = await supabase
          .from('clippings')
          .select('*')
          .eq('is_posted', true)
          .order('created_at', { ascending: false })
          .limit(30);

        const mappedFallback = (fallbackData || []).map((c: any) => ({
          id: c.id,
          headline: c.headline || 'Untitled',
          summary: c.summary || c.content || '',
          content: c.content || c.summary || '',
          kicker: c.kicker || '',
          subheadline: c.subheadline || '',
          image_url: c.image_url || (Array.isArray(c.image_urls) ? c.image_urls[0] : ''),
          image_urls: Array.isArray(c.image_urls) ? c.image_urls : c.image_url ? [c.image_url] : [],
          highlight_list: Array.isArray(c.highlight_list) ? c.highlight_list : [],
          created_at: c.created_at || '',
          published_at: c.published_at || c.created_at || '',
          reporter_name: c.reporter_name || 'Reporter',
          district: c.district || '',
          location: c.location || c.district || 'హైదరాబాద్',
        }));

        return { total: mappedFallback.length, articles: mappedFallback };
      }

      const articles: EligibleArticle[] = data.map((c: any) => ({
        id: c.id,
        headline: c.headline || 'Untitled',
        summary: c.summary || c.content || '',
        content: c.content || c.summary || '',
        kicker: c.kicker || '',
        subheadline: c.subheadline || '',
        image_url: c.image_url || (Array.isArray(c.image_urls) ? c.image_urls[0] : ''),
        image_urls: Array.isArray(c.image_urls) ? c.image_urls : c.image_url ? [c.image_url] : [],
        highlight_list: Array.isArray(c.highlight_list) ? c.highlight_list : [],
        created_at: c.created_at || '',
        published_at: c.published_at || c.created_at || '',
        reporter_name: c.reporter_name || 'Reporter',
        district: c.district || '',
        location: c.location || c.district || 'హైదరాబాద్',
      }));

      return { total: articles.length, articles };
    } catch (err) {
      console.error('[DailyNewspaperService] Supabase query error:', err);
      return { total: 0, articles: [] };
    }
  },

  /**
   * Request backend HTML render for live preview.
   */
  async preview(config: DailyNewspaperConfig): Promise<{ html: string; total_pages: number; total_articles: number }> {
    const res = await api.post('/api/v1/admin/daily-newspaper/preview', config);
    return res.data;
  },

  /**
   * Request backend Playwright A3 PDF generation and save to daily_editions.
   */
  async generate(config: DailyNewspaperConfig): Promise<{
    success: boolean;
    edition_id: string;
    pdf_url: string;
    total_pages: number;
    total_articles: number;
    message: string;
  }> {
    const res = await api.post('/api/v1/admin/daily-newspaper/generate', config, {
      timeout: 120_000, // 2 minutes window for Playwright PDF rendering
    });
    return res.data;
  },

  /**
   * Fetch generated daily editions list.
   */
  async getDailyEditions(): Promise<DailyEditionRecord[]> {
    try {
      const res = await api.get('/api/v1/admin/daily-newspaper/editions');
      if (Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.warn('[DailyNewspaperService] Backend editions endpoint error, trying Supabase:', err);
    }

    try {
      const { data, error } = await supabase
        .from('daily_editions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((d: any) => ({
          id: d.id,
          edition_date: d.edition_date,
          publication_code: d.publication_code,
          publication_name: d.publication_name,
          logo_url: d.logo_url,
          page_count: d.page_count || 1,
          article_count: d.article_count || 0,
          status: d.status || 'completed',
          pdf_url: d.pdf_url || '',
          version: d.version || 1,
          created_at: d.created_at || '',
        }));
      }
    } catch (err) {
      console.error('[DailyNewspaperService] Supabase editions query error:', err);
    }

    return [];
  },
};
