"use client";

export function LoadingDots() {
  return (
    <div className="flex justify-start comic-enter">
      <div className="speech-bubble speech-bubble-ai">
        <span className="text-xs font-bold uppercase text-text-secondary block mb-1">AI Navigator</span>
        <div className="flex gap-1 py-1">
          <span className="w-2 h-2 rounded-full bg-text-secondary/60 dot-bounce-1" />
          <span className="w-2 h-2 rounded-full bg-text-secondary/60 dot-bounce-2" />
          <span className="w-2 h-2 rounded-full bg-text-secondary/60 dot-bounce-3" />
        </div>
      </div>
    </div>
  );
}
