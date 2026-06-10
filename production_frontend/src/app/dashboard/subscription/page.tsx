"use client";

import { Check, Zap, CreditCard, ArrowUpRight, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore, useUIStore } from "@/store";
import { subscriptionService } from "@/services/subscription.service";
import { authService } from "@/services/auth.service";
import { useState, useEffect } from "react";
import type { Subscription } from "@/types";

const subscriptionTranslations = {
  en: {
    title: "Subscription",
    subtitle: "Manage your plan, usage, and billing",
    successTitle: "Subscription upgraded successfully!",
    successDesc: "Thank you for subscribing to Pro! You can now use all templates and generate clippings without watermarks.",
    canceledTitle: "Checkout Canceled",
    canceledDesc: "Your payment check-out process was canceled. No charges were made.",
    planName: "{plan} Plan",
    pendingCancel: "Canceled (Pending End)",
    active: "Active",
    freeDesc: "5 generations/month · Standard templates · Watermarked exports",
    proDesc: "100 generations/month · No watermark · High-res exports · Premium templates",
    entDesc: "Unlimited generations · REST API access · Custom branding & fonts",
    upgradeBtn: "Upgrade to Pro",
    reactivateBtn: "Reactivate Plan",
    cancelBtn: "Cancel Subscription",
    usageTitle: "Monthly Usage",
    usageLabel: "Generations",
    whyTitle: "Why upgrade to Pro?",
    featList: [
      "100 generations per month",
      "No watermark on exports",
      "High-res 300dpi PNG & PDF",
      "Telugu, Hindi, Tamil & more",
      "All premium templates",
      "Priority email support",
    ],
    pricingBtn: "View Pricing Plans",
    billingTitle: "Billing",
    noPayment: "No payment method on file — free plan",
    billedStripe: "Billed through Stripe Subscription ID: {id}"
  },
  te: {
    title: "సబ్‌స్క్రిప్షన్",
    subtitle: "మీ ప్లాన్, వినియోగం మరియు బిల్లింగ్‌ని నిర్వహించండి",
    successTitle: "సబ్‌స్క్రిప్షన్ విజయవంతంగా అప్‌గ్రేడ్ చేయబడింది!",
    successDesc: "ప్రోకి సబ్‌స్క్రయిబ్ చేసినందుకు ధన్యవాదాలు! మీరు ఇప్పుడు అన్ని టెంప్లేట్‌లను ఉపయోగించవచ్చు మరియు వాటర్మార్క్‌లు లేకుండా క్లిప్పింగ్‌లను సృష్టించవచ్చు.",
    canceledTitle: "చెక్అవుట్ రద్దు చేయబడింది",
    canceledDesc: "మీ చెల్లింపు చెక్-అవుట్ ప్రక్రియ రద్దు చేయబడింది. ఎటువంటి ఛార్జీలు విధించబడలేదు.",
    planName: "{plan} ప్లాన్",
    pendingCancel: "రద్దు చేయబడింది (ముగింపు పెండింగ్‌లో ఉంది)",
    active: "యాక్టివ్",
    freeDesc: "నెలకు 5 సృష్టిలు · ప్రామాణిక టెంప్లేట్లు · వాటర్‌మార్క్డ్ ఎగుమతులు",
    proDesc: "నెలకు 100 సృష్టిలు · వాటర్‌మార్క్ లేదు · హై-రెస్ ఎగుమతులు · ప్రీమియం టెంప్లేట్లు",
    entDesc: "అపరిమిత సృష్టిలు · REST API యాక్సెస్ · అనుకూల బ్రాండింగ్ & ఫాంట్‌లు",
    upgradeBtn: "ప్రో కి అప్‌గ్రేడ్ చేయండి",
    reactivateBtn: "ప్లాన్‌ను తిరిగి సక్రియం చేయండి",
    cancelBtn: "సబ్‌స్క్రిప్షన్ రద్దు చేయండి",
    usageTitle: "నెలవారీ వినియోగం",
    usageLabel: "సృష్టిలు",
    whyTitle: "ప్రో కి ఎందుకు అప్‌గ్రేడ్ చేయాలి?",
    featList: [
      "నెలకు 100 సృష్టిలు",
      "ఎగుమతులపై వాటర్‌మార్క్ లేదు",
      "హై-రెస్ 300dpi PNG & PDF",
      "తెలుగు, హిందీ, తమిళం & మరిన్ని",
      "అన్ని ప్రీమియం టెంప్లేట్లు",
      "ప్రాధాన్యత ఇమెయిల్ మద్దతు",
    ],
    pricingBtn: "ధరల ప్లాన్లను చూడండి",
    billingTitle: "బిల్లింగ్",
    noPayment: "ఫైల్‌లో ఎటువంటి చెల్లింపు పద్ధతి లేదు — ఉచిత ప్లాన్",
    billedStripe: "స్ట్రైప్ సబ్‌స్క్రిప్షన్ ID ద్వారా బిల్ చేయబడింది: {id}"
  },
  hi: {
    title: "सदस्यता",
    subtitle: "अपनी योजना, उपयोग और बिलिंग प्रबंधित करें",
    successTitle: "सदस्यता सफलतापूर्वक अपग्रेड की गई!",
    successDesc: "प्रो की सदस्यता लेने के लिए धन्यवाद! अब आप सभी टेम्पलेट्स का उपयोग कर सकते हैं और बिना वॉटरमार्क के कतरन जनरेट कर सकते हैं।",
    canceledTitle: "चेकआउट रद्द कर दिया गया",
    canceledDesc: "आपकी भुगतान चेक-आउट प्रक्रिया रद्द कर दी गई थी। कोई शुल्क नहीं लिया गया।",
    planName: "{plan} योजना",
    pendingCancel: "रद्द (समाप्ति लंबित)",
    active: "सक्रिय",
    freeDesc: "5 जनरेशन/महीना · मानक टेम्पलेट · वॉटरमार्क वाले निर्यात",
    proDesc: "100 जनरेशन/महीना · कोई वॉटरमार्क नहीं · उच्च-रिज़ॉल्यूशन निर्यात · प्रीमियम टेम्पलेट",
    entDesc: "असीमित जनरेशन · REST API एक्सेस · कस्टम ब्रांडिंग और फोंट",
    upgradeBtn: "प्रो में अपग्रेड करें",
    reactivateBtn: "योजना फिर से सक्रिय करें",
    cancelBtn: "सदस्यता रद्द करें",
    usageTitle: "मासिक उपयोग",
    usageLabel: "जनरेशन",
    whyTitle: "प्रो में क्यों अपग्रेड करें?",
    featList: [
      "प्रति माह 100 जनरेशन",
      "निर्यात पर कोई वॉटरमार्क नहीं",
      "हाई-रेस 300dpi PNG और PDF",
      "तेलुगु, हिंदी, तमिल और बहुत कुछ",
      "सभी प्रीमियम टेम्पलेट",
      "प्राथमिकता ईमेल सहायता",
    ],
    pricingBtn: "मूल्य निर्धारण योजनाएं देखें",
    billingTitle: "बिलिंग",
    noPayment: "फाइल पर कोई भुगतान विधि नहीं है — मुफ्त योजना",
    billedStripe: "स्ट्राइप सब्सक्रिप्शन आईडी के माध्यम से बिल किया गया: {id}"
  },
  kn: {
    title: "ಚಂದಾದಾರಿಕೆ",
    subtitle: "ನಿಮ್ಮ ಯೋಜನೆ, ಬಳಕೆ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ",
    successTitle: "ಚಂದಾದಾರಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲಾಗಿದೆ!",
    successDesc: "ಪ್ರೊಗೆ ಚಂದಾದಾರರಾಗಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ನೀವು ಈಗ ಎಲ್ಲಾ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಬಳಸಬಹುದು ಮತ್ತು ವಾಟರ್‌ಮಾರ್ಕ್ ಇಲ್ಲದೆ ಕ್ಲಿಪ್ಪಿಂಗ್‌ಗಳನ್ನು ರಚಿಸಬಹುದು.",
    canceledTitle: "ಚೆಕ್ಔಟ್ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ",
    canceledDesc: "ನಿಮ್ಮ ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಶುಲ್ಕಗಳನ್ನು ವಿಧಿಸಲಾಗಿಲ್ಲ.",
    planName: "{plan} ಯೋಜನೆ",
    pendingCancel: "ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ (ಮುಕ್ತಾಯ ಬಾಕಿ ಇದೆ)",
    active: "ಸಕ್ರಿಯ",
    freeDesc: "ತಿಂಗಳಿಗೆ 5 ಸೃಷ್ಟಿಗಳು · ಪ್ರಮಾಣಿತ ಟೆಂಪ್ಲೇಟ್‌ಗಳು · ವಾಟರ್‌ಮಾರ್ಕ್ ರಫ್ತುಗಳು",
    proDesc: "ತಿಂಗಳಿಗೆ 100 ಸೃಷ್ಟಿಗಳು · ವಾಟರ್‌ಮಾರ್ಕ್ ಇಲ್ಲ · ಹೆಚ್ಚಿನ ರೆಸಲ್ಯೂಶನ್ ರಫ್ತುಗಳು · ಪ್ರೀಮಿಯಂ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
    entDesc: "ಅನಿಯಮಿತ ಸೃಷ್ಟಿಗಳು · REST API ಪ್ರವೇಶ · ಕಸ್ಟಮ್ ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮತ್ತು ಫಾಂಟ್‌ಗಳು",
    upgradeBtn: "ಪ್ರೊಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    reactivateBtn: "ಯೋಜನೆಯನ್ನು ಪುನಃ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    cancelBtn: "ಚಂದಾದಾರಿಕೆ ರದ್ದುಮಾಡಿ",
    usageTitle: "ಮಾಸಿಕ ಬಳಕೆ",
    usageLabel: "ಸೃಷ್ಟಿಗಳು",
    whyTitle: "ಪ್ರೊಗೆ ಏಕೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಬೇಕು?",
    featList: [
      "ತಿಂಗಳಿಗೆ 100 ಸೃಷ್ಟಿಗಳು",
      "ರಫ್ತುಗಳ ಮೇಲೆ ಯಾವುದೇ ವಾಟರ್‌ಮಾರ್ಕ್ ಇಲ್ಲ",
      "ಹೈ-ರೆಸ್ 300dpi PNG ಮತ್ತು PDF",
      "ತೆಲುಗು, ಹಿಂದಿ, ತಮಿಳು ಮತ್ತು ಹೆಚ್ಚಿನವು",
      "ಎಲ್ಲಾ ಪ್ರೀಮಿಯಂ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
      "ಆದ್ಯತೆಯ ಇಮೇಲ್ ಬೆಂಬಲ",
    ],
    pricingBtn: "ಬೆಲೆ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    billingTitle: "ಬಿಲ್ಲಿಂಗ್",
    noPayment: "ಯಾವುದೇ ಪಾವತಿ ವಿಧಾನವಿಲ್ಲ — ಉಚಿತ ಯೋಜನೆ",
    billedStripe: "ಸ್ಟ್ರೈಪ್ ಚಂದಾದಾರಿಕೆ ಐಡಿ ಮೂಲಕ ಬಿಲ್ ಮಾಡಲಾಗಿದೆ: {id}"
  },
  ta: {
    title: "சந்தா",
    subtitle: "உங்கள் திட்டம், பயன்பாடு மற்றும் பில்லிங்கை நிர்வகிக்கவும்",
    successTitle: "சந்தா வெற்றிகரமாக மேம்படுத்தப்பட்டது!",
    successDesc: "புரோவுக்கு சந்தா செலுத்தியதற்கு நன்றி! நீங்கள் இப்போது அனைத்து வார்ப்புருக்களையும் பயன்படுத்தலாம் மற்றும் வாட்டர்மார்க்ஸ் இல்லாமல் செய்தி துண்டுகளை உருவாக்கலாம்.",
    canceledTitle: "செக்அவுட் ரத்து செய்யப்பட்டது",
    canceledDesc: "உங்கள் கட்டண செக்-அவுட் செயல்முறை ரத்து செய்யப்பட்டது. கட்டணங்கள் எதுவும் வசூலிக்கப்படவில்லை.",
    planName: "{plan} திட்டம்",
    pendingCancel: "ரத்து செய்யப்பட்டது (முடிவு நிலுவையில் உள்ளது)",
    active: "செயலில் உள்ளது",
    freeDesc: "மாதத்திற்கு 5 உருவாக்கங்கள் · நிலையான வார்ப்புருக்கள் · வாட்டர்மார்க் செய்யப்பட்ட ஏற்றுமதிகள்",
    proDesc: "மாதத்திற்கு 100 உருவாக்கங்கள் · வாட்டர்மார்க் இல்லை · உயர்-தெளிவுத்திறன் ஏற்றுமதிகள் · பிரீமியம் வார்ப்புருக்கள்",
    entDesc: "வரம்பற்ற உருவாக்கங்கள் · REST API அணுகல் · தனிப்பயன் பிராண்டிங் & எழுத்துருக்கள்",
    upgradeBtn: "புரோவுக்கு மேம்படுத்தவும்",
    reactivateBtn: "திட்டத்தை மீண்டும் செயல்படுத்தவும்",
    cancelBtn: "சந்தாவை ரத்துசெய்",
    usageTitle: "மாதாந்திர பயன்பாடு",
    usageLabel: "உருவாக்கங்கள்",
    whyTitle: "ஏன் புரோவுக்கு மேம்படுத்த வேண்டும்?",
    featList: [
      "மாதத்திற்கு 100 உருவாக்கங்கள்",
      "ஏற்றுமதிகளில் வாட்டர்மார்க் இல்லை",
      "உயர்-தெளிவுத்திறன் 300dpi PNG & PDF",
      "தெலுங்கு, இந்தி, தமிழ் மற்றும் பல",
      "அனைத்து பிரீமியம் வார்ப்புருக்கள்",
      "முன்னுரிமை மின்னஞ்சல் ஆதரவு",
    ],
    pricingBtn: "விலை திட்டங்களைக் காண்க",
    billingTitle: "பில்லிங்",
    noPayment: "பணம் செலுத்தும் முறை எதுவும் பதிவு செய்யப்படவில்லை — இலவச திட்டம்",
    billedStripe: "ஸ்ட்ரைப் சந்தா ஐடி மூலம் பில் செய்யப்பட்டது: {id}"
  },
  ml: {
    title: "സബ്‌സ്‌ക്രിപ്‌ഷൻ",
    subtitle: "നിങ്ങളുടെ പ്ലാൻ, ഉപയോഗം, ബില്ലിംഗ് എന്നിവ നിയന്ത്രിക്കുക",
    successTitle: "സബ്‌സ്‌ക്രിപ്‌ഷൻ വിജയകരമായി അപ്‌ഗ്രേഡ് ചെയ്‌തു!",
    successDesc: "പ്രോ സബ്‌സ്‌ക്രൈബ് ചെയ്‌തതിന് നന്ദി! നിങ്ങൾക്ക് ഇപ്പോൾ എല്ലാ ടെംപ്ലേറ്റുകളും ഉപയോഗിക്കാനും വാട്ടർമാർക്കില്ലാതെ ക്ലിപ്പിംഗുകൾ നിർമ്മിക്കാനും കഴിയും.",
    canceledTitle: "ചെക്ക്ഔട്ട് റദ്ദാക്കി",
    canceledDesc: "നമ്മുടെ പേയ്‌മെന്റ് ചെക്ക്-ഔട്ട് പ്രക്രിയ റദ്ദാക്കി. നിരക്കുകളൊന്നും ഈടാക്കിയിട്ടില്ല.",
    planName: "{plan} പ്ലാൻ",
    pendingCancel: "റദ്ദാക്കി (അവസാനിപ്പിക്കൽ ബാക്കി)",
    active: "സജീവം",
    freeDesc: "പ്രതിമാസം 5 സൃഷ്ടികൾ · സാധാരണ ടെംപ്ലേറ്റുകൾ · വാട്ടർമാർക്ക്ഡ് എക്സ്പോർട്ടുകൾ",
    proDesc: "പ്രതിമാസം 100 സൃഷ്ടികൾ · വാട്ടർമാർക്ക് ഇല്ല · ഉയർന്ന റെസല്യൂഷൻ എക്സ്പോർട്ടുകൾ · പ്രീമിയം ടെംപ്ലേറ്റുകൾ",
    entDesc: "അൺലിമിറ്റഡ് സൃഷ്ടികൾ · REST API ആക്സസ് · ഇഷ്‌ടാനുസൃത ബ്രാൻഡിംഗും ഫോണ്ടുകളും",
    upgradeBtn: "പ്രോയിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യുക",
    reactivateBtn: "പ്ലാൻ വീണ്ടും സജീവമാക്കുക",
    cancelBtn: "സബ്‌സ്‌ക്രിപ്‌ഷൻ റദ്ദാക്കുക",
    usageTitle: "പ്രതിമാസ ഉപയോഗം",
    usageLabel: "സൃഷ്ടികൾ",
    whyTitle: "എന്തുകൊണ്ട് പ്രോയിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യണം?",
    featList: [
      "പ്രതിമാസം 100 സൃഷ്ടികൾ",
      "കയറ്റുമതിയിൽ വാട്ടർമാർക്ക് ഇല്ല",
      "ഹൈ-റെസ് 300dpi PNG & PDF",
      "തെലുങ്ക്, ഹിന്ദി, തമിഴ് & പലതും",
      "എല്ലാ പ്രീമിയം ടെംപ്ലേറ്റുകളും",
      "മുൻഗണനാ ഇമെയിൽ പിന്തുണ",
    ],
    pricingBtn: "വിലനിർണ്ണയ പ്ലാനുകൾ കാണുക",
    billingTitle: "ബില്ലിംഗ്",
    noPayment: "പെയ്മെന്റ് രീതികളൊന്നും ലഭ്യമല്ല — സൗജന്യ പ്ലാൻ",
    billedStripe: "സ്ട്രൈപ്പ് സബ്‌സ്‌ക്രിപ്‌ഷൻ ഐഡി വഴി ബില്ല് ചെയ്‌തു: {id}"
  }
};

