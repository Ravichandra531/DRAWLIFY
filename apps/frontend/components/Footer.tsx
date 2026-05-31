export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-200 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl" style={{ fontFamily: "'Caveat', cursive" }}>Drawlify</span>
        </div>
        <p className="text-gray-500 text-sm">© 2026 Drawlify. Open source & free forever.</p>
      </div>
    </footer>
  );
}
