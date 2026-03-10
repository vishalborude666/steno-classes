import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDailyChallenge } from '../../features/dictation/dictationSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import PracticeEditor from '../../components/practice/PracticeEditor'
import Loader from '../../components/common/Loader'
import { Calendar } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

const DailyChallengePage = () => {
  const dispatch = useDispatch()
  const { dailyChallenge, loading } = useSelector((state) => state.dictation)

  useEffect(() => {
    dispatch(fetchDailyChallenge())
  }, [dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Challenge</h1>
            <p className="text-gray-500 text-sm">{formatDate(new Date())} · New challenge every day</p>
          </div>
        </div>

        {loading || !dailyChallenge ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : (
          <PracticeEditor dictation={dailyChallenge} />
        )}
      </div>
    </DashboardLayout>
  )
}

export default DailyChallengePage
