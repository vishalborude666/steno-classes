import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import { fetchDictation } from '../../features/dictation/dictationSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import PracticeEditor from '../../components/practice/PracticeEditor'
import Loader from '../../components/common/Loader'

const PracticeEditorPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selectedDictation, loading } = useSelector((state) => state.dictation)

  useEffect(() => {
    dispatch(fetchDictation(id))
  }, [id, dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Link to="/practice" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-5 text-sm transition-colors">
          <ArrowLeft size={16} />
          Back to Dictations
        </Link>

        {loading || !selectedDictation ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : (
          <PracticeEditor dictation={selectedDictation} />
        )}
      </div>
    </DashboardLayout>
  )
}

export default PracticeEditorPage
