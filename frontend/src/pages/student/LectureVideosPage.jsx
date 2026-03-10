import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Youtube, Play } from 'lucide-react'
import { fetchLearningVideos } from '../../features/learningVideo/learningVideoSlice'
import DashboardLayout from '../../components/common/DashboardLayout'
import Loader from '../../components/common/Loader'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate } from '../../utils/formatters'

const getYouTubeId = (url) => url?.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || ''

const LearningVideosPage = () => {
  const dispatch = useDispatch()
  const { videos, loading, pagination } = useSelector((state) => state.learningVideo)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    dispatch(fetchLearningVideos({ search: debouncedSearch, page }))
  }, [debouncedSearch, page, dispatch])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Videos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Watch lecture videos shared by your teacher to learn stenography</p>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Selected video player */}
        {selectedVideo && (
          <div className="card mb-6 p-0 overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(selectedVideo.youtubeLink)}`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedVideo.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>By {selectedVideo.uploadedBy?.name}</span>
                <span>{formatDate(selectedVideo.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Video grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Youtube size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No learning videos available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => {
              const videoId = getYouTubeId(v.youtubeLink)
              const isSelected = selectedVideo?._id === v._id
              return (
                <button
                  key={v._id}
                  onClick={() => setSelectedVideo(isSelected ? null : v)}
                  className={`card text-left hover:shadow-md transition-all group ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="relative -mx-6 -mt-5 mb-3 overflow-hidden rounded-t-2xl">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
                        <Play size={24} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{v.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-400">{v.uploadedBy?.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(v.createdAt)}</span>
                  </div>
                </button>
              )
            })}
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

export default LearningVideosPage
