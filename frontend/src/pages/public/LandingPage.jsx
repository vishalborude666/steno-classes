import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Mic, Trophy, BarChart3, Shield, Zap, Users, ArrowRight, Play, Sparkles, ChevronDown, LayoutDashboard, Keyboard, Headphones, Target } from 'lucide-react'
import Navbar from '../../components/common/Navbar'

const features = [
  { icon: Mic, title: 'Audio Dictation', desc: 'Listen to real stenography audio with speed controls (0.5x–2x).', color: 'from-purple-500 to-cyan-400', shadow: 'shadow-purple-500/20' },
  { icon: Zap, title: 'Instant Scoring', desc: 'Get real-time WPM and accuracy calculated the moment you submit.', color: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/20' },
  { icon: Trophy, title: 'Leaderboard', desc: 'Compete with other students and climb the global rankings.', color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Visualize your improvement with charts and detailed history.', color: 'from-purple-500 to-violet-400', shadow: 'shadow-purple-500/20' },
  { icon: Users, title: 'Teacher Tools', desc: 'Upload audio, YouTube links, and manage your student reports.', color: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-500/20' },
  { icon: Shield, title: 'Secure Platform', desc: 'Rate-limited, JWT-authenticated, and role-based access control.', color: 'from-indigo-500 to-purple-400', shadow: 'shadow-indigo-500/20' },
]

// Typing animation hook
const useTypingEffect = (words, speed = 100, pause = 2000) => {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1))
        if (text === current) setTimeout(() => setIsDeleting(true), pause)
      } else {
        setText(current.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, speed, pause])

  return text
}

