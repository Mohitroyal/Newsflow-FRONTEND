import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';
import { generationService } from '@/services/generation.service';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'reporter' | 'user';
  plan: string;
  created_at: string;
  last_sign_in_at?: string;
  total_generations: number;
  avatar_url?: string;
  preferred_language?: string;
  is_banned?: boolean;
  banned_until?: string | null;
}

export interface PublicationLogo {
  id: string;
  name: string;
  logo_url: string;
  publication_code: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalGenerationsToday: number;
  totalGenerationsAllTime: number;
  activeUsersToday: number;
  totalLogos: number;
  rangeGenerations?: number | null;
  rangeActiveUsers?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface AdminClippingLog {
  id: string;
  status: string;
  created_at: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_plan: string;
  headline: string;
  template_id: string;
  language: string;
  tone: string;
  publication_name: string;
  publication_date?: string;
  layout_columns?: number;
  font_family?: string;
  image_count?: number;
  png_url?: string;
  pdf_url?: string;
}

// ─── Role Check ───────────────────────────────────────────────────────────────
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    // Check profiles table first (has role column)
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (!error && data?.role) return data.role;

    // Fallback: check users table
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    return userData ? 'user' : null;
  } catch {
    return null;
  }
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getAdminStats = async (fromDate?: string, toDate?: string): Promise<AdminStats> => {
  const params: Record<string, string> = {};
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

  // 1. Try Backend API first for full database accurate stats
  try {
    const res = await api.get('/api/v1/admin/stats', { params });
    if (res.data && typeof res.data.totalUsers === 'number') {
      const logosRes = await supabase.from('publication_logos').select('id', { count: 'exact', head: true });
      return {
        totalUsers: res.data.totalUsers,
        totalGenerationsToday: res.data.totalGenerationsToday ?? 0,
        totalGenerationsAllTime: res.data.totalGenerationsAllTime ?? 0,
        activeUsersToday: res.data.activeUsersToday ?? 0,
        totalLogos: logosRes.count ?? res.data.totalLogos ?? 0,
        rangeGenerations: res.data.rangeGenerations ?? null,
        rangeActiveUsers: res.data.rangeActiveUsers ?? null,
        fromDate: res.data.fromDate ?? fromDate ?? null,
        toDate: res.data.toDate ?? toDate ?? null,
      };
    }
  } catch (err) {
    console.warn('[AdminService] Backend stats endpoint unavailable, falling back to Supabase client query:', err);
  }

  // 2. Fallback: Supabase Client Query
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const [
      usersRes,
      profilesRes,
      logosRes,
      genTodayRes,
      genAllRes,
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('publication_logos').select('id', { count: 'exact', head: true }),
      supabase
        .from('clippings')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      supabase
        .from('clippings')
        .select('id', { count: 'exact', head: true }),
    ]);

    const { data: activeTodayData } = await supabase
      .from('clippings')
      .select('user_id')
      .gte('created_at', todayISO);

    const uniqueActiveToday = new Set(
      (activeTodayData ?? []).map((r: any) => r.user_id).filter(Boolean)
    ).size;

    const totalUsersCount = Math.max(usersRes.count ?? 0, profilesRes.count ?? 0);

    // Range calculations in Supabase fallback if fromDate or toDate provided
    let rangeGenCount: number | null = null;
    let rangeActiveUsersCount: number | null = null;
    if (fromDate || toDate) {
      let rangeQuery = supabase.from('clippings').select('id, user_id', { count: 'exact' });
      if (fromDate) rangeQuery = rangeQuery.gte('created_at', `${fromDate}T00:00:00.000Z`);
      if (toDate) rangeQuery = rangeQuery.lte('created_at', `${toDate}T23:59:59.999Z`);
      const { data: rangeData, count: rangeCount } = await rangeQuery;
      rangeGenCount = rangeCount ?? (rangeData?.length ?? 0);
      rangeActiveUsersCount = new Set((rangeData ?? []).map((r: any) => r.user_id).filter(Boolean)).size;
    }

    return {
      totalUsers: totalUsersCount,
      totalGenerationsToday: genTodayRes.count ?? 0,
      totalGenerationsAllTime: genAllRes.count ?? 0,
      activeUsersToday: uniqueActiveToday,
      totalLogos: logosRes.count ?? 0,
      rangeGenerations: rangeGenCount,
      rangeActiveUsers: rangeActiveUsersCount,
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
    };
  } catch {
    return {
      totalUsers: 0,
      totalGenerationsToday: 0,
      totalGenerationsAllTime: 0,
      activeUsersToday: 0,
      totalLogos: 0,
      rangeGenerations: null,
      rangeActiveUsers: null,
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
    };
  }
};

