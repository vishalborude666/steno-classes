import { Link } from 'react-router-dom'
import { BookOpen, Home } from 'lucide-react'

const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-950 flex items-center justify-center p-4 text-center">
    <div>
      <BookOpen size={48} className="text-purple-300 mx-auto mb-6" />
      <h1 className="text-8xl font-extrabold text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-purple-200 mb-3">Page Not Found</h2>
      <p className="text-purple-300 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors">
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  </div>
)

export default NotFoundPage
