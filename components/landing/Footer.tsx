import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background py-16 px-6 border-t arch-border border-l-0 border-r-0 border-b-0">
      <div className="arch-container flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-text-primary uppercase">CodeLore</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
            Repositories don’t need more dashboards. <br />
            They need intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <Link href="/interface" className="hover:text-accent transition-colors">Workspace</Link>
              <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-accent transition-colors">How It Works</Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Resources</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <Link href="/docs" className="hover:text-accent transition-colors">Documentation</Link>
              <Link href="https://github.com" className="hover:text-accent transition-colors">GitHub</Link>
              <Link href="https://tambo.ai" className="hover:text-accent transition-colors">Powered by Tambo</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="arch-container mt-16 pt-8 border-t arch-border border-l-0 border-r-0 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[10px] font-mono font-bold text-text-secondary/50 uppercase tracking-widest">
          © 2026 CODELORE / ARCHITECTURAL INTELLIGENCE
        </div>
        <div className="text-[10px] font-mono font-bold text-text-secondary/50 uppercase tracking-widest">
          EST. 2026
        </div>
      </div>
    </footer>
  );
}
