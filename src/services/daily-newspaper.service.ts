import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';
import axios from 'axios';

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

/** Fetch a remote image and return it as a base64 data URI so it renders inside blob URLs (no CORS block). */
async function toBase64DataUri(url: string): Promise<string> {
  if (!url) return '';
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return url;
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // fallback to original URL
  }
}

export async function generateClientSidePreviewHtml(config: DailyNewspaperConfig): Promise<{ html: string; total_pages: number; total_articles: number }> {
  const articles = config.articles || [];
  const totalArticles = articles.length;
  const articlesPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(totalArticles / articlesPerPage));
  const pubName = config.publication_name || 'RTI Express';
  const logoUrl = config.logo_url || '';
  const dateStr = config.edition_date || new Date().toISOString().split('T')[0];

  // Convert logo to base64 so it renders inside blob URL (no CORS)
  const logoBase64 = logoUrl ? await toBase64DataUri(logoUrl) : '';

  // Pre-convert all article images to base64
  const imageBase64Map: Record<string, string> = {};
  await Promise.all(
    articles.map(async (art) => {
      const imgUrl = art.image_url || (Array.isArray(art.image_urls) && art.image_urls[0]) || '';
      if (imgUrl && !imageBase64Map[imgUrl]) {
        imageBase64Map[imgUrl] = await toBase64DataUri(imgUrl);
      }
    })
  );

  const headlineColors = ['#CC0000', '#003399', '#006600', '#8B0000', '#1a1a80', '#006633', '#770077'];

  let pagesHtml = '';

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const startIdx = (pageNum - 1) * articlesPerPage;
    const pageArticles = articles.slice(startIdx, startIdx + articlesPerPage);

    // Find lead article index for this page
    let leadIdx = 0;
    if (pageNum === 1 && config.lead_story_id) {
      const li = pageArticles.findIndex((a) => a.id === config.lead_story_id);
      if (li !== -1) leadIdx = li;
    }

    // Build article HTML per slot
    const buildCard = (art: EligibleArticle, isLead: boolean, isSide: boolean) => {
      const headline = art.headline || 'శీర్షిక';
      const subheadline = art.subheadline || '';
      const kicker = art.kicker || '';
      const content = art.custom_excerpt || art.content || art.summary || '';
      const reporter = art.reporter_name || 'రిపోర్టర్';
      const loc = art.location || art.district || 'హైదరాబాద్';
      const rawImgUrl = art.image_url || (Array.isArray(art.image_urls) && art.image_urls[0]) || '';
      const imgSrc = rawImgUrl ? (imageBase64Map[rawImgUrl] || rawImgUrl) : '';
      const colorIdx = pageArticles.indexOf(art) % headlineColors.length;
      const titleColor = isLead ? '#CC0000' : headlineColors[colorIdx];
      const imgHeight = isLead ? '220px' : isSide ? '130px' : '130px';
      const headingSize = isLead ? '24px' : isSide ? '14px' : '13px';
      const contentLimit = isLead ? 800 : isSide ? 300 : 250;
      const borderStyle = isLead ? 'border:2.5px solid #CC0000;background:#fffcf5;' : 'border:1px solid #bbb;background:#fff;';

      return `
        <div style="${borderStyle}padding:${isLead ? '10px 12px' : '7px 9px'};box-sizing:border-box;display:flex;flex-direction:column;height:100%;">
          ${kicker ? `<div style="font-size:8.5px;font-weight:800;color:#CC0000;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;font-family:sans-serif;">${kicker}</div>` : ''}
          <h${isLead ? '2' : '3'} style="font-size:${headingSize};font-weight:900;color:${titleColor};margin:0 0 4px 0;line-height:1.2;">${headline}</h${isLead ? '2' : '3'}>
          ${subheadline ? `<div style="font-size:11px;font-weight:700;color:#333;margin-bottom:4px;line-height:1.3;">${subheadline}</div>` : ''}
          ${imgSrc ? `<div style="margin:5px 0;"><img src="${imgSrc}" style="width:100%;height:${imgHeight};object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'" /></div>` : ''}
          <div style="font-size:9px;font-weight:bold;color:#555;border-bottom:1px solid #ddd;padding-bottom:3px;margin-bottom:4px;font-family:sans-serif;">${loc}&nbsp;|&nbsp;${reporter}</div>
          ${content ? `<div style="font-size:10.5px;line-height:1.55;color:#111;text-align:justify;flex:1;overflow:hidden;">${content.slice(0, contentLimit)}</div>` : ''}
        </div>`;
    };

    // Partition: lead, 2 side articles, rest in bottom grid
    const leadArt = pageArticles[leadIdx];
    const sideArts = pageArticles.filter((_, i) => i !== leadIdx).slice(0, 2);
    const gridArts = pageArticles.filter((_, i) => i !== leadIdx).slice(2);

    const leadHtml = leadArt ? buildCard(leadArt, true, false) : '';
    const sideHtml = sideArts.map((a) => buildCard(a, false, true)).join('');
    const gridHtml = gridArts.map((a) => buildCard(a, false, false)).join('');

    // Logo tag
    const logoTag = logoBase64
      ? `<img src="${logoBase64}" alt="${pubName}" style="max-height:70px;max-width:230px;object-fit:contain;" />`
      : `<span style="font-size:28px;font-weight:900;color:#003399;font-family:sans-serif;">${pubName}</span>`;

    const headerHtml = pageNum === 1 ? `
      <div style="background:#fff;border-top:5px solid #CC0000;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FFD700;">
        <div>${logoTag}</div>
        <div style="text-align:right;">
          <div style="background:#003399;color:#fff;padding:4px 14px;font-size:14px;font-weight:900;border-radius:3px;display:inline-block;font-family:sans-serif;">జనరల్ న్యూస్</div>
          <div style="font-size:11px;font-weight:bold;color:#333;margin-top:5px;font-family:sans-serif;">${dateStr}&nbsp;|&nbsp;Page ${pageNum} of ${totalPages}</div>
        </div>
      </div>
      <div style="background:#006633;color:#fff;font-size:10px;font-weight:bold;padding:4px 14px;display:flex;justify-content:space-between;font-family:sans-serif;">
        <span>సంపుటి : 01 &nbsp;|&nbsp; సంచిక : 266 &nbsp;|&nbsp; ఎడిటర్ : స్పాట్ న్యూస్</span>
        <span style="color:#FFD700;">పేజీలు : ${totalPages} &nbsp;|&nbsp; వెల : రూ. 1.50/-</span>
        <span>${dateStr}</span>
      </div>
    ` : `
      <div style="background:#fff;border-bottom:2px solid #006633;padding:5px 14px;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${logoTag}
          <span style="font-size:13px;font-weight:bold;color:#006633;font-family:sans-serif;">${pubName} — దినపత్రిక</span>
        </div>
        <span style="font-size:11px;font-weight:bold;color:#333;font-family:sans-serif;">${dateStr} | Page ${pageNum} of ${totalPages}</span>
      </div>
    `;

    pagesHtml += `
      <div style="width:100%;background:#f5f5f5;margin-bottom:28px;padding:10px;box-sizing:border-box;">
        <div style="background:#fff;border:1px solid #999;box-shadow:2px 2px 8px rgba(0,0,0,0.15);">
          ${headerHtml}
          <!-- Top section: lead (2/3 width) + side stack (1/3 width) -->
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;padding:8px 8px 0 8px;">
            ${leadHtml}
            <div style="display:flex;flex-direction:column;gap:6px;">${sideHtml}</div>
          </div>
          <!-- Bottom grid: remaining articles in 3 columns -->
          ${gridArts.length > 0 ? `
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 8px 8px 8px;">
            ${gridHtml}
          </div>` : '<div style="height:8px;"></div>'}
          <!-- Footer -->
          <div style="border-top:1.5px solid #000;padding:4px 8px;display:flex;justify-content:space-between;font-size:9px;font-weight:bold;color:#444;font-family:sans-serif;">
            <span>${pubName} — TELUGU DAILY</span>
            <div style="display:flex;gap:3px;align-items:center;">
              <span style="display:inline-block;width:10px;height:10px;background:#00ffff;"></span>
              <span style="display:inline-block;width:10px;height:10px;background:#ff00ff;"></span>
              <span style="display:inline-block;width:10px;height:10px;background:#ffff00;"></span>
              <span style="display:inline-block;width:10px;height:10px;background:#000;"></span>
            </div>
            <span>PAGE ${pageNum} OF ${totalPages}</span>
          </div>
        </div>
      </div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8">
  <title>${pubName} - ${dateStr}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #ddd; color: #000; font-family: 'Noto Serif Telugu', serif; padding: 16px; }
    @media print {
      html, body { background: #fff !important; padding: 0 !important; }
      @page { size: A3 landscape; margin: 8mm; }
    }
  </style>
</head>
<body>
  <div style="max-width:1100px;margin:0 auto;">
    ${pagesHtml}
  </div>
  <script>
    // Automatically open the browser print dialog so user can Save as PDF
    window.onload = function() {
      setTimeout(function() { window.print(); }, 1200);
    };
  </script>
</body>
</html>`;

  return { html, total_pages: totalPages, total_articles: totalArticles };
}