// ─── Generations / Clippings by Date ──────────────────────────────────────────
export const getAdminClippings = async (options?: {
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  userId?: string;
}): Promise<{ total: number; results: AdminClippingLog[] }> => {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 50;
  const params: Record<string, any> = { page, page_size: pageSize };
  if (options?.fromDate) params.from_date = options.fromDate;
  if (options?.toDate) params.to_date = options.toDate;
  if (options?.userId) params.user_id = options.userId;

  // 1. Try Backend API first
  try {
    const res = await api.get('/api/v1/admin/generations', { params });
    if (res.data && Array.isArray(res.data.results)) {
      return {
        total: res.data.total ?? res.data.results.length,
        results: res.data.results,
      };
    }
  } catch (err) {
    console.warn('[AdminService] Backend generations endpoint unavailable, falling back to Supabase client query:', err);
  }

  // 2. Fallback: Supabase Client Query
  try {
    let query = supabase
      .from('clippings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.fromDate) {
      query = query.gte('created_at', `${options.fromDate}T00:00:00.000Z`);
    }
    if (options?.toDate) {
      query = query.lte('created_at', `${options.toDate}T23:59:59.999Z`);
    }
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: clippings, count, error } = await query;
    if (error || !clippings) {
      return { total: 0, results: [] };
    }

    // Fetch user profiles to enrich each clipping with name/email
    const userIds = Array.from(new Set(clippings.map((c: any) => c.user_id).filter(Boolean)));
    const profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name, plan')
        .in('id', userIds);
      (profiles ?? []).forEach((p: any) => { profileMap[p.id] = p; });
    }

    const results: AdminClippingLog[] = clippings.map((c: any) => {
      const prof = profileMap[c.user_id];
      return {
        id: c.id,
        status: c.status || 'completed',
        created_at: c.created_at || '',
        user_id: c.user_id || '',
        user_email: prof?.email || '',
        user_name: prof?.full_name || prof?.email?.split('@')[0] || 'User',
        user_plan: prof?.plan || 'free',
        headline: c.headline || 'Untitled Clipping',
        template_id: c.template_id || 'default',
        language: c.language || 'en',
        tone: c.tone || 'formal',
        publication_name: c.publication_name || '',
        publication_date: c.publication_date || '',
        layout_columns: c.layout_columns ?? 3,
        font_family: c.font_family || 'playfair',
        image_count: Array.isArray(c.image_urls) ? c.image_urls.length : c.image_url ? 1 : 0,
        png_url: c.png_url || '',
        pdf_url: c.pdf_url || '',
      };
    });

    return {
      total: count ?? results.length,
      results,
    };
  } catch (err) {
    console.error('[AdminService] Supabase fallback generations query error:', err);
    return { total: 0, results: [] };
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const getAdminUsers = async (): Promise<AdminUserProfile[]> => {
  // 1. Try Backend API first
  try {
    const res = await api.get('/api/v1/admin/users');
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('[AdminService] Backend users endpoint unavailable, falling back to Supabase client query:', err);
  }

  // 2. Fallback: Supabase Client Query
  try {
    const [{ data: users }, { data: profiles }, { data: genData }] = await Promise.all([
      supabase.from('users').select('id, email, full_name, avatar_url, created_at, preferred_language').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, role, plan, last_sign_in_at, is_banned'),
      supabase.from('clippings').select('user_id'),
    ]);

    const profileMap: Record<string, any> = {};
    (profiles ?? []).forEach((p: any) => { profileMap[p.id] = p; });

    const genCountMap: Record<string, number> = {};
    (genData ?? []).forEach((row: any) => {
      if (row.user_id) genCountMap[row.user_id] = (genCountMap[row.user_id] ?? 0) + 1;
    });

    const userMap = new Map<string, AdminUserProfile>();

    (users ?? []).forEach((u: any) => {
      userMap.set(u.id, {
        id: u.id,
        email: u.email ?? '',
        full_name: u.full_name ?? '',
        avatar_url: u.avatar_url ?? '',
        created_at: u.created_at ?? '',
        preferred_language: u.preferred_language ?? 'English',
        role: profileMap[u.id]?.role ?? 'user',
        plan: profileMap[u.id]?.plan ?? 'free',
        last_sign_in_at: profileMap[u.id]?.last_sign_in_at,
        total_generations: genCountMap[u.id] ?? 0,
        is_banned: Boolean(profileMap[u.id]?.is_banned),
      });
    });

    // Also include any profiles not in users table
    (profiles ?? []).forEach((p: any) => {
      if (!userMap.has(p.id)) {
        userMap.set(p.id, {
          id: p.id,
          email: p.email ?? '',
          full_name: p.full_name ?? 'User',
          avatar_url: '',
          created_at: p.created_at ?? '',
          preferred_language: 'English',
          role: p.role ?? 'user',
          plan: p.plan ?? 'free',
          last_sign_in_at: p.last_sign_in_at,
          total_generations: genCountMap[p.id] ?? 0,
          is_banned: Boolean(p.is_banned),
        });
      }
    });

    return Array.from(userMap.values());
  } catch {
    return [];
  }
};

// ─── Edit User Role / Plan ────────────────────────────────────────────────────
export const updateUserRole = async (
  userId: string,
  role: 'admin' | 'reporter' | 'user'
): Promise<{ success: boolean; error?: string }> => {
  // 1. Primary: Use Backend API (runs with service_role key, safely bypassing RLS)
  try {
    const res = await api.put(`/api/v1/admin/users/${userId}/role`, { role });
    if (res.status >= 200 && res.status < 300) {
      // Force-refresh the Supabase session so the promoted user's JWT picks
      // up the new app_metadata.role immediately — no sign-out/in needed.
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.id === userId) {
          await supabase.auth.refreshSession();
        }
      } catch {
        /* non-critical — session refresh failure doesn't block the update */
      }
      return { success: true };
    }
  } catch (backendErr: any) {
    console.warn('[AdminService] Backend role update error:', backendErr?.response?.data || backendErr?.message);
    const detail = backendErr?.response?.data?.detail;
    if (detail) {
      return { success: false, error: detail };
    }
  }

  // 2. Fallback: direct Supabase upsert (may fail if RLS does not allow public update)
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, role }, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    // Force-refresh the Supabase session for the promoted user
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id === userId) {
        await supabase.auth.refreshSession();
      }
    } catch { /* non-critical */ }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to update role' };
  }
};

