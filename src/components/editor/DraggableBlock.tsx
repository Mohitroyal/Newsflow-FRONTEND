"use client";

import { Rnd } from "react-rnd";
import { useState } from "react";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2 } from "lucide-react";

export default function DraggableBlock({ block, updateBlock, zoom, isSelected, onSelect }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStop = (e: any, d: any) => {
    updateBlock(block.id, { x: d.x / zoom, y: d.y / zoom });
  };

  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    updateBlock(block.id, {
      w: parseInt(ref.style.width) / zoom,
      h: parseInt(ref.style.height) / zoom,
      ...position
    });
  };

  const deleteBlock = () => {
    updateBlock(block.id, { _delete: true }); // Need to handle deletion in parent
  };

  return (
    <Rnd
      scale={zoom}
      position={{ x: block.x * zoom, y: block.y * zoom }}
      size={{ width: block.w * zoom, height: block.h * zoom }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      className={`absolute ${isSelected || isHovered || isEditing ? 'ring-2 ring-primary-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={onSelect}
      dragHandleClassName="drag-handle"
    >
      {/* Floating Toolbar */}
      {(isSelected || isHovered || isEditing) && (
        <div className="absolute -top-10 left-0 bg-white shadow-xl border border-gray-200 rounded-lg p-1 flex gap-1 z-50">
          <div className="drag-handle cursor-move px-2 flex items-center text-gray-400 hover:text-gray-700">
            ⠿
          </div>
          <div className="w-px h-4 bg-gray-200 my-auto mx-1" />
          
          {block.type === "text" && (
            <>
              <input 
                type="color" 
                value={block.color || "#000000"} 
                onChange={(e) => updateBlock(block.id, { color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer"
              />
              <select 
                value={block.fontSize || 16}
                onChange={(e) => updateBlock(block.id, { fontSize: parseInt(e.target.value) })}
                className="text-xs border rounded px-1"
              >
                {[12,14,16,18,20,24,28,32,36,40,48,56,64,72,84,96,112,128,144].map(s => <option key={s} value={s}>{s}px</option>)}
              </select>
              <button 
                onClick={() => updateBlock(block.id, { fontWeight: block.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`p-1 rounded ${block.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              ><Bold className="h-3 w-3"/></button>
              <button 
                onClick={() => updateBlock(block.id, { textAlign: 'left' })}
                className={`p-1 rounded ${block.textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              ><AlignLeft className="h-3 w-3"/></button>
              <button 
                onClick={() => updateBlock(block.id, { textAlign: 'center' })}
                className={`p-1 rounded ${block.textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              ><AlignCenter className="h-3 w-3"/></button>
              <button 
                onClick={() => updateBlock(block.id, { textAlign: 'right' })}
                className={`p-1 rounded ${block.textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              ><AlignRight className="h-3 w-3"/></button>
            </>
          )}
          
          <div className="w-px h-4 bg-gray-200 my-auto mx-1" />
          <button 
            onClick={deleteBlock}
            className="p-1 rounded hover:bg-red-100 text-red-500"
            title="Delete Block"
          ><Trash2 className="h-3 w-3"/></button>
        </div>
      )}

      {/* Block Content */}
      <div 
        className="w-full h-full"
        onDoubleClick={() => setIsEditing(true)}
      >
        {block.type === "text" ? (
          isEditing ? (
            <textarea
              autoFocus
              className="w-full h-full bg-transparent resize-none outline-none border-none"
              style={{
                fontSize: `${block.fontSize}px`,
                fontWeight: block.fontWeight,
                textAlign: block.textAlign as any,
                color: block.color,
                lineHeight: 1.4,
              }}
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <div 
              className="w-full h-full whitespace-pre-wrap overflow-hidden"
              style={{
                fontSize: `${block.fontSize}px`,
                fontWeight: block.fontWeight,
                textAlign: block.textAlign as any,
                color: block.color,
                lineHeight: 1.4,
              }}
            >
              {block.content}
            </div>
          )
        ) : block.type === "image" ? (
          <img 
            src={block.src} 
            alt="Block" 
            className="w-full h-full object-contain" 
          />
        ) : null}
      </div>
    </Rnd>
  );
}
