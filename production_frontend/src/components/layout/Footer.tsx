import Link from "next/link";
import { Newspaper, MessageCircle, Code, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 text-sm text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-white/10 text-white p-1.5 rounded-lg">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                NewsCraft <span className="text-primary-500 font-sans text-sm">AI</span>
              </span>
            </Link>
            <p className="max-w-xs">
              Generate premium, realistic newspaper clippings in multiple languages instantly using AI.
            </p>
              <a href="#" className="hover:text-white transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Code className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/languages" className="hover:text-white transition-colors">Languages</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/showcase" className="hover:text-white transition-colors">Showcase</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NewsCraft AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>Systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
