import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BarChart3, Image as ImageIcon, Shield, LogOut,
  Plus, Trash2, Eye, EyeOff, RefreshCw, X, Check,
  AlertTriangle, TrendingUp, Newspaper, Activity, Crown,
  ChevronDown, ChevronUp, Search, ArrowLeft, Ban,
  Calendar, FileText, ExternalLink, Filter, Clock,
  UploadCloud, Edit2, Link as LinkIcon
} from 'lucide-react';
import { useAuthStore, isAdminUser, isSuperAdminUser } from '@/store';
import { supabase } from '@/lib/supabase';
import {
  getAdminStats, getAdminUsers, getPublicationLogos,
  addPublicationLogo, updatePublicationLogo, uploadLogoImage,
  removePublicationLogo, toggleLogoActive,
  updateUserRole, updateUserPlan, banUser, deleteUser,
  getAdminClippings,
  type AdminStats, type AdminUserProfile, type PublicationLogo, type AdminClippingLog
} from '@/services/admin.service';


function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getTodayStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysAgoStr(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <TrendingUp className="w-3.5 h-3.5 text-green-400 opacity-60" />
        </div>
        <p className="text-white text-2xl font-black tracking-tight">{fmt(Number(value))}</p>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-1">{label}</p>
        {sub && <p className="text-white/30 text-[10px] mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    admin:      { label: 'ADMIN',      color: '#f59e0b', bg: '#f59e0b22' },
    pro:        { label: 'PRO',        color: '#6366f1', bg: '#6366f122' },
    enterprise: { label: 'ENTERPRISE', color: '#10b981', bg: '#10b98122' },
    free:       { label: 'FREE',       color: '#94a3b8', bg: '#94a3b822' },
    reporter:   { label: 'REPORTER',   color: '#38bdf8', bg: '#38bdf822' },
  };
  const s = map[plan?.toLowerCase()] ?? map.free;
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isSuper = role === 'superadmin';
  const isAdmin = role === 'admin' || isSuper;
  return (
    <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{
        color: isSuper ? '#f59e0b' : isAdmin ? '#38bdf8' : '#94a3b8',
        background: isSuper ? '#f59e0b22' : isAdmin ? '#38bdf822' : '#94a3b822',
        border: isSuper ? '1px solid rgba(245, 158, 11, 0.4)' : undefined,
      }}>
      {isSuper ? <Crown className="w-2.5 h-2.5" /> : isAdmin ? <Shield className="w-2.5 h-2.5" /> : null}
      {role || 'user'}
    </span>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
      style={{ background: type === 'success' ? '#10b981' : '#ef4444', color: '#fff', whiteSpace: 'nowrap' }}
    >
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const AdminScreen = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // ── Access guard ──────────────────────────────────────────────────────────
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return false;

      // 1. Fast check: super admin email or metadata/store role
      if (
        isAdminUser(user) ||
        (user as any)?.role === 'admin' ||
        (user as any)?.app_metadata?.role === 'admin' ||
        (user as any)?.user_metadata?.role === 'admin'
      ) {
        setHasAccess(true);
        setAccessChecked(true);
        return true;
      }

      // 2. Supabase profiles check
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (data?.role === 'admin') {
          setHasAccess(true);
          setAccessChecked(true);
          return true;
        }
      } catch {
        /* silent */
      }

      // 3. Backend API check (real ground truth in case Supabase profiles row is missing)
      try {
        const raw = localStorage.getItem('newscraft-auth');
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        if (token) {
          const res = await fetch(
            'https://news-backend-sjw6.onrender.com/api/v1/admin/stats',
            { headers: { Authorization: 'Bearer ' + token } }
          );
          if (res.status === 200) {
            setHasAccess(true);
            setAccessChecked(true);
            return true;
          }
        }
      } catch {
        /* silent */
      }

      setHasAccess(false);
      setAccessChecked(true);
      return false;
    };

    if (user) {
      checkAccess();
      return;
    }

    // user was null — wait one tick for store hydration then try again
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }
      checkAccess();
    }, 300);

    return () => clearTimeout(timer);
  }, [user, navigate]);



  // ── State ─────────────────────────────────────────────────────────────────
  const isSuperAdmin = isSuperAdminUser(user);
  const [activeTab, setActiveTab] = useState<'overview' | 'clippings' | 'users' | 'logos'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [logos, setLogos] = useState<PublicationLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof AdminUserProfile>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Date filtering state
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [activeDatePreset, setActiveDatePreset] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'>('all');

  // Clippings state
  const [clippings, setClippings] = useState<AdminClippingLog[]>([]);
  const [clippingsLoading, setClippingsLoading] = useState(false);
  const [clippingsTotal, setClippingsTotal] = useState(0);
  const [clippingsSearch, setClippingsSearch] = useState('');
  const [selectedClippingModal, setSelectedClippingModal] = useState<AdminClippingLog | null>(null);

  // Guard tab for non-superadmin
  useEffect(() => {
    if (!isSuperAdmin && activeTab === 'logos') {
      setActiveTab('overview');
    }
  }, [isSuperAdmin, activeTab]);

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [editPlan, setEditPlan] = useState<string>('');
  const [editSaving, setEditSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Logo form and editing state
  const [showLogoForm, setShowLogoForm] = useState(false);
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoCode, setLogoCode] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoFormLoading, setLogoFormLoading] = useState(false);
  const [logoFormError, setLogoFormError] = useState('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);


  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (fDate?: string, tDate?: string) => {
    setLoading(true);
    setClippingsLoading(true);
    try {
      const activeF = fDate !== undefined ? fDate : fromDate;
      const activeT = tDate !== undefined ? tDate : toDate;
      const [s, u, l, c] = await Promise.all([
        getAdminStats(activeF || undefined, activeT || undefined),
        getAdminUsers(),
        isSuperAdmin ? getPublicationLogos() : Promise.resolve([]),
        getAdminClippings({
          fromDate: activeF || undefined,
          toDate: activeT || undefined,
          pageSize: 100,
        }),
      ]);
      setStats(s);
      setUsers(u);
      setLogos(l);
      setClippings(c.results);
      setClippingsTotal(c.total);
    } finally {
      setLoading(false);
      setClippingsLoading(false);
    }
  }, [isSuperAdmin, fromDate, toDate]);

  useEffect(() => {
    if (hasAccess) fetchAll();
  }, [hasAccess, fetchAll]);

  // Date Filter Handlers
  const handleApplyPreset = (preset: 'all' | 'today' | 'yesterday' | 'week' | 'month') => {
    setActiveDatePreset(preset);
    let f = '';
    let t = '';
    const today = getTodayStr();

    if (preset === 'today') {
      f = today;
      t = today;
    } else if (preset === 'yesterday') {
      f = getYesterdayStr();
      t = getYesterdayStr();
    } else if (preset === 'week') {
      f = getDaysAgoStr(7);
      t = today;
    } else if (preset === 'month') {
      const now = new Date();
      f = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      t = today;
    } else if (preset === 'all') {
      f = '';
      t = '';
    }

    setFromDate(f);
    setToDate(t);
    fetchAll(f, t);
  };

  const handleCustomDateApply = () => {
    setActiveDatePreset('custom');
    fetchAll(fromDate, toDate);
  };

  const handleResetDates = () => {
    handleApplyPreset('all');
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSort = (field: keyof AdminUserProfile) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const filteredUsers = users
    .filter(u =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortField] as any;
      const bv = b[sortField] as any;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });

  const resetLogoForm = () => {
    setShowLogoForm(false);
    setEditingLogoId(null);
    setLogoName('');
    setLogoCode('');
    setLogoUrl('');
    setLogoFile(null);
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview('');
    setLogoFormError('');
    setShowManualUrl(false);
    setIsDraggingLogo(false);
  };

  const handleProcessLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLogoFormError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLogoFormError('Image size exceeds 10MB limit.');
      return;
    }
    setLogoFormError('');
    setLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    // Auto-generate slug and publication name if empty
    const dotIdx = file.name.lastIndexOf('.');
    const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
    if (!logoCode.trim()) {
      const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      setLogoCode(slug);
    }
    if (!logoName.trim()) {
      const clean = baseName.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      setLogoName(clean);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessLogoFile(file);
    }
    e.target.value = '';
  };

  const handleStartEditLogo = (logo: PublicationLogo) => {
    setEditingLogoId(logo.id);
    setLogoName(logo.name);
    setLogoCode(logo.publication_code);
    setLogoUrl(logo.logo_url);
    setLogoPreview(logo.logo_url);
    setLogoFile(null);
    setLogoFormError('');
    setShowManualUrl(false);
    setShowLogoForm(true);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Only superadmin can manage logos.', 'error');
      return;
    }
    setLogoFormError('');
    if (!logoName.trim()) {
      setLogoFormError('Publication name is required.');
      return;
    }
    if (!logoCode.trim()) {
      setLogoFormError('Publication code (slug) is required.');
      return;
    }
    if (!logoFile && !logoUrl.trim()) {
      setLogoFormError('Please select or upload a logo image.');
      return;
    }

    setLogoFormLoading(true);
    let finalLogoUrl = logoUrl.trim();

    // If a new image file was selected, upload it
    if (logoFile) {
      const uploadRes = await uploadLogoImage(logoFile);
      if (uploadRes.error || !uploadRes.url) {
        setLogoFormLoading(false);
        setLogoFormError(uploadRes.error || 'Failed to upload logo image.');
        return;
      }
      finalLogoUrl = uploadRes.url;
    }

    if (editingLogoId) {
      const result = await updatePublicationLogo(editingLogoId, {
        name: logoName,
        logo_url: finalLogoUrl,
        publication_code: logoCode,
      });
      setLogoFormLoading(false);
      if (result.success) {
        showToast('Publication logo updated successfully!', 'success');
        resetLogoForm();
        fetchAll();
      } else {
        setLogoFormError(result.error ?? 'Failed to update logo.');
      }
    } else {
      const result = await addPublicationLogo(logoName, finalLogoUrl, logoCode);
      setLogoFormLoading(false);
      if (result.success) {
        showToast('Publication logo added successfully!', 'success');
        resetLogoForm();
        fetchAll();
      } else {
        setLogoFormError(result.error ?? 'Failed to add logo.');
      }
    }
  };


  const handleToggleLogo = async (id: string, current: boolean) => {
    if (!isSuperAdmin) {
      showToast('Only superadmin can manage logos.', 'error');
      return;
    }
    await toggleLogoActive(id, !current);
    showToast(`Logo ${!current ? 'enabled' : 'disabled'}`, 'success');
    fetchAll();
  };

  const handleDeleteLogo = async (id: string, name: string) => {
    if (!isSuperAdmin) {
      showToast('Only superadmin can manage logos.', 'error');
      return;
    }
    if (!window.confirm(`Delete logo "${name}"? This cannot be undone.`)) return;
    const result = await removePublicationLogo(id);
    if (result.success) {
      showToast('Logo removed.', 'success');
      fetchAll();
    } else {
      showToast('Failed to remove logo.', 'error');
    }
  };

  const handleLogout = async () => {
    // Full logout — identical to SettingsScreen performLogout:
    // 1. Supabase session invalidation
    try { await supabase.auth.signOut(); } catch { /* continue */ }
    // 2. Clear Zustand auth store
    logout();
    // 3. Wipe all newscraft-* localStorage keys (clears cached admin state too)
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('newscraft')) keysToRemove.push(key);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch { /* continue */ }
    // 4. Navigate to login
    navigate('/login', { replace: true });
  };

  // ── Edit User ─────────────────────────────────────────────────────────────
  const startEdit = (u: AdminUserProfile) => {
    if (isSuperAdminUser(u.email)) {
      showToast('Superadmin account is protected.', 'error');
      return;
    }
    setEditingUserId(u.id);
    setEditRole(u.role ?? 'user');
    setEditPlan(u.plan ?? 'free');
  };

  const cancelEdit = () => { setEditingUserId(null); };

  const saveEdit = async (u: AdminUserProfile) => {
    if (isSuperAdminUser(u.email)) {
      showToast('Superadmin account cannot be modified.', 'error');
      setEditingUserId(null);
      return;
    }
    if (editRole === 'admin' && !isSuperAdmin) {
      showToast('Only superadmin can grant admin role.', 'error');
      return;
    }
    setEditSaving(true);
    let roleSuccess = true;
    let planSuccess = true;
    let errorMsg: string | undefined;

    // 1. Update role if changed
    if (editRole !== u.role) {
      const r1 = await updateUserRole(u.id, editRole as any);
      if (!r1.success) {
        roleSuccess = false;
        errorMsg = r1.error;
      }
    }
    // 2. Only update plan if plan actually changed AND user wasn't just set to admin
    if (editPlan !== u.plan && editRole !== 'admin') {
      const r2 = await updateUserPlan(u.id, editPlan);
      if (!r2.success) {
        planSuccess = false;
        errorMsg = errorMsg ?? r2.error;
      }
    }

    setEditSaving(false);
    if (roleSuccess && planSuccess) {
      showToast('User updated!', 'success');
      setEditingUserId(null);
      fetchAll();
    } else {
      showToast(errorMsg ?? 'Failed to update user.', 'error');
    }
  };

  const handleToggleBlockUser = async (u: AdminUserProfile) => {
    if (!isSuperAdmin) {
      showToast('Only superadmin can block or unblock users.', 'error');
      return;
    }
    if (isSuperAdminUser(u.email)) {
      showToast('Cannot block the superadmin account.', 'error');
      return;
    }
    const isCurrentlyBanned = Boolean(u.is_banned);
    const confirmMsg = isCurrentlyBanned
      ? `Unblock user "${u.full_name || u.email}"? They will regain access to log in.`
      : `Block user "${u.full_name || u.email}"? They will not be able to log in or generate content.`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(u.id);
    const duration = isCurrentlyBanned ? 'none' : '876600h';
    const res = await banUser(u.id, duration);
    setActionLoadingId(null);
    if (res.success) {
      showToast(isCurrentlyBanned ? 'User unblocked.' : 'User blocked successfully.', 'success');
      fetchAll();
    } else {
      showToast(res.error ?? 'Failed to update block status.', 'error');
    }
  };

  const handleDeleteUser = async (u: AdminUserProfile) => {
    if (!isSuperAdmin) {
      showToast('Only superadmin can delete users.', 'error');
      return;
    }
    if (isSuperAdminUser(u.email)) {
      showToast('Cannot delete the superadmin account.', 'error');
      return;
    }
    const confirmMsg = `Permanently delete user "${u.full_name || u.email}"?\n\nThis action cannot be undone and will delete all user data.`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(u.id);
    const res = await deleteUser(u.id);
    setActionLoadingId(null);
    if (res.success) {
      showToast('User deleted permanently.', 'success');
      fetchAll();
    } else {
      showToast(res.error ?? 'Failed to delete user.', 'error');
    }
  };

  // ── Access Denied ─────────────────────────────────────────────────────────
  if (!accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2A' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-white/50 text-sm font-semibold">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D1B2A' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-xs"
        >
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-white text-2xl font-black mb-2">Access Denied</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            You do not have administrator privileges to access this panel.
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white"
            style={{ background: '#CC1E1E' }}
          >
            Go Back to App
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f59e0b22' }}>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Admin Panel</h1>
              <p className="text-white/40 text-[11px] mt-0.5 font-semibold uppercase tracking-widest">NewsCraft Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
              title="Return to App"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>App</span>
            </button>
            <button
              onClick={() => fetchAll()}
              disabled={loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.07)' }}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(204,30,30,0.15)' }}
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Admin badge */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Logged in as <span className="text-amber-400 font-bold">{user?.email}</span> {isSuperAdmin ? '(Superadmin)' : '(Admin)'}</span>
            <RoleBadge role={isSuperAdmin ? 'superadmin' : 'admin'} />
          </div>
        </div>
      </header>

      {/* ── Tab Bar ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-2 rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {([
            { id: 'overview',  label: 'Overview',  icon: BarChart3 },
            { id: 'clippings', label: 'Clippings', icon: Newspaper },
            { id: 'users',     label: 'Users',     icon: Users },
            ...(isSuperAdmin ? [{ id: 'logos', label: 'Logos', icon: ImageIcon }] : []),
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all`}
              style={activeTab === tab.id
                ? { background: '#CC1E1E', color: '#fff' }
                : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Date Filter Bar (Shown for Overview & Clippings tabs) ────── */}
      {(activeTab === 'overview' || activeTab === 'clippings') && (
        <div className="max-w-5xl mx-auto px-4 mb-4">
          <div
            className="rounded-2xl p-3.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 mr-1">
                  <Calendar className="w-3 h-3 text-amber-400" /> Date:
                </span>
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'week', label: 'Last 7 Days' },
                  { id: 'month', label: 'This Month' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p.id as any)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
                    style={activeDatePreset === p.id
                      ? { background: '#CC1E1E', color: '#fff', boxShadow: '0 2px 8px rgba(204,30,30,0.3)' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Pickers (From Date & To Date) */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase">From</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => { setFromDate(e.target.value); setActiveDatePreset('custom'); }}
                    className="px-2.5 py-1 rounded-xl text-xs text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', colorScheme: 'dark' }}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase">To</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => { setToDate(e.target.value); setActiveDatePreset('custom'); }}
                    className="px-2.5 py-1 rounded-xl text-xs text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', colorScheme: 'dark' }}
                  />
                </div>

                <button
                  onClick={handleCustomDateApply}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-white active:scale-95 transition-transform"
                  style={{ background: '#38bdf8' }}
                >
                  Filter
                </button>

                {(fromDate || toDate) && (
                  <button
                    onClick={handleResetDates}
                    className="px-2 py-1 rounded-xl text-xs text-white/50 hover:text-white active:scale-95 transition-colors"
                    title="Clear date filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Status Badge */}
            {(fromDate || toDate) && (
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] flex-wrap gap-2">
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <Filter className="w-3 h-3" />
                  Filtered Range: <strong className="text-white">{fromDate || 'Start'}</strong> to <strong className="text-white">{toDate || 'Present'}</strong>
                </span>
                <span className="text-white/50">
                  {clippingsLoading ? 'Loading clippings…' : `${clippings.length} clipping${clippings.length === 1 ? '' : 's'} found`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">

          {/* ══ Overview Tab ══════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))}
                </div>
              ) : stats ? (
                <>
                  {/* Selected Range Stats Banner (if date filter applied) */}
                  {(fromDate || toDate || stats.rangeGenerations != null) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-2xl p-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(204,30,30,0.12) 0%, rgba(56,189,248,0.08) 100%)',
                        border: '1px solid rgba(204,30,30,0.25)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span className="text-white font-bold text-sm">Selected Date Period</span>
                          <span className="text-[10px] text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            {fromDate || 'Start'} → {toDate || 'Today'}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('clippings')}
                          className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 active:scale-95 transition-transform"
                        >
                          View {clippings.length} Clippings <ArrowLeft className="w-3 h-3 rotate-180" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <p className="text-white text-xl font-black">{stats.rangeGenerations ?? clippings.length}</p>
                          <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-0.5">Generations in Range</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <p className="text-white text-xl font-black">{stats.rangeActiveUsers ?? new Set(clippings.map(c => c.user_id).filter(Boolean)).size}</p>
                          <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-0.5">Active Users in Range</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <StatCard icon={Users}     label="Total Users"       value={stats.totalUsers}              color="#38bdf8" />
                    <StatCard icon={Activity}  label="Active Today"      value={stats.activeUsersToday}        color="#10b981" />
                    <StatCard icon={Newspaper} label="Generated Today"   value={stats.totalGenerationsToday}   color="#f59e0b" />
                    <StatCard icon={BarChart3} label="All-time Gens"     value={stats.totalGenerationsAllTime} color="#a78bfa" />
                  </div>
                  {isSuperAdmin && (
                    <StatCard icon={ImageIcon}   label="Publication Logos" value={stats.totalLogos}              color="#fb7185" sub="Available in app logo picker" />
                  )}

                  {/* Quick actions */}
                  <div className={`mt-5 grid ${isSuperAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                    <button
                      onClick={() => setActiveTab('clippings')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      <Newspaper className="w-4 h-4 text-amber-400" />
                      View Clippings
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                      style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}
                    >
                      <Users className="w-4 h-4 text-sky-400" />
                      Manage Users
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => setActiveTab('logos')}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                        style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)' }}
                      >
                        <ImageIcon className="w-4 h-4 text-rose-400" />
                        Manage Logos
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-white/40 text-sm">Failed to load stats.</div>
              )}
            </motion.div>
          )}

          {/* ══ Clippings / Generations Tab ═══════════════════════════ */}
          {activeTab === 'clippings' && (
            <motion.div key="clippings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by headline, user name, email, or publication…"
                  value={clippingsSearch}
                  onChange={e => setClippingsSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                {clippingsSearch && (
                  <button onClick={() => setClippingsSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                )}
              </div>

              {clippingsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))}
                </div>
              ) : (() => {
                const filtered = clippings.filter(c => {
                  if (!clippingsSearch.trim()) return true;
                  const q = clippingsSearch.toLowerCase();
                  return (
                    c.headline?.toLowerCase().includes(q) ||
                    c.user_name?.toLowerCase().includes(q) ||
                    c.user_email?.toLowerCase().includes(q) ||
                    c.publication_name?.toLowerCase().includes(q) ||
                    c.template_id?.toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-16 px-4">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Newspaper className="w-8 h-8 text-white/30" />
                      </div>
                      <p className="text-white font-bold text-base mb-1">No Clippings Found</p>
                      <p className="text-white/40 text-xs max-w-sm mx-auto mb-4">
                        {fromDate || toDate
                          ? `No clippings were generated between ${fromDate || 'Start'} and ${toDate || 'Present'}. Try changing the date filter.`
                          : 'No clippings have been generated yet.'}
                      </p>
                      {(fromDate || toDate) && (
                        <button
                          onClick={handleResetDates}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white active:scale-95 transition-transform"
                          style={{ background: '#CC1E1E' }}
                        >
                          View All Time Clippings
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider">
                        {filtered.length} of {clippingsTotal || filtered.length} Clipping{clippingsTotal === 1 ? '' : 's'}
                        {fromDate || toDate ? ` (${fromDate || 'Start'} to ${toDate || 'Present'})` : ' (All time)'}
                      </span>
                      <span className="text-white/30 text-[10px]">
                        Generated by {new Set(filtered.map(c => c.user_email || c.user_id).filter(Boolean)).size} user{new Set(filtered.map(c => c.user_email || c.user_id).filter(Boolean)).size === 1 ? '' : 's'}
                      </span>
                    </div>

                    {filtered.map((c, idx) => (
                      <motion.div
                        key={c.id || idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                        className="rounded-2xl p-4"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        {/* Who Generated It Header */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
                              style={{ background: 'linear-gradient(135deg, #CC1E1E 0%, #7f1d1d 100%)' }}
                            >
                              {(c.user_name || c.user_email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-white font-bold text-xs truncate">
                                  {c.user_name || 'Anonymous'}
                                </span>
                                <PlanBadge plan={c.user_plan || 'free'} />
                              </div>
                              <p className="text-white/40 text-[10px] font-mono truncate">{c.user_email || 'No email'}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-amber-400/90 text-[11px] font-semibold flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />
                              {timeAgo(c.created_at)}
                            </span>
                            <span className="text-white/30 text-[10px] block mt-0.5">
                              {formatDateTime(c.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Clipping Content */}
                        <div className="py-3">
                          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-2">
                            {c.headline || 'Untitled Clipping'}
                          </h3>

                          {/* Metadata Tags */}
                          <div className="flex items-center gap-2 flex-wrap text-[10px]">
                            {c.publication_name && (
                              <span className="px-2 py-0.5 rounded-lg font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                📰 {c.publication_name}
                              </span>
                            )}
                            {c.template_id && (
                              <span className="px-2 py-0.5 rounded-lg font-semibold bg-purple-400/10 text-purple-300 border border-purple-400/20">
                                ⚡ {c.template_id}
                              </span>
                            )}
                            {c.language && (
                              <span className="px-2 py-0.5 rounded-lg font-semibold bg-sky-400/10 text-sky-300 border border-sky-400/20 uppercase">
                                🌐 {c.language}
                              </span>
                            )}
                            {c.tone && (
                              <span className="px-2 py-0.5 rounded-lg font-semibold bg-pink-400/10 text-pink-300 border border-pink-400/20 capitalize">
                                🎭 {c.tone}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-lg font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                              ✓ {c.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5 flex-wrap">
                          <div className="flex items-center gap-2">
                            {c.png_url && (
                              <a
                                href={c.png_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 active:scale-95 transition-transform"
                                style={{ background: '#CC1E1E' }}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View PNG
                              </a>
                            )}
                            {c.pdf_url && (
                              <a
                                href={c.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white/80 flex items-center gap-1.5 active:scale-95 transition-transform"
                                style={{ background: 'rgba(255,255,255,0.08)' }}
                              >
                                <FileText className="w-3.5 h-3.5 text-red-400" />
                                PDF
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => setSelectedClippingModal(c)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white/50 hover:text-white transition-colors ml-auto"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                          >
                            Details →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ══ Users Tab ══════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-white/40 text-sm">No users found.</div>
              ) : (
                <div className="space-y-3">
                  {/* Sort row */}
                  <div className="flex items-center gap-3 px-1 mb-1">
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Sort by:</span>
                    {(['full_name', 'created_at', 'total_generations'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => handleSort(f)}
                        className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: sortField === f ? '#38bdf8' : 'rgba(255,255,255,0.3)' }}
                      >
                        {f === 'full_name' ? 'Name' : f === 'created_at' ? 'Joined' : 'Gens'}
                        {sortField === f ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
                      </button>
                    ))}
                    <span className="ml-auto text-white/30 text-[10px]">{filteredUsers.length} users</span>
                  </div>

                  {filteredUsers.map((u, idx) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-2xl p-4"
                      style={{
                        background: u.is_banned ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${u.is_banned ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.07)'}`,
                        opacity: u.is_banned ? 0.85 : 1,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: u.is_banned ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.08)' }}>
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-black text-sm">
                              {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold text-sm truncate">
                              {u.full_name || 'No Name'}
                            </span>
                            <RoleBadge role={isSuperAdminUser(u.email) ? 'superadmin' : (u.role ?? 'user')} />
                            <PlanBadge plan={u.plan ?? 'free'} />
                            {u.is_banned && (
                              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-red-400 bg-red-500/20 border border-red-500/30">
                                <Ban className="w-2.5 h-2.5" /> Blocked
                              </span>
                            )}
                          </div>
                          <p className="text-white/40 text-xs truncate mt-0.5">{u.email}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Newspaper className="w-3 h-3 text-amber-400" />
                              <span className="text-white/60 text-[11px] font-semibold">{u.total_generations} news</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-green-400" />
                              <span className="text-white/60 text-[11px] font-semibold">{timeAgo(u.last_sign_in_at)}</span>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-white/30 text-[10px]">Joined {formatDate(u.created_at)}</span>
                            </div>
                          </div>

                          {/* Edit / Action row */}
                          {isSuperAdminUser(u.email) ? (
                            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                              <Crown className="w-3 h-3 text-amber-400" /> Superadmin (Protected)
                            </span>
                          ) : editingUserId === u.id ? (
                            <div className="mt-3 space-y-2">
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Role</label>
                                  <select
                                    value={editRole}
                                    onChange={e => setEditRole(e.target.value)}
                                    className="w-full px-2 py-1.5 rounded-lg text-xs text-white outline-none"
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                                  >
                                    <option value="user">User</option>
                                    <option value="reporter">Reporter</option>
                                    {isSuperAdmin && <option value="admin">Admin</option>}
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Plan</label>
                                  <select
                                    value={editPlan}
                                    onChange={e => setEditPlan(e.target.value)}
                                    className="w-full px-2 py-1.5 rounded-lg text-xs text-white outline-none"
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                                  >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(u)}
                                  disabled={editSaving}
                                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 active:scale-95"
                                  style={{ background: '#10b981' }}
                                >
                                  {editSaving ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-3 h-3" /> Save</>}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="flex-1 py-1.5 rounded-lg text-xs font-bold active:scale-95"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <button
                                onClick={() => startEdit(u)}
                                disabled={actionLoadingId === u.id}
                                className="px-3 py-1.5 rounded-xl text-[10px] font-bold active:scale-95 transition-transform"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
                              >
                                ✏️ Edit Role / Plan
                              </button>

                              {isSuperAdmin && (
                                <>
                                  <button
                                    onClick={() => handleToggleBlockUser(u)}
                                    disabled={actionLoadingId === u.id}
                                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50"
                                    style={{
                                      background: u.is_banned ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                      color: u.is_banned ? '#34d399' : '#fbbf24',
                                      border: `1px solid ${u.is_banned ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                    }}
                                    title={u.is_banned ? 'Unblock user' : 'Block user from logging in'}
                                  >
                                    <Ban className="w-3 h-3" />
                                    {actionLoadingId === u.id ? 'Updating…' : u.is_banned ? 'Unblock' : 'Block'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    disabled={actionLoadingId === u.id}
                                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50"
                                    style={{
                                      background: 'rgba(239,68,68,0.15)',
                                      color: '#f87171',
                                      border: '1px solid rgba(239,68,68,0.3)',
                                    }}
                                    title="Permanently remove user"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══ Logos Tab ══════════════════════════════════════════════ */}
          {activeTab === 'logos' && isSuperAdmin && (
            <motion.div key="logos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Add / Edit logo button */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    if (showLogoForm) {
                      resetLogoForm();
                    } else {
                      resetLogoForm();
                      setShowLogoForm(true);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                  style={{ background: showLogoForm ? 'rgba(255,255,255,0.06)' : '#CC1E1E' }}
                >
                  {showLogoForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showLogoForm ? (editingLogoId ? 'Cancel Editing' : 'Cancel') : 'Add Publication Logo'}
                </button>
              </div>

              {/* Add / Edit logo form */}
              <AnimatePresence>
                {showLogoForm && (
                  <motion.form
                    onSubmit={handleSaveLogo}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="p-4 space-y-3.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                          {editingLogoId ? 'Update Publication Logo' : 'New Publication Logo'}
                        </p>
                        {editingLogoId && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Editing Mode
                          </span>
                        )}
                      </div>

                      {logoFormError && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 rounded-xl px-3 py-2.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {logoFormError}
                        </div>
                      )}

                      {/* Publication Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                          Publication Name
                        </label>
                        <input
                          type="text"
                          value={logoName}
                          onChange={e => {
                            setLogoName(e.target.value);
                            if (!logoCode.trim() && !editingLogoId) {
                              setLogoCode(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''));
                            }
                          }}
                          placeholder="e.g. Spot News 24x7"
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-red-500/50"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>

                      {/* Publication Slug / Code */}
                      <div>
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                          Unique Code (slug)
                        </label>
                        <input
                          type="text"
                          value={logoCode}
                          onChange={e => setLogoCode(e.target.value)}
                          placeholder="e.g. spot_news_24x7"
                          className="w-full px-4 py-3 rounded-xl text-sm font-mono text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-red-500/50"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/*"
                        className="hidden"
                        onChange={handleLogoFileChange}
                      />

                      {/* Logo Image Picker / Dropzone */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            Logo Image File
                          </label>
                          <span className="text-[10px] text-white/30">
                            PNG, JPG, WebP, SVG (Max 10MB)
                          </span>
                        </div>

                        {logoPreview ? (
                          <div
                            className="p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.12)',
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                              {/* Preview Thumbnail with checkered background to display transparency */}
                              <div
                                className="w-16 h-12 rounded-xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden"
                                style={{
                                  background: 'linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 50%, #1e293b 50%, #1e293b 75%, #0f172a 75%, #0f172a 100%)',
                                  backgroundSize: '16px 16px',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                }}
                              >
                                <img
                                  src={logoPreview}
                                  alt="Logo Preview"
                                  className="max-h-full max-w-full object-contain drop-shadow"
                                  onError={e => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-white text-xs font-semibold truncate">
                                  {logoFile ? logoFile.name : 'Current Publication Logo'}
                                </p>
                                <p className="text-white/40 text-[10px] mt-0.5">
                                  {logoFile
                                    ? `${(logoFile.size / 1024).toFixed(1)} KB • Ready to upload`
                                    : 'Saved in cloud storage'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                type="button"
                                onClick={() => logoFileInputRef.current?.click()}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                Change Image
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (logoPreview && logoPreview.startsWith('blob:')) {
                                    URL.revokeObjectURL(logoPreview);
                                  }
                                  setLogoFile(null);
                                  setLogoPreview('');
                                  setLogoUrl('');
                                }}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/15 active:scale-95 transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => logoFileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setIsDraggingLogo(true); }}
                            onDragLeave={() => setIsDraggingLogo(false)}
                            onDrop={e => {
                              e.preventDefault();
                              setIsDraggingLogo(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleProcessLogoFile(file);
                            }}
                            className={`p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                              isDraggingLogo
                                ? 'bg-red-500/10 border-red-500 ring-2 ring-red-500/20'
                                : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                            }`}
                            style={{
                              borderWidth: '1.5px',
                              borderStyle: 'dashed',
                            }}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] flex items-center justify-center mb-2 text-white/70">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-white text-xs font-bold mb-1 text-center">
                              Click to choose logo image or drag & drop
                            </p>
                            <p className="text-white/40 text-[10px] text-center">
                              Transparent PNG recommended • Max 10MB
                            </p>
                          </div>
                        )}

                        {/* Optional manual URL toggle */}
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => setShowManualUrl(!showManualUrl)}
                            className="text-[10px] text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                          >
                            <LinkIcon className="w-2.5 h-2.5" />
                            {showManualUrl ? 'Hide manual URL field' : 'Or enter image URL manually'}
                          </button>
                        </div>

                        {showManualUrl && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2"
                          >
                            <input
                              type="text"
                              value={logoUrl}
                              onChange={e => {
                                setLogoUrl(e.target.value);
                                if (!logoFile) setLogoPreview(e.target.value);
                              }}
                              placeholder="https://example.com/logo.png"
                              className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Submit / Cancel buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {editingLogoId && (
                          <button
                            type="button"
                            onClick={resetLogoForm}
                            className="w-1/3 py-3 rounded-xl text-xs font-bold text-white/70 bg-white/10 hover:bg-white/15 active:scale-95 transition-transform"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={logoFormLoading}
                          className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
                          style={{ background: '#CC1E1E' }}
                        >
                          {logoFormLoading ? (
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              {editingLogoId ? 'Update Publication Logo' : 'Save Publication Logo'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Logo list */}
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))}
                </div>
              ) : logos.length === 0 ? (
                <div className="text-center py-16">
                  <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No logos yet. Add a publication logo above.</p>
                  <p className="text-white/20 text-xs mt-1">Logos added here will appear in the app's logo selector for all users.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">{logos.length} Publication{logos.length !== 1 ? 's' : ''}</p>
                  {logos.map((logo, idx) => (
                    <motion.div
                      key={logo.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-3 p-4 rounded-2xl"
                      style={{
                        background: editingLogoId === logo.id
                          ? 'rgba(59,130,246,0.1)'
                          : logo.is_active
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${
                          editingLogoId === logo.id
                            ? 'rgba(59,130,246,0.4)'
                            : logo.is_active
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.04)'
                        }`,
                        opacity: logo.is_active || editingLogoId === logo.id ? 1 : 0.6,
                      }}
                    >
                      {/* Logo thumbnail */}
                      <div
                        className="w-14 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                        style={{
                          background: 'linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 50%, #1e293b 50%, #1e293b 75%, #0f172a 75%, #0f172a 100%)',
                          backgroundSize: '12px 12px',
                        }}
                      >
                        <img
                          src={logo.logo_url}
                          alt={logo.name}
                          className="h-full w-auto object-contain"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{logo.name}</p>
                        <p className="text-white/40 text-[10px] font-mono">{logo.publication_code}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${logo.is_active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'}`}>
                            {logo.is_active ? '● Active' : '○ Inactive'}
                          </span>
                          {editingLogoId === logo.id && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-blue-400 bg-blue-400/10 border border-blue-400/30">
                              Editing
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEditLogo(logo)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                          style={{
                            background: editingLogoId === logo.id ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.12)',
                            border: editingLogoId === logo.id ? '1px solid rgba(59,130,246,0.5)' : 'none',
                          }}
                          title="Edit / Update Logo"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleToggleLogo(logo.id, logo.is_active)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                          style={{ background: logo.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)' }}
                          title={logo.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {logo.is_active
                            ? <Eye className="w-3.5 h-3.5 text-green-400" />
                            : <EyeOff className="w-3.5 h-3.5 text-white/40" />
                          }
                        </button>
                        <button
                          onClick={() => handleDeleteLogo(logo.id, logo.name)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                          style={{ background: 'rgba(239,68,68,0.12)' }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Info note */}
              <div className="mt-6 rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p className="text-amber-400/80 text-xs font-semibold leading-relaxed">
                  💡 Logos added here appear in the logo selector on the Generate screen for all users.
                  When a publication pays for access, add their logo here to activate it.
                  Toggle active/inactive without deleting.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Clipping Details Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedClippingModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClippingModal(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
              style={{ background: '#112233', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white font-bold text-sm">Clipping Details</h3>
                </div>
                <button
                  onClick={() => setSelectedClippingModal(null)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* Headline */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Headline</label>
                  <p className="text-white font-bold text-base leading-snug">{selectedClippingModal.headline}</p>
                </div>

                {/* Generator User Card */}
                <div className="p-3.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-2">Generated By</label>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-bold text-sm">{selectedClippingModal.user_name || 'User'}</p>
                      <p className="text-white/40 text-xs font-mono">{selectedClippingModal.user_email || 'No email'}</p>
                      <p className="text-white/20 text-[10px] font-mono mt-0.5">UID: {selectedClippingModal.user_id}</p>
                    </div>
                    <PlanBadge plan={selectedClippingModal.user_plan || 'free'} />
                  </div>
                </div>

                {/* Image Preview */}
                {selectedClippingModal.png_url && (
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">PNG Preview</label>
                    <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 max-h-64 flex items-center justify-center p-2">
                      <img
                        src={selectedClippingModal.png_url}
                        alt="Clipping preview"
                        className="max-h-60 w-auto object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Technical Meta Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Publication</span>
                    <span className="text-white font-medium">{selectedClippingModal.publication_name || 'Standard'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Template ID</span>
                    <span className="text-white font-medium font-mono">{selectedClippingModal.template_id}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Language</span>
                    <span className="text-white font-medium uppercase">{selectedClippingModal.language}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Tone</span>
                    <span className="text-white font-medium capitalize">{selectedClippingModal.tone}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Columns / Font</span>
                    <span className="text-white font-medium">{selectedClippingModal.layout_columns ?? 3} cols • {selectedClippingModal.font_family || 'Default'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03]">
                    <span className="text-white/40 text-[10px] block">Created At</span>
                    <span className="text-white font-medium">{formatDateTime(selectedClippingModal.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2">
                {selectedClippingModal.png_url && (
                  <a
                    href={selectedClippingModal.png_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 active:scale-95 transition-transform"
                    style={{ background: '#CC1E1E' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open PNG
                  </a>
                )}
                {selectedClippingModal.pdf_url && (
                  <a
                    href={selectedClippingModal.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 active:scale-95 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400" /> Open PDF
                  </a>
                )}
                <button
                  onClick={() => setSelectedClippingModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};