// Interactive mouse tilt hook
const useTilt = () => {
  const ref = useRef(null)
  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02,1.02,1.02)`
  }, [])
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  }, [])
  return { ref, handleMouseMove, handleMouseLeave }
}

// Scroll reveal hook  
const useScrollReveal = () => {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const nodes = ref.current?.querySelectorAll('.reveal')
    nodes?.forEach((el) => observer.observe(el))
    return () => nodes?.forEach((el) => observer.unobserve(el))
  }, [])
  return ref
}

// Mouse parallax for hero
const useMouseParallax = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return mouse
}

const dashboardPath = { student: '/dashboard', teacher: '/teacher', admin: '/admin' }

const LandingPage = () => {
  const pageRef = useScrollReveal()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const typedText = useTypingEffect(['Practice.', 'Improve.', 'Excel.', 'Compete.', 'Master.'], 120, 1500)
  const mouse = useMouseParallax()
  const heroCard = useTilt()

  return (
    <div ref={pageRef} className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="hero-gradient relative min-h-[94vh] flex items-center justify-center text-white overflow-hidden">
        {/* Animated orbs with mouse parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Orb 1 — large blue */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.6), transparent 70%)',
              top: '-10%', left: '-5%',
              transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          {/* Orb 2 — purple */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[80px]"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)',
              top: '30%', right: '-8%',
              transform: `translate(${mouse.x * -20}px, ${mouse.y * 25}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          {/* Orb 3 — cyan */}
          <div
            className="absolute w-[350px] h-[350px] rounded-full opacity-20 blur-[90px]"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.5), transparent 70%)',
              bottom: '5%', left: '25%',
              transform: `translate(${mouse.x * 15}px, ${mouse.y * -15}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 particle-bg opacity-20" />

          {/* Floating 3D shapes */}
          <div className="absolute top-[15%] left-[8%] w-16 h-16 border-2 border-white/10 rounded-2xl animate-float rotate-12" />
          <div className="absolute top-[25%] right-[12%] w-10 h-10 border-2 border-white/10 rounded-full animate-float-delayed" />
          <div className="absolute bottom-[20%] left-[15%] w-12 h-12 border-2 border-cyan-400/15 rounded-lg animate-float-slow rotate-45" />
          <div className="absolute bottom-[30%] right-[8%] w-8 h-8 bg-gradient-to-br from-purple-400/10 to-purple-400/10 rounded-lg animate-float rotate-6" />
          <div className="absolute top-[60%] left-[5%] w-6 h-6 bg-amber-400/10 rounded-full animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm text-purple-200 mb-10 animate-bounce-in">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>Professional Stenography Training Platform</span>
          </div>

          {/* Title with 3D tilt */}
          <div
            ref={heroCard.ref}
            onMouseMove={heroCard.handleMouseMove}
            onMouseLeave={heroCard.handleMouseLeave}
            className="transition-transform duration-300 ease-out mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
              <span className="block animate-slide-in-left">Master</span>
              <span className="block bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent animate-slide-in-right">
                Stenography
              </span>
            </h1>
          </div>

          {/* Typing effect subtitle */}
          <div className="text-2xl md:text-3xl font-bold mb-6 h-10 animate-fade-in">
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span className="inline-block w-0.5 h-7 bg-amber-300 ml-1 animate-pulse" />
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-purple-100/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Listen to dictation audio, type your best, and track your speed & accuracy in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            {isAuthenticated ? (
              <Link
                to={dashboardPath[user?.role] || '/dashboard'}
                className="group relative inline-flex items-center gap-3 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
              >
                <LayoutDashboard size={20} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                Go to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative inline-flex items-center gap-3 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
                >
                  <Play size={20} className="group-hover:scale-125 group-hover:text-purple-600 transition-all duration-300" />
                  Start Practicing
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 glass text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-1.5"
                >
                  Login Now
                </Link>
              </>
            )}
          </div>

          {/* Mini floating icons around CTA */}
          <div className="relative mt-16 flex justify-center gap-6 animate-fade-in">
            {[Headphones, Keyboard, Target].map((Icon, i) => (
              <div key={i} className="h-12 w-12 rounded-2xl glass flex items-center justify-center animate-float" style={{ animationDelay: `${i * 0.8}s` }}>
                <Icon size={20} className="text-purple-300/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,60 C360,100 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,100 L0,100 Z" className="fill-white dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES — 3D Interactive Cards ═══════════════════════ */}
      <section className="py-28 px-4 relative">
        {/* Background accents */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/30 to-purple-100/20 dark:from-purple-900/5 dark:to-purple-900/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/20 to-emerald-100/10 dark:from-cyan-900/5 dark:to-emerald-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="reveal text-center mb-20">
            <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
              <Sparkles size={16} className="animate-pulse" /> Features
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Everything you need to{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">improve</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 C50 2, 150 2, 198 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                  <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#2563eb" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
                </svg>
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Comprehensive tools designed for students and teachers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map(({ icon: Icon, title, desc, color, shadow }, i) => (
              <div
                key={title}
                className={`reveal feature-card-3d group bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 cursor-default hover:shadow-2xl ${shadow} relative overflow-hidden`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Hover glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${color} rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />

                {/* Icon with gradient background */}
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg ${shadow} group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-500`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                {/* Bottom accent line */}
                <div className={`h-1 w-0 group-hover:w-2/3 bg-gradient-to-r ${color} rounded-full mt-6 transition-all duration-700 ease-out`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS — Timeline Style ═══════════════════════ */}
      <section className="py-28 px-4 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg opacity-15 dark:opacity-5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="reveal text-center mb-20">
            <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
              <Play size={16} /> How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Three simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-purple-300 via-purple-300 to-emerald-300 dark:from-purple-700 dark:via-purple-700 dark:to-emerald-700 opacity-40" />

            {[
              { step: '01', title: 'Listen', desc: 'Pick a dictation audio and listen at your preferred speed.', gradient: 'from-purple-600 to-cyan-500', icon: Headphones },
              { step: '02', title: 'Type', desc: 'Type what you hear in the live editor with real-time diff highlighting.', gradient: 'from-purple-600 to-pink-500', icon: Keyboard },
              { step: '03', title: 'Improve', desc: 'Get instant WPM & accuracy scores. Track your progress over time.', gradient: 'from-emerald-600 to-teal-500', icon: Target },
            ].map(({ step, title, desc, gradient, icon: StepIcon }, i) => (
              <div key={step} className="reveal group text-center" style={{ transitionDelay: `${i * 200}ms` }}>
                {/* Animated step circle */}
                <div className="relative mx-auto mb-8 w-20 h-20">
                  {/* Rotating ring */}
                  <div className={`absolute inset-[-4px] rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500`} style={{ padding: '2px' }}>
                    <div className="w-full h-full rounded-2xl bg-gray-50 dark:bg-gray-900" />
                  </div>
                  {/* Shadow bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl rotate-6 opacity-20 group-hover:rotate-12 group-hover:opacity-30 transition-all duration-500`} />
                  {/* Main icon */}
                  <div className={`relative h-full w-full bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                    <StepIcon size={30} className="text-white" />
                  </div>
                </div>
                <span className={`inline-block text-xs font-black uppercase tracking-widest bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>Step {step}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-400/10 blob-shape animate-float blur-2xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/10 blob-shape animate-float-delayed blur-2xl" />
          {/* Floating shapes */}
          <div className="absolute top-[20%] right-[15%] w-14 h-14 border-2 border-white/10 rounded-2xl animate-float rotate-12" />
          <div className="absolute bottom-[25%] left-[10%] w-10 h-10 border-2 border-white/10 rounded-full animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Ready to start your{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">journey</span>?
            </h2>
            <p className="text-purple-200/70 mb-12 text-lg max-w-lg mx-auto">
              Contact your teacher to get your login credentials and start improving today.
            </p>
            {isAuthenticated ? (
              <Link
                to={dashboardPath[user?.role] || '/dashboard'}
                className="group inline-flex items-center gap-3 bg-white text-primary-700 font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03]"
              >
                Go to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center gap-3 bg-white text-primary-700 font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03]"
              >
                Login Now
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-gray-950 text-gray-500 text-center py-8 text-sm border-t border-gray-800">
        <p>© {new Date().getFullYear()} <span className="text-gray-300 font-semibold">Lucent Shorthand Classes</span>. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
