"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function SnippetCard() {
  const [copied, setCopied] = useState(false);
  const command = "npm create codelore-app";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm bg-[#000000] rounded-3xl p-6 arch-shadow group relative overflow-hidden transition-all duration-500 hover:border-accent/30 border border-transparent">
      {/* Subtle stripe background like the button */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(135deg, #7fffc3 25%, transparent 25%, transparent 50%, #7fffc3 50%, #7fffc3 75%, transparent 75%, transparent)',
             backgroundSize: '8px 8px' 
           }} />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">NPM</span>
          <code className="block text-sm font-mono text-zinc-300 tracking-tight">
            {command}
          </code>
        </div>
        
        <button 
          onClick={handleCopy}
          className="w-10 h-10 bg-zinc-800/50 hover:bg-zinc-800 text-accent transition-all rounded-xl flex items-center justify-center border border-white/5"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Decorative glow like the image */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/10 blur-3xl rounded-full" />
    </div>
  );
}
