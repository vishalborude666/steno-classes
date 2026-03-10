import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHistory } from '../../features/practice/practiceSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import HistoryTable from '../../components/dashboard/HistoryTable'
import Loader from '../../components/common/Loader'
import { History } from 'lucide-react'

const PracticeHistoryPage = () => {
  const dispatch = useDispatch()
  const { history, loading, pagination } = useSelector((state) => state.practice)
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchHistory({ page, limit: 15 }))
  }, [page, dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <History size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice History</h1>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-10"><Loader /></div>
          ) : (
            <HistoryTable history={history} />
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                  p === page ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 hover:bg-primary-50'
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

export default PracticeHistoryPage
