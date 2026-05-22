"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-white text-black p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                NewsCraft <span className="text-primary-500 font-sans text-sm">AI</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100 hover:scale-105"
            >
              Get Started
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-gray-300 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              <Link
                href="/login"
                className="text-base font-medium text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black w-full"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
