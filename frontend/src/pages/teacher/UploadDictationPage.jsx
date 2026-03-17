import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { Upload, Music, FileText, CheckCircle } from 'lucide-react'
import { createDictation } from '../../features/dictation/dictationSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import toast from 'react-hot-toast'

const tabs = ['Audio Upload', 'PDF Notes']

const UploadDictationPage = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.dictation)
  const [activeTab, setActiveTab] = useState(0)
  const [audioFile, setAudioFile] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', transcript: '', difficulty: 'medium', language: 'english', duration: 5,
  })

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) setAudioFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')

    const formData = new FormData()
    // send duration in seconds to backend
    const formCopy = { ...form, durationSeconds: form.duration ? String(parseInt(form.duration) * 60) : '' }
    Object.entries(formCopy).forEach(([k, v]) => formData.append(k, v))
    if (audioFile) formData.append('audio', audioFile)

    const res = await dispatch(createDictation(formData))
    if (createDictation.fulfilled.match(res)) {
      setForm({ title: '', description: '', transcript: '', difficulty: 'medium', language: 'english', duration: 5 })
      setAudioFile(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Dictation</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                className="input-field" placeholder="e.g. SSC Stenographer Mock Test 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} className="input-field resize-none" placeholder="Brief description..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transcript (optional)</label>
              <textarea name="transcript" value={form.transcript} onChange={handleChange}
                rows={4} className="input-field resize-none font-mono text-sm"
                placeholder="Paste the original dictation text here for accuracy scoring..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input-field w-40">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select name="language" value={form.language} onChange={handleChange} className="input-field w-40">
                <option value="english">English</option>
                <option value="marathi">Marathi (मराठी)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
              <input
                name="duration"
                type="number"
                min={1}
                value={form.duration}
                onChange={handleChange}
                className="input-field w-40"
              />
            </div>
          </div>

          {/* Content tabs */}
          <div className="card">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5 -mx-6 px-6">
              {tabs.map((tab, i) => (
                <button key={tab} type="button" onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === i
                      ? 'border-primary-600 text-primary-700 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {i === 0 ? <Music size={14} /> : <FileText size={14} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Audio upload */}
            {activeTab === 0 && (
              <div>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}>
                  <input {...getInputProps()} />
                  {audioFile ? (
                    <div className="flex items-center justify-center gap-3 text-emerald-600">
                      <CheckCircle size={32} />
                      <div className="text-left">
                        <p className="font-semibold">{audioFile.name}</p>
                        <p className="text-sm text-gray-500">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {isDragActive ? 'Drop the audio file here' : 'Drag & drop audio file, or click to browse'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">MP3, WAV, OGG, M4A — max 50 MB</p>
                    </>
                  )}
                </div>
                {audioFile && (
                  <button type="button" onClick={() => setAudioFile(null)}
                    className="text-sm text-red-500 hover:underline mt-2">Remove file</button>
                )}
              </div>
            )}

            {/* PDF - coming soon placeholder */}
            {activeTab === 1 && (
              <div className="text-center py-8 text-gray-400">
                <FileText size={36} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">PDF upload available in the next version</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><Upload size={18} />Upload Dictation</>}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default UploadDictationPage
