"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ——— Navbar ———
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl" style={{ fontFamily: "'Caveat', cursive" }}>Drawlify</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">How it works</a>
          <a href="#testimonials" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">Testimonials</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Log in</a>
          <a href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-[#6c5ce7] rounded-lg hover:brightness-110 transition-all">Start Drawing</a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-[#fdfbf7] border-b border-gray-200 overflow-hidden">
            <div className="flex flex-col gap-4 px-4 py-6">
              <a href="#features" className="text-gray-500 hover:text-gray-900 text-sm" onClick={() => setOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 text-sm" onClick={() => setOpen(false)}>How it works</a>
              <a href="#testimonials" className="text-gray-500 hover:text-gray-900 text-sm" onClick={() => setOpen(false)}>Testimonials</a>
              <a href="/signup" className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6c5ce7] rounded-lg text-center block">Start Drawing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ——— Hero ———
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#6c5ce7]/8 via-[#fdcb6e]/12 to-[#00b894]/8">
      <motion.div className="absolute top-24 left-[10%] w-16 h-16 rounded-full border-2 border-[#e84393]/30" animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-40 right-[15%] w-12 h-12 border-2 border-[#fdcb6e]/40 rounded-[12px_4px_16px_8px] bg-[#fdcb6e]/10" animate={{ y: [6, -6, 6], rotate: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
      <motion.div className="absolute bottom-32 left-[20%] w-10 h-10 border-2 border-[#0984e3]/30 rotate-45" animate={{ y: [-5, 5, -5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6c5ce7]/10 text-[#6c5ce7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
              Free & Open Source
            </div>
          </motion.div>
          <motion.h1 className="text-6xl md:text-8xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Caveat', cursive" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Draw. Think.<br /><span className="text-[#6c5ce7]">Collaborate.</span>
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            A virtual whiteboard for sketching hand-drawn like diagrams. Simple, intuitive, and endlessly creative.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <a href="/dashboard" className="px-8 py-3 text-base font-medium text-white bg-[#6c5ce7] rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.97] transition-all inline-flex items-center gap-2 justify-center">
              Start Drawing <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <button className="px-8 py-3 text-base font-medium border-2 border-gray-200 bg-white/80 backdrop-blur rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all">
              See how it works
            </button>
          </motion.div>
        </div>

        {/* Hero Preview Image (New Whiteboard Design) */}
        <motion.div
          className="mt-16 w-full max-w-[1000px] mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <img
              src="/canvas-preview.png"
              alt="Whiteboard flowchart preview"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ——— Features ———
const features = [
  { icon: "✏️", title: "Hand-drawn feel", description: "Sketchy, natural-looking shapes that feel like a real whiteboard.", color: "bg-[#e84393]/10" },
  { icon: "👥", title: "Real-time collab", description: "Invite teammates and draw together — changes sync instantly.", color: "bg-[#0984e3]/10" },
  { icon: "📥", title: "Export anywhere", description: "Save as PNG, SVG, or share a live link with anyone.", color: "bg-[#00b894]/10" },
  { icon: "🎨", title: "Infinite canvas", description: "Zoom, pan, and draw without limits on a boundless canvas.", color: "bg-[#fdcb6e]/10" },
  { icon: "⚡", title: "Blazing fast", description: "Lightweight and snappy — no loading screens, ever.", color: "bg-[#6c5ce7]/10" },
  { icon: "🔒", title: "Private & secure", description: "End-to-end encrypted. Your drawings stay yours.", color: "bg-[#00b894]/10" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive" }}>Everything you need</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Powerful features wrapped in a simple, delightful experience.</p>
        </div>
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          {features.map((f) => (
            <motion.div key={f.title} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="p-6 rounded-2xl bg-[#f5f1eb] border-2 border-gray-900/10 rounded-[12px_4px_16px_8px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl ${f.color}`}>{f.icon}</div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Caveat', cursive" }}>{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ——— How It Works ———
const steps = [
  { num: "01", title: "Open the canvas", desc: "No sign-up required. Just open the app and start creating." },
  { num: "02", title: "Sketch your ideas", desc: "Use shapes, arrows, text, and freehand tools to bring ideas to life." },
  { num: "03", title: "Share & collaborate", desc: "Send a link to teammates and edit together in real-time." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#f5f1eb]/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive" }}>How it works</h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto">From zero to sketch in three simple steps.</p>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.num} className="flex items-start gap-6 p-6 rounded-2xl bg-[#f5f1eb] border-2 border-gray-900/10 rounded-[12px_4px_16px_8px]" initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
              <span className="text-4xl font-bold text-[#6c5ce7]/20 shrink-0" style={{ fontFamily: "'Caveat', cursive" }}>{step.num}</span>
              <div>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Caveat', cursive" }}>{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— Testimonials ———
const testimonials = [
  { name: "Sarah K.", role: "Product Designer", quote: "This replaced my sticky notes and Miro boards. It just feels right.", border: "border-[#e84393]/30" },
  { name: "James L.", role: "Software Engineer", quote: "I use it to sketch system diagrams every day. Clean and fast.", border: "border-[#0984e3]/30" },
  { name: "Priya M.", role: "Startup Founder", quote: "We brainstorm all our ideas here. The collab features are magic.", border: "border-[#00b894]/30" },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive" }}>Loved by creators</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} className={`p-6 rounded-2xl bg-[#f5f1eb] border-2 ${t.border} shadow-[4px_4px_0px_rgba(0,0,0,0.08)]`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <p className="text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <p className="font-bold text-xl" style={{ fontFamily: "'Caveat', cursive" }}>{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— CTA ———
function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#6c5ce7]/8 via-[#fdcb6e]/12 to-[#00b894]/8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive" }}>Ready to sketch?</h2>
          <p className="text-lg text-gray-500 mb-8">No sign-up. No download. Just open and draw.</p>
          <a href="/dashboard" className="px-8 py-3 text-base font-medium text-white bg-[#6c5ce7] rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.97] transition-all inline-flex items-center gap-2">
            Open Drawlify <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ——— Footer ———
function Footer() {
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

// ——— Page ———
export default function Page() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <main className="min-h-screen bg-[#fdfbf7] text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
      </main>
    </>
  );
}
