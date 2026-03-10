import { Link } from 'react-router-dom'
import { BookOpen, Mic, Trophy, BarChart3, Shield, Zap, Users, Award } from 'lucide-react'
import Navbar from '../../components/common/Navbar'

const features = [
  { icon: Mic, title: 'Audio Dictation', desc: 'Listen to real stenography audio with speed controls (0.5x–2x).' },
  { icon: Zap, title: 'Instant Scoring', desc: 'Get real-time WPM and accuracy calculated the moment you submit.' },
  { icon: Trophy, title: 'Leaderboard', desc: 'Compete with other students and climb the global rankings.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Visualize your improvement with charts and detailed history.' },
  { icon: Users, title: 'Teacher Tools', desc: 'Upload audio, YouTube links, and manage your student reports.' },
  { icon: Shield, title: 'Secure Platform', desc: 'Rate-limited, JWT-authenticated, and role-based access control.' },
]

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm text-blue-200 mb-6">
            <Award size={14} />
            <span>Professional Stenography Training Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Master Stenography<br />
            <span className="text-blue-300">Practice. Improve. Excel.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Listen to dictation audio, type your best, and track your speed and accuracy in real time. Trusted by students and teachers nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary text-lg px-8 py-4 bg-white text-primary-700 hover:bg-blue-50">
              Start Practicing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-50 dark:bg-primary-950/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 text-center">
          {[['10K+', 'Students'], ['500+', 'Dictations'], ['1M+', 'Practices'], ['95%', 'Satisfaction']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-primary-700 dark:text-primary-400">{val}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Everything you need to improve
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">Comprehensive tools for students and teachers</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:shadow-md transition-shadow group">
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/60 transition-colors">
                  <Icon size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-800 to-primary-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
        <p className="text-blue-200 mb-8">Contact your teacher to get your login credentials and start improving today.</p>
        <Link to="/login" className="inline-block bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg">
          Login Now
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} Lucent Shorthand Classes.
      </footer>
    </div>
  )
}

export default LandingPage
