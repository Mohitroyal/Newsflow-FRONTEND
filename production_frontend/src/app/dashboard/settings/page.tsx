"use client";

import { useState, useEffect } from "react";
import { Bell, Moon, Globe, Lock, Trash2, Shield, Key, Eye, EyeOff, Copy, Check, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store";

const translations = {
  en: {
    settings: "Settings",
    manageAcc: "Manage your account preferences",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    darkModeDesc: "Use the dark theme across the application",
    interfaceLang: "Interface Language",
    interfaceLangDesc: "Language used for UI labels and prompts",
    notifications: "Notifications",
    emailGen: "Email — Generation Complete",
    emailGenDesc: "Get notified when your newspaper is ready",
    emailBilling: "Email — Billing Alerts",
    emailBillingDesc: "Invoices and payment confirmations",
    emailUpdates: "Email — Product Updates",
    emailUpdatesDesc: "New features and announcements",
    browserPush: "Browser Push Notifications",
    browserPushDesc: "Real-time alerts in the browser",
    security: "Security",
    changePass: "Change Password",
    changePassDesc: "Update your account password",
    updateBtn: "Update",
    apiKey: "API Key",
    apiKeyDesc: "Use the API key to access NewsCraft programmatically",
    revealBtn: "Reveal Key",
    tfa: "Two-Factor Authentication",
    tfaDesc: "Add an extra layer of security",
    dangerZone: "Danger Zone",
    deleteAcc: "Delete Account",
    deleteAccDesc: "Permanently delete your account and all associated data. This cannot be undone.",
  },
  te: {
    settings: "సెట్టింగ్‌లు",
    manageAcc: "మీ ఖాతా ప్రాధాన్యతలను నిర్వహించండి",
    appearance: "స్వరూపం",
    darkMode: "డార్క్ మోడ్",
    darkModeDesc: "అప్లికేషన్ అంతటా డార్క్ థీమ్‌ను ఉపయోగించండి",
    interfaceLang: "ఇంటర్‌ఫేస్ భాష",
    interfaceLangDesc: "UI లేబుల్స్ మరియు ప్రాంప్ట్‌ల కోసం ఉపయోగించే భాష",
    notifications: "నోటిఫికేషన్‌లు",
    emailGen: "ఇమెయిల్ — జనరేషన్ పూర్తయింది",
    emailGenDesc: "మీ వార్తాపత్రిక సిద్ధమైనప్పుడు తెలియజేయండి",
    emailBilling: "ఇమెయిల్ — బిల్లింగ్ హెచ్చరికలు",
    emailBillingDesc: "ఇన్‌వాయిస్‌లు మరియు చెల్లింపు నిర్ధారణలు",
    emailUpdates: "ఇమెయిల్ — ఉత్పత్తి నవీకరణలు",
    emailUpdatesDesc: "కొత్త ఫీచర్లు మరియు ప్రకటనలు",
    browserPush: "బ్రౌజర్ పుష్ నోటిఫికేషన్‌లు",
    browserPushDesc: "బ్రౌజర్‌లో రియల్-టైమ్ హెచ్చరికలు",
    security: "భద్రత",
    changePass: "పాస్వర్డ్ మార్చండి",
    changePassDesc: "మీ ఖాతా పాస్‌వర్డ్‌ను నవీకరించండి",
    updateBtn: "నవీకరించండి",
    apiKey: "API కీ",
    apiKeyDesc: "ప్రోగ్రామాటిక్‌గా యాక్సెస్ చేయడానికి కీని ఉపయోగించండి",
    revealBtn: "కీని వెల్లడించండి",
    tfa: "టూ-ఫాక్టర్ అథెంటికేషన్",
    tfaDesc: "భద్రత యొక్క అదనపు పొరను జోడించండి",
    dangerZone: "డేంజర్ జోన్",
    deleteAcc: "ఖాతాను తొలగించండి",
    deleteAccDesc: "మీ ఖాతా మరియు డేటాను శాశ్వతంగా తొలగించండి. దీన్ని వెనక్కి తీసుకోలేరు.",
  },
  hi: {
    settings: "सेटिंग्स",
    manageAcc: "अपनी खाता प्राथमिकताएं प्रबंधित करें",
    appearance: "दिखावट",
    darkMode: "डार्क मोड",
    darkModeDesc: "एप्लिकेशन में डार्क थीम का उपयोग करें",
    interfaceLang: "इंटरफ़ेस भाषा",
    interfaceLangDesc: "UI लेबल और प्रॉम्प्ट के लिए उपयोग की जाने वाली भाषा",
    notifications: "सूचनाएं",
    emailGen: "ईमेल - निर्माण पूर्ण",
    emailGenDesc: "जब आपका अखबार तैयार हो जाए तो सूचना प्राप्त करें",
    emailBilling: "ईमेल - बिलिंग अलर्ट",
    emailBillingDesc: "चालान और भुगतान की पुष्टि",
    emailUpdates: "ईमेल - उत्पाद अपडेट",
    emailUpdatesDesc: "नई सुविधाएँ और घोषणाएँ",
    browserPush: "ब्राउज़र पुश सूचनाएँ",
    browserPushDesc: "ब्राउज़र में वास्तविक समय अलर्ट",
    security: "सुरक्षा",
    changePass: "पासवर्ड बदलें",
    changePassDesc: "अपना खाता पासवर्ड अपडेट करें",
    updateBtn: "अपडेट करें",
    apiKey: "API कुंजी",
    apiKeyDesc: "प्रोग्रामेटिक रूप से एक्सेस करने के लिए कुंजी का उपयोग करें",
    revealBtn: "कुंजी प्रकट करें",
    tfa: "दो-कारक प्रमाणीकरण",
    tfaDesc: "सुरक्षा की एक अतिरिक्त परत जोड़ें",
    dangerZone: "डेंजर जोन",
    deleteAcc: "खाता हटाएं",
    deleteAccDesc: "अपना खाता और डेटा स्थायी रूप से हटाएं। इसे वापस नहीं लिया जा सकता।",
  }
};

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-primary-500" : "bg-gray-200 dark:bg-white/10"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-white/5">{children}</div>
    </div>
  );
}

