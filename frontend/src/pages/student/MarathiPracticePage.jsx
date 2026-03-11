import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Filter, Type } from 'lucide-react'
import { fetchDictations } from '../../features/dictation/dictationSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate } from '../../utils/formatters'

const MarathiPracticePage = () => {
  const dispatch = useDispatch()
  const { dictations, loading, pagination } = useSelector((state) => state.dictation)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    dispatch(fetchDictations({ search: debouncedSearch, difficulty, page, language: 'marathi' }))
  }, [debouncedSearch, difficulty, page, dispatch])

  const badgeClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">मराठी टायपिंग सराव</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Marathi Typing Practice — सुरेख फॉन्ट सराव</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="शोधा / Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field w-36"
              >
                <option value="">All Levels</option>
                <option value="easy">सोपे (Easy)</option>
                <option value="medium">मध्यम (Medium)</option>
                <option value="hard">कठीण (Hard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : dictations.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Type size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">कोणतेही मराठी डिक्टेशन सापडले नाही</p>
            <p className="text-sm mt-1">No Marathi dictations found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dictations.map((d) => (
              <Link
                key={d._id}
                to={`/practice/${d._id}`}
                className="card hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">म</span>
                  </div>
                  <span className={badgeClass[d.difficulty]}>{d.difficulty}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {d.title}
                </h3>
                {d.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{d.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400">{d.uploadedBy?.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(d.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MarathiPracticePage
