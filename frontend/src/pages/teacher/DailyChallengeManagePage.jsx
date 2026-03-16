import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/common/DashboardLayout'
import { fetchDictations, fetchDailyChallenge, setDailyChallenge } from '../../features/dictation/dictationSlice'
import Loader from '../../components/common/Loader'

const DailyChallengeManagePage = () => {
  const dispatch = useDispatch()
  const { dictations, dailyChallenge, loading } = useSelector((state) => state.dictation)

  useEffect(() => {
    dispatch(fetchDictations({ page: 1, limit: 100 }))
    dispatch(fetchDailyChallenge())
  }, [dispatch])

  const handleSet = (id) => {
    dispatch(setDailyChallenge(id))
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Daily Challenge (Teacher)</h1>
            <p className="text-sm text-gray-500">Set today's dictation challenge for students</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20"><Loader size="lg" /></div>
        ) : (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Current daily challenge</h3>
              {dailyChallenge ? (
                <div className="text-sm text-gray-700">{dailyChallenge.title} — by {dailyChallenge.uploadedBy?.name}</div>
              ) : (
                <div className="text-sm text-gray-500">No challenge set (uses deterministic fallback)</div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Your dictations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dictations?.map((d) => (
                      <tr key={d._id} className="border-t">
                        <td className="py-3">{d.title}</td>
                        <td className="py-3">{d.difficulty}</td>
                        <td className="py-3">
                          <button onClick={() => handleSet(d._id)} className="btn btn-sm btn-primary">Set Today</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DailyChallengeManagePage
