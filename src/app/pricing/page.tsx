"use client";

import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { subscriptionService } from "@/services/subscription.service";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out the platform",
    monthly: "0",
    annual: "0",
    features: ["5 generations/month", "Watermarked exports", "Standard quality (72 dpi)", "Basic English support", "1 basic template"],
    missing: ["Remove watermark", "High-res export (300 dpi)", "Multilingual support", "Premium templates", "API access"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for creators and marketers",
    monthly: "19",
    annual: "15",
    features: ["100 generations/month", "No watermark", "High-res PNG & PDF (300 dpi)", "All 6+ languages", "All 20+ templates", "Priority support"],
    missing: ["API access", "Custom branding"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For agencies and media companies",
    monthly: "59",
    annual: "49",
    features: ["Unlimited generations", "No watermark", "High-res PNG & PDF (300 dpi)", "All 6+ languages", "All 20+ templates", "REST API access", "Custom branding & fonts", "Dedicated support"],
    missing: [],
    cta: "Upgrade to Enterprise",
    popular: false,
  },
];

const faqs = [
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. You'll retain access to Pro features until the end of your billing period." },
  { q: "How does the free plan work?", a: "You get 5 free generations every calendar month — no credit card required. Exports include a NewsCraft watermark." },
  { q: "Is the Telugu / Indic language rendering accurate?", a: "Yes. We use Noto Sans Indic fonts and Unicode-safe rendering for native script fidelity in all supported languages." },
  { q: "Can I use the generated images commercially?", a: "Yes. All generated clippings are royalty-free and owned by you once created." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
    setError(null);
    if (planId === "free") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (!isAuthenticated) {
      router.push(`/signup?redirect=/pricing&plan=${planId}&interval=${annual ? "annual" : "monthly"}`);
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await subscriptionService.createCheckout(planId, annual ? "annual" : "monthly");
      if (res.success && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        setError(res.message || "Failed to create checkout session.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 text-xl mb-8"
          >
            Start free, upgrade when you need more. All plans include our core AI engine.
          </motion.p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full bg-primary-500 transition-colors"
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${annual ? "left-7" : "left-1"}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>
              Annual <span className="text-green-400 text-xs bg-green-400/10 px-1.5 py-0.5 rounded-full ml-1">-20%</span>
            </span>
          </div>

          {error && (
            <div className="mt-6 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl max-w-md mx-auto text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => {
            const isCurrentPlan = user?.plan === plan.id || (!user?.plan && plan.id === "free" && isAuthenticated);
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col p-8 rounded-3xl border transition-transform hover:scale-[1.02] ${
                  plan.popular
                    ? "border-primary-500 bg-gradient-to-b from-primary-900/20 to-black shadow-[0_0_60px_rgba(59,130,246,0.15)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    ✦ Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white">${annual ? plan.annual : plan.monthly}</span>
                    <span className="text-gray-400 mb-1.5">/mo</span>
                  </div>
                  {annual && plan.monthly !== "0" && (
                    <p className="text-xs text-gray-500 mt-1">Billed annually · Save ${(parseInt(plan.monthly) - parseInt(plan.annual)) * 12}/year</p>
                  )}
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <X className="h-4 w-4 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={loadingPlan !== null || isCurrentPlan}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    isCurrentPlan
                      ? "bg-green-500/20 text-green-400 border border-green-500/20 cursor-default"
                      : plan.popular
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    "Your Current Plan"
                  ) : (
                    plan.cta
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-white list-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl font-light leading-none">+</span>
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