export const updateUserPlan = async (
  userId: string,
  plan: string
): Promise<{ success: boolean; error?: string }> => {
  // 1. Primary: Use Backend API (runs with service_role key, safely bypassing RLS)
  try {
    const res = await api.put(`/api/v1/admin/users/${userId}/plan`, { plan });
    if (res.status >= 200 && res.status < 300) {
      return { success: true };
    }
  } catch (backendErr: any) {
    console.warn('[AdminService] Backend plan update error:', backendErr?.response?.data || backendErr?.message);
    const detail = backendErr?.response?.data?.detail;
    if (detail) {
      return { success: false, error: detail };
    }
  }

  // 2. Fallback: direct Supabase upsert
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, plan }, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to update plan' };
  }
};


// ─── Ban / Block User ─────────────────────────────────────────────────────────
export const banUser = async (
  userId: string,
  duration: string = '876600h'
): Promise<{ success: boolean; error?: string }> => {
  // 1. Primary: Use Backend API
  try {
    const res = await api.post(`/api/v1/admin/users/${userId}/ban`, { duration });
    if (res.status >= 200 && res.status < 300) {
      return { success: true };
    }
  } catch (backendErr: any) {
    console.warn('[AdminService] Backend ban error:', backendErr?.response?.data || backendErr?.message);
    const detail = backendErr?.response?.data?.detail;
    if (detail) return { success: false, error: detail };
  }

  // 2. Fallback: Supabase direct profile update
  try {
    const isUnban = duration.toLowerCase() === 'none';
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, is_banned: !isUnban }, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to update user block status' };
  }
};

