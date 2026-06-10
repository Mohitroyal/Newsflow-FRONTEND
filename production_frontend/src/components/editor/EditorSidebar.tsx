"use client";

import { Type, Image as ImageIcon, Layout, BoxSelect } from "lucide-react";

export default function EditorSidebar({ layout, setLayout, selectedBlockId, updateBlock }: any) {
  return (
    <div className="w-64 bg-neutral-900 border-r border-white/10 shrink-0 flex flex-col">
      <div className="p-4 border-b border-white/10 font-medium text-white flex items-center gap-2">
        <BoxSelect className="h-4 w-4 text-primary-400" /> Page Settings
      </div>
      
      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Background Color */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Background</label>
          <div className="flex gap-2">
            {["#ffffff", "#fdfbf7", "#f3f4f6", "#000000"].map((color) => (
              <button 
                key={color}
                onClick={() => setLayout({ ...layout, backgroundColor: color })}
                className={`w-8 h-8 rounded-full border-2 ${layout.backgroundColor === color ? "border-primary-500" : "border-white/20"} hover:border-white/50 transition-colors`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Type className="h-3 w-3" /> Global Font</label>
          <select 
            value={layout.fontFamily}
            onChange={(e) => setLayout({ ...layout, fontFamily: e.target.value })}
            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="playfair">Playfair Display (Serif)</option>
            <option value="merriweather">Merriweather (Editorial)</option>
            <option value="inter">Inter (Modern)</option>
            <option value="courier">Courier (Typewriter)</option>
          </select>
        </div>

        <hr className="border-white/10" />

        {/* Selected Element */}
        {selectedBlockId && layout.blocks.find((b: any) => b.id === selectedBlockId)?.type === 'text' && (
          <div className="space-y-2 bg-white/5 p-3 rounded-lg border border-primary-500/30">
            <label className="text-xs font-semibold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              Selected Text
            </label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={layout.blocks.find((b: any) => b.id === selectedBlockId)?.color || "#000000"} 
                onChange={(e) => updateBlock(selectedBlockId, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                title="Text Color"
              />
              <select 
                value={layout.blocks.find((b: any) => b.id === selectedBlockId)?.fontSize || 16}
                onChange={(e) => updateBlock(selectedBlockId, { fontSize: parseInt(e.target.value) })}
                className="flex-1 bg-black border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500"
              >
                {[12,14,16,18,20,24,28,32,36,40,48,56,64,72,84,96,112,128,144].map(s => <option key={s} value={s}>{s}px</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => updateBlock(selectedBlockId, { fontWeight: layout.blocks.find((b: any) => b.id === selectedBlockId)?.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`flex-1 p-2 rounded ${layout.blocks.find((b: any) => b.id === selectedBlockId)?.fontWeight === 'bold' ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              >
                B
              </button>
              {['left', 'center', 'right'].map((align) => (
                <button 
                  key={align}
                  onClick={() => updateBlock(selectedBlockId, { textAlign: align })}
                  className={`flex-1 p-2 rounded ${layout.blocks.find((b: any) => b.id === selectedBlockId)?.textAlign === align ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                  title={`Align ${align}`}
                >
                  {align === 'left' ? 'L' : align === 'center' ? 'C' : 'R'}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedBlockId && <hr className="border-white/10" />}

        {/* Elements */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Add Elements</label>
          
          <button 
            onClick={() => setLayout({
              ...layout, 
              blocks: [...layout.blocks, { id: Date.now().toString(), type: "text", content: "New Heading", x: 100, y: 100, w: 400, h: 50, fontSize: 24, fontWeight: "bold", textAlign: "left", color: "#000" }]
            })}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-200"
          >
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Type className="h-4 w-4" /></div>
            Add Text Block
          </button>
          
          <button 
            onClick={() => setLayout({
              ...layout, 
              blocks: [...layout.blocks, { id: Date.now().toString(), type: "image", src: "https://via.placeholder.com/400x300", x: 100, y: 200, w: 400, h: 300 }]
            })}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-200"
          >
            <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg"><ImageIcon className="h-4 w-4" /></div>
            Add Image Block
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-200 opacity-50 cursor-not-allowed">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg"><Layout className="h-4 w-4" /></div>
            Add Column Container
          </button>
        </div>
      </div>
    </div>
  );
}
