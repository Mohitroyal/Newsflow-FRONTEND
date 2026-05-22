"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Globe2, FileOutput, LayoutTemplate, Zap,
  CheckCircle2, Star, Quote, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Sparkles, title: "AI Headline Generation", desc: "Let our model craft compelling, publication-quality headlines from your raw article text." },
  { icon: Globe2, title: "6+ Languages Supported", desc: "Generate in English, Telugu, Hindi, Tamil, Kannada, and Malayalam with native typography." },
  { icon: LayoutTemplate, title: "20+ Premium Templates", desc: "Classic broadsheet, tabloid, magazine, vintage, bilingual — all pixel-perfect." },
  { icon: FileOutput, title: "High-Res PNG & PDF Export", desc: "Download at 300dpi, print-ready quality in a single click." },
  { icon: Zap, title: "Instant Cloud Rendering", desc: "Complex multi-column layouts rendered in seconds on our cloud infrastructure." },
  { icon: CheckCircle2, title: "Brand Customization", desc: "Add your own logo, fonts, and publication name to every clipping." },
];

const testimonials = [
  { name: "Priya Sharma", role: "Content Creator", text: "I used NewsCraft AI to create a Telugu newspaper front page for my brand campaign. It looked so real people thought it was an actual paper!", stars: 5 },
  { name: "Marcus Johnson", role: "Marketing Director", text: "Generated 50 unique newspaper clippings for a product launch in 3 days. Would have taken a design team 3 weeks.", stars: 5 },
  { name: "Ananya Reddy", role: "Journalist", text: "The multilingual support is phenomenal. Side-by-side Telugu and English layouts are perfect for our bilingual readership.", stars: 5 },
];

const steps = [
  { step: "01", title: "Write or paste your article", desc: "Add your content or let AI generate it for you instantly." },
  { step: "02", title: "Choose language & template", desc: "Pick from 6+ languages and 20+ authentic newspaper layouts." },
  { step: "03", title: "Generate & download", desc: "AI renders your clipping and you download a print-ready PNG or PDF." },
];

export default function LandingPage() {
  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-700/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden" animate="show" variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-gray-300 mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary-400" />
          AI-Powered · 6+ Languages · Print-Ready
        </motion.div>

        <motion.h1
          initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-black text-white max-w-5xl leading-[1.05] tracking-tight"
        >
          Generate{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-[size:200%] animate-[shimmer_3s_linear_infinite]">
            Newspaper Clippings
          </span>{" "}
          with AI
        </motion.h1>

        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={2}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl"
        >
          Create realistic, multilingual newspaper layouts in seconds — for storytelling, marketing, and media campaigns.
        </motion.p>

        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={3}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            Start Generating Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/15"
          >
            Explore Features
          </Link>
        </motion.div>

        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={4}
          className="mt-6 text-sm text-gray-600"
        >
          No credit card required · 5 free generations/month
        </motion.p>

        {/* Fake Newspaper Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 w-full max-w-3xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
          <div className="bg-[#fdfbf7] rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden p-6 sm:p-10">
            <div className="border-b-4 border-black pb-3 mb-4 text-center">
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter">The Daily Chronicle</h2>
              <div className="flex justify-between text-[9px] sm:text-xs font-bold uppercase border-y border-black mt-2 py-1 text-black">
                <span>Vol. CXXIV · No. 42</span><span>Thursday, May 16, 2026</span><span>$1.50</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-serif text-xl font-black text-black mb-2 leading-tight">AI Transforms Global Media Publishing Industry</h3>
                <div className="h-24 bg-gray-200 border border-gray-300 mb-2 flex items-center justify-center text-xs text-gray-400">[Photo]</div>
                <p className="text-[10px] text-black leading-relaxed text-justify">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.</p>
              </div>
              <div className="space-y-3">
                <div className="border-b border-gray-300 pb-3">
                  <h4 className="font-serif text-sm font-bold text-black mb-1">Markets at Record High</h4>
                  <p className="text-[10px] text-black leading-relaxed">Global indices surge on strong earnings from tech sector companies.</p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-black mb-1">Space Mission Launched</h4>
                  <p className="text-[10px] text-black leading-relaxed">International crew embarks on historic six-month lunar mission.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
            >
              Everything you need
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              A complete toolkit for generating world-class newspaper clippings at any scale.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all group"
              >
                <div className="bg-primary-500/15 group-hover:bg-primary-500/25 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
            >
              How it works
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-gray-400 text-lg"
            >
              Three steps from idea to print-ready clipping.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i * 0.15}
                className="relative flex flex-col items-center text-center"
              >
                <div className="text-6xl font-black text-white/5 font-serif absolute -top-4 left-1/2 -translate-x-1/2 select-none">{step.step}</div>
                <div className="relative z-10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-lg font-black text-primary-400">{step.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-7 -right-4 h-6 w-6 text-white/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
            >
              Loved by creators
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <Quote className="h-6 w-6 text-primary-500/40" />
                <p className="text-gray-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h2
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Start free, scale when ready
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-gray-400 text-lg mb-8"
          >
            5 free clippings every month. Upgrade to Pro for unlimited access.
          </motion.p>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-black hover:bg-gray-100 transition-all hover:scale-105">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 font-medium text-white hover:bg-white/15 transition-all">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