const getDjangoClient = () => {
  const djangoUrl = import.meta.env.VITE_DJANGO_API_URL || import.meta.env.VITE_API_URL || 'https://spotnewsv2.onrender.com';
  const instance = axios.create({
    baseURL: djangoUrl,
    headers: { "Content-Type": "application/json" }
  });

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("newscraft-auth");
    if (raw) {
      try {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          instance.defaults.headers.common.Authorization = `Bearer ${state.token}`;
        }
      } catch {}
    }
  }
  return instance;
};

export const dailyNewspaperService = {
  /**
   * Fetch all clippings generated on the given date from Supabase,
   * including headline, image_url, image_urls, content, reporter name.
   */
  async getEligibleClippings(dateStr: string): Promise<{ total: number; articles: EligibleArticle[] }> {
    // 1. Try Backend API
    try {
      const client = getDjangoClient();
      const res = await client.get('/api/v1/admin/daily-newspaper/clippings', { params: { date: dateStr } });
      if (res.data && Array.isArray(res.data.articles) && res.data.articles.length > 0) {
        return { total: res.data.total_eligible ?? res.data.articles.length, articles: res.data.articles };
      }
    } catch (err) {
      console.warn('[DailyNewspaper] Backend unavailable:', err);
    }

    // 2. Direct Supabase — all clippings created on this date (IST-aware)
    try {
      // Convert IST date to UTC — Supabase stores in UTC, must query in UTC
      // IST is UTC+5:30, so IST midnight = UTC 18:30 of previous day
      const startUTC = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
      const endUTC   = new Date(`${dateStr}T23:59:59+05:30`).toISOString();

      let { data: clippings } = await supabase
        .from('clippings')
        .select('id, user_id, headline, subheadline, kicker, content, summary, image_url, image_urls, highlight_list, created_at, reporter_name, district, location, state, status')
        .gte('created_at', startUTC)
        .lte('created_at', endUTC)
        .not('status', 'eq', 'draft')
        .not('status', 'eq', 'rejected')
        .order('created_at', { ascending: false })
        .limit(200);

      let clippingsList: any[] = clippings || [];

      // Fallback to recent if nothing found for that date
      if (clippingsList.length === 0) {
        const { data: recent } = await supabase
          .from('clippings')
          .select('id, user_id, headline, subheadline, kicker, content, summary, image_url, image_urls, highlight_list, created_at, reporter_name, district, location, state, status')
          .not('status', 'eq', 'draft')
          .not('status', 'eq', 'rejected')
          .order('created_at', { ascending: false })
          .limit(100);
        clippingsList = recent || [];
      }

      // Enrich with reporter full names from profiles
      const userIds = Array.from(new Set(clippingsList.map((c: any) => c.user_id).filter(Boolean)));
      const profileMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        (profiles ?? []).forEach((p: any) => { profileMap[p.id] = p; });
      }

      const articles: EligibleArticle[] = clippingsList.map((c: any) => {
        const prof = profileMap[c.user_id] || {};
        return {
          id: c.id,
          headline: c.headline || 'శీర్షిక లేదు',
          summary: c.summary || c.content || '',
          content: c.content || c.summary || '',
          kicker: c.kicker || '',
          subheadline: c.subheadline || '',
          image_url: c.image_url || (Array.isArray(c.image_urls) ? c.image_urls[0] : ''),
          image_urls: Array.isArray(c.image_urls) ? c.image_urls : (c.image_url ? [c.image_url] : []),
          highlight_list: Array.isArray(c.highlight_list) ? c.highlight_list : [],
          created_at: c.created_at || '',
          published_at: c.published_at || c.created_at || '',
          user_id: c.user_id || '',
          reporter_name: c.reporter_name || prof.full_name || prof.email?.split('@')[0] || 'రిపోర్టర్',
          district: c.district || '',
          location: c.location || c.district || 'హైదరాబాద్',
          state: c.state || '',
        };
      });

      return { total: articles.length, articles };
    } catch (err) {
      console.error('[DailyNewspaper] Supabase error:', err);
      return { total: 0, articles: [] };
    }
  },

  async preview(config: DailyNewspaperConfig): Promise<{ html: string; total_pages: number; total_articles: number }> {
    try {
      const client = getDjangoClient();
      const res = await client.post('/api/v1/admin/daily-newspaper/preview', config);
      return res.data;
    } catch {
      try {
        const res = await api.post('/api/v1/admin/daily-newspaper/preview', config);
        return res.data;
      } catch {
        return generateClientSidePreviewHtml(config);
      }
    }
  },

  async generate(config: DailyNewspaperConfig): Promise<{
    success: boolean;
    edition_id: string;
    pdf_url: string;
    total_pages: number;
    total_articles: number;
    message: string;
  }> {
    try {
      const client = getDjangoClient();
      const res = await client.post('/api/v1/admin/daily-newspaper/generate', config, { timeout: 120_000 });
      return res.data;
    } catch {
      try {
        const res = await api.post('/api/v1/admin/daily-newspaper/generate', config, { timeout: 120_000 });
        return res.data;
      } catch {
        // Generate locally, open in new tab — browser print dialog appears automatically (Save as PDF)
        const preview = await generateClientSidePreviewHtml(config);
        const blob = new Blob([preview.html], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return {
          success: true,
          edition_id: `edition-${Date.now()}`,
          pdf_url: blobUrl,
          total_pages: preview.total_pages,
          total_articles: preview.total_articles,
          message: `Newspaper opened in new tab. Use browser's "Save as PDF" to download.`,
        };
      }
    }
  },

  async getDailyEditions(): Promise<DailyEditionRecord[]> {
    try {
      const client = getDjangoClient();
      const res = await client.get('/api/v1/admin/daily-newspaper/editions');
      if (Array.isArray(res.data)) return res.data;
    } catch {
      console.warn('[DailyNewspaper] Backend editions unavailable.');
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
      console.error('[DailyNewspaper] Supabase editions error:', err);
    }

    return [];
  },
};
