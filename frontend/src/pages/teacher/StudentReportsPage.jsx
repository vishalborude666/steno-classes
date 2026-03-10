import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Users, Download, ArrowLeft } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import HistoryTable from '../../components/dashboard/HistoryTable'
import { getAccuracyColor, getWPMColor } from '../../utils/formatters'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

const StudentReportsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [studentHistory, setStudentHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    api.get('/teacher/students')
      .then((r) => setStudents(r.data.data.students))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }, [])

  const viewHistory = async (student) => {
    setSelected(student)
    setHistoryLoading(true)
    try {
      const r = await api.get(`/practice/student/${student._id}`)
      setStudentHistory(r.data.data.history)
    } catch {
      toast.error('Failed to load student history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/teacher/export/excel', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'student_report.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Export failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Reports</h1>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} />
            Export Excel
          </button>
        </div>

        {!selected ? (
          <div className="card">
            {loading ? (
              <div className="flex justify-center py-10"><Loader /></div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No students have practiced your dictations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      {['Student', 'Email', 'Avg WPM', 'Avg Accuracy', 'Sessions', ''].map((h) => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {students.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">{s.name}</td>
                        <td className="py-3 px-3 text-gray-500">{s.email}</td>
                        <td className={`py-3 px-3 font-bold ${getWPMColor(s.avgWpm)}`}>{s.avgWpm}</td>
                        <td className={`py-3 px-3 font-bold ${getAccuracyColor(s.avgAccuracy)}`}>{s.avgAccuracy}%</td>
                        <td className="py-3 px-3 text-gray-500">{s.totalSessions}</td>
                        <td className="py-3 px-3">
                          <button onClick={() => viewHistory(s)} className="text-sm text-primary-600 hover:underline">
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 text-sm">
              <ArrowLeft size={16} /> Back to all students
            </button>
            <div className="card">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                {selected.name}'s Practice History
              </h2>
              {historyLoading ? <div className="flex justify-center py-10"><Loader /></div> : <HistoryTable history={studentHistory} />}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentReportsPage
