export function Footer() {
  return (
    <footer className="bg-brutal-white py-12 px-6 lg:px-20 border-t-8 border-brutal-black font-bold uppercase tracking-tight">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🏴‍☠️</span>
          <h3 className="text-2xl font-[var(--font-bangers)]">CODELORE</h3>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="hover:text-brutal-blue transition-colors">Documentation</a>
          <a href="#" className="hover:text-brutal-blue transition-colors">Github</a>
          <a href="#" className="hover:text-brutal-blue transition-colors">Tambo AI</a>
        </div>

        <div className="text-sm opacity-50">
          © 2026 CODELORE / BUILT WITH TAMBO
        </div>
      </div>
    </footer>
  );
}