export default function SubscriptionPage() {
  const { user, updateUser } = useAuthStore();
  const { language } = useUIStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState(false);
  const [cancelBanner, setCancelBanner] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("session_id")) {
        setSuccessBanner(true);
        // Force refresh user profile to update plan to Pro in store
        authService.getProfile().then((res) => {
          if (res.success) {
            updateUser(res.data);
          }
        }).catch(err => console.error("Error refreshing profile: ", err));
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get("canceled")) {
        setCancelBanner(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const res = await subscriptionService.getCurrentSubscription();
        if (res.success) {
          setSubscription(res.data);
        }
      } catch (err: any) {
        console.error("Failed to load subscription details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const activeLanguage = mounted ? language : "en";
  const t = subscriptionTranslations[activeLanguage as keyof typeof subscriptionTranslations] || subscriptionTranslations.en;

  const handleCancel = async () => {
    setError(null);
    setMessage(null);
    setActionLoading(true);
    try {
      const res = await subscriptionService.cancelSubscription();
      if (res.success) {
        setSubscription(res.data);
        updateUser({ plan: "free" }); // Optionally revert or wait for webhook
        setMessage(activeLanguage === "te" ? "మీ సబ్‌స్క్రిప్షన్ బిల్లింగ్ వ్యవధి ముగిసే సమయానికి రద్దు చేయబడుతుంది." : "Your subscription has been set to cancel at the end of the billing period.");
      } else {
        setError(res.message || "Failed to cancel subscription.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setError(null);
    setMessage(null);
    setActionLoading(true);
    try {
      const res = await subscriptionService.reactivateSubscription();
      if (res.success) {
        setSubscription(res.data);
        updateUser({ plan: res.data.planId });
        setMessage(activeLanguage === "te" ? "మీ సబ్‌స్క్రిప్షన్ విజయవంతంగా పునరుద్ధరించబడింది!" : "Your subscription was reactivated successfully!");
      } else {
        setError(res.message || "Failed to reactivate subscription.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const currentPlan = user?.plan || "free";
  const creditsTotal = currentPlan === "pro" ? 100 : currentPlan === "enterprise" ? 99999 : 5;
  
  // We can track generated clippings from user state or defaults
  const creditsUsed = user?.credits !== undefined ? (creditsTotal - user.credits) : 0;
  const creditsPct = creditsTotal > 0 ? (creditsUsed / creditsTotal) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Helper to format capitalized plan names in Plan banner
  const capitalizedPlan = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  const localizedPlanTitle = t.planName.replace("{plan}", activeLanguage === "te" ? (currentPlan === "free" ? "ఉచిత" : currentPlan === "pro" ? "ప్రో" : "ఎంటర్‌ప్రైజ్") : capitalizedPlan);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
      </div>

      {successBanner && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-4 rounded-2xl text-sm">
          <Check className="h-5 w-5 shrink-0 text-green-400" />
          <div>
            <p className="font-bold">{t.successTitle}</p>
            <p className="text-xs text-green-400/80 mt-0.5">{t.successDesc}</p>
          </div>
        </div>
      )}

      {cancelBanner && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-4 rounded-2xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-400" />
          <div>
            <p className="font-bold">{t.canceledTitle}</p>
            <p className="text-xs text-yellow-400/80 mt-0.5">{t.canceledDesc}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm">
          <Check className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-primary-900/30 to-accent-900/30 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <Zap className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{localizedPlanTitle}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                subscription?.status === "canceled"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                  : "bg-green-500/20 text-green-400 border-green-500/20"
              }`}>
                {subscription?.status === "canceled" ? t.pendingCancel : t.active}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {currentPlan === "free" && t.freeDesc}
              {currentPlan === "pro" && t.proDesc}
              {currentPlan === "enterprise" && t.entDesc}
            </p>
          </div>
        </div>
        {currentPlan === "free" ? (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shrink-0"
          >
            {t.upgradeBtn}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex gap-2">
            {subscription?.status === "canceled" ? (
              <button
                disabled={actionLoading}
                onClick={handleReactivate}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shrink-0"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t.reactivateBtn}
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={handleCancel}
                className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shrink-0"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t.cancelBtn}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">{t.usageTitle}</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-300">{t.usageLabel}</span>
              <span className="text-sm font-medium text-white">{user?.credits !== undefined ? (creditsTotal - user.credits) : 0} / {creditsTotal}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${creditsPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pro features comparison */}
      {currentPlan === "free" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">{t.whyTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.featList.map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="h-4 w-4 text-green-400 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-all"
          >
            {t.pricingBtn}
          </Link>
        </div>
      )}

      {/* Billing */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">{t.billingTitle}</h2>
        <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-xl p-4">
          <CreditCard className="h-5 w-5 shrink-0" />
          <span>
            {currentPlan === "free"
              ? t.noPayment
              : t.billedStripe.replace("{id}", subscription?.id || "Active Sub")}
          </span>
        </div>
      </div>
    </div>
  );
}