// ─── Delete / Remove User ──────────────────────────────────────────────────────
export const deleteUser = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  // 1. Primary: Use Backend API (removes from auth + local DB safely)
  try {
    const res = await api.delete(`/api/v1/admin/users/${userId}`);
    if (res.status >= 200 && res.status < 300) {
      return { success: true };
    }
  } catch (backendErr: any) {
    console.warn('[AdminService] Backend delete user error:', backendErr?.response?.data || backendErr?.message);
    const detail = backendErr?.response?.data?.detail;
    if (detail) return { success: false, error: detail };
  }

  // 2. Fallback: Supabase direct profiles deletion
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to delete user' };
  }
};


// ─── Publication Logos ────────────────────────────────────────────────────────
export const getPublicationLogos = async (): Promise<PublicationLogo[]> => {
  try {
    const { data, error } = await supabase
      .from('publication_logos')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
};

export const addPublicationLogo = async (
  name: string,
  logo_url: string,
  publication_code: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('publication_logos').insert([
      {
        name: name.trim(),
        logo_url: logo_url.trim(),
        publication_code: publication_code.trim().toLowerCase().replace(/\s+/g, '_'),
      },
    ]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
};

export const updatePublicationLogo = async (
  id: string,
  updates: {
    name?: string;
    logo_url?: string;
    publication_code?: string;
    is_active?: boolean;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.logo_url !== undefined) payload.logo_url = updates.logo_url.trim();
    if (updates.publication_code !== undefined) {
      payload.publication_code = updates.publication_code.trim().toLowerCase().replace(/\s+/g, '_');
    }
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;

    const { error } = await supabase
      .from('publication_logos')
      .update(payload)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
};

export const uploadLogoImage = async (file: File): Promise<{ url?: string; error?: string }> => {
  try {
    const res = await generationService.uploadImage(file);
    if (res.success && res.data?.url) {
      return { url: res.data.url };
    }
    if (!res.success && res.message) {
      return { error: res.message };
    }
  } catch (err: any) {
    console.warn('[uploadLogoImage] generationService upload failed, trying Supabase fallback:', err);
  }

  // Fallback to direct Supabase storage upload if backend endpoint fails
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `publication_logos/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('newscraft-clippings')
      .upload(fileName, file, { upsert: true });

    if (!uploadError) {
      const { data: pubData } = supabase.storage
        .from('newscraft-clippings')
        .getPublicUrl(fileName);
      if (pubData?.publicUrl) {
        return { url: pubData.publicUrl };
      }
    } else {
      console.warn('[uploadLogoImage] Supabase upload error:', uploadError.message);
    }
  } catch (err: any) {
    console.warn('[uploadLogoImage] Supabase fallback error:', err);
  }

  return { error: 'Failed to upload logo image. Please try again.' };
};


export const toggleLogoActive = async (
  id: string,
  is_active: boolean
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('publication_logos')
      .update({ is_active })
      .eq('id', id);
    return { success: !error };
  } catch {
    return { success: false };
  }
};

export const removePublicationLogo = async (id: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase.from('publication_logos').delete().eq('id', id);
    return { success: !error };
  } catch {
    return { success: false };
  }
};

// ─── Activity Logger ──────────────────────────────────────────────────────────
export const logUserActivity = async (
  userId: string,
  email: string,
  name: string,
  action: 'login' | 'generate' | 'export'
): Promise<void> => {
  try {
    await supabase.from('user_activity').insert([
      { user_id: userId, user_email: email, user_name: name, action },
    ]);
  } catch {
    /* silent */
  }
};