function SettingsRow({ label, description, control }: { label: string; description?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { language, setLanguage, theme, toggleTheme } = useUIStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLanguage = mounted ? language : "en";
  const t = translations[activeLanguage as keyof typeof translations] || translations.en;

  // Initialize notifications from localStorage
  const [notifications, setNotifications] = useState({
    emailGenerations: true,
    emailBilling: true,
    emailUpdates: true,
    browserPush: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("newscraft-notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notifications storage", e);
      }
    }
  }, []);

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("newscraft-notifications", JSON.stringify(updated));
      return updated;
    });
  };

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [isTfaModalOpen, setIsTfaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);



  // Two-Factor state
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [tfaVerificationCode, setTfaVerificationCode] = useState("");

  // Delete Account confirmation text
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };



  const handleTfaToggle = () => {
    if (tfaEnabled) {
      setTfaEnabled(false);
    } else {
      setIsTfaModalOpen(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.settings}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.manageAcc}</p>
      </div>

      {/* Appearance */}
      <SettingsSection title={t.appearance} icon={Moon}>
        <SettingsRow
          label={t.darkMode}
          description={t.darkModeDesc}
          control={<ToggleSwitch enabled={theme === "dark"} onToggle={toggleTheme} />}
        />
        <SettingsRow
          label={t.interfaceLang}
          description={t.interfaceLangDesc}
          control={
            <select
              value={activeLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
            </select>
          }
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title={t.notifications} icon={Bell}>
        <SettingsRow
          label={t.emailGen}
          description={t.emailGenDesc}
          control={<ToggleSwitch enabled={notifications.emailGenerations} onToggle={() => toggle("emailGenerations")} />}
        />
        <SettingsRow
          label={t.emailBilling}
          description={t.emailBillingDesc}
          control={<ToggleSwitch enabled={notifications.emailBilling} onToggle={() => toggle("emailBilling")} />}
        />
        <SettingsRow
          label={t.emailUpdates}
          description={t.emailUpdatesDesc}
          control={<ToggleSwitch enabled={notifications.emailUpdates} onToggle={() => toggle("emailUpdates")} />}
        />
        <SettingsRow
          label={t.browserPush}
          description={t.browserPushDesc}
          control={<ToggleSwitch enabled={notifications.browserPush} onToggle={() => toggle("browserPush")} />}
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title={t.security} icon={Shield}>
        <SettingsRow
          label={t.changePass}
          description={t.changePassDesc}
          control={
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Lock className="h-3 w-3" /> {t.updateBtn}
            </button>
          }
        />

        <SettingsRow
          label={t.tfa}
          description={t.tfaDesc}
          control={<ToggleSwitch enabled={tfaEnabled} onToggle={handleTfaToggle} />}
        />
      </SettingsSection>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 dark:border-red-500/20 flex items-center gap-3">
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">{t.dangerZone}</h2>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{t.deleteAcc}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.deleteAccDesc}</p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="shrink-0 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors bg-white dark:bg-transparent"
          >
            {t.deleteAcc}
          </button>
        </div>
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Change Password</h3>
              </div>
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                {passwordSuccess ? (
                  <div className="text-center py-8 space-y-2">
                    <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6" />
                    </div>
                    <p className="text-white font-semibold">Password Updated!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Current Password</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-bold text-black bg-white rounded-xl hover:bg-neutral-200 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}



        {/* Two-Factor Authentication Setup Modal */}
        {isTfaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Enable Two-Factor Auth</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-white p-3 rounded-xl">
                    <QrCode className="h-32 w-32 text-black" />
                  </div>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Scan the QR code with your authenticator app (Google Authenticator, Duo, etc.) then enter the code below.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">Verification Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={tfaVerificationCode}
                    onChange={(e) => setTfaVerificationCode(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 font-mono text-center tracking-widest text-lg"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setIsTfaModalOpen(false);
                      setTfaVerificationCode("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (tfaVerificationCode.length === 6) {
                        setTfaEnabled(true);
                        setIsTfaModalOpen(false);
                        setTfaVerificationCode("");
                      } else {
                        alert("Please enter a valid 6-digit code.");
                      }
                    }}
                    className="px-4 py-2 text-sm font-bold text-black bg-white rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    Verify & Enable
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-red-500/20 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-red-500/10">
                <h3 className="text-lg font-bold text-red-500">Delete Account Permanently</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-300">
                  This action is irreversible. All of your historical clipping generations, uploads, and credit balances will be permanently destroyed.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">
                    Type <span className="font-bold text-red-500">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmationText("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmationText !== "DELETE"}
                    onClick={() => {
                      alert("Account successfully deleted.");
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmationText("");
                    }}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
