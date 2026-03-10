import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

export const fetchLearningVideos = createAsyncThunk('learningVideo/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/learning-videos', { params })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load videos')
  }
})

export const createLearningVideo = createAsyncThunk('learningVideo/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/learning-videos', payload)
    toast.success('Video added successfully!')
    return data.data.video
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add video')
  }
})

export const updateLearningVideo = createAsyncThunk('learningVideo/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/learning-videos/${id}`, payload)
    toast.success('Video updated!')
    return data.data.video
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed')
  }
})

export const deleteLearningVideo = createAsyncThunk('learningVideo/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/learning-videos/${id}`)
    toast.success('Video deleted')
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

const learningVideoSlice = createSlice({
  name: 'learningVideo',
  initialState: {
    videos: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearningVideos.pending, (state) => { state.loading = true })
      .addCase(fetchLearningVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload.videos
        state.pagination = action.payload.pagination
      })
      .addCase(fetchLearningVideos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      .addCase(createLearningVideo.fulfilled, (state, action) => {
        state.videos.unshift(action.payload)
      })
      .addCase(createLearningVideo.rejected, (_, action) => {
        toast.error(action.payload)
      })
      .addCase(updateLearningVideo.fulfilled, (state, action) => {
        const idx = state.videos.findIndex((v) => v._id === action.payload._id)
        if (idx !== -1) state.videos[idx] = action.payload
      })
      .addCase(updateLearningVideo.rejected, (_, action) => {
        toast.error(action.payload)
      })
      .addCase(deleteLearningVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload)
      })
  },
})

export default learningVideoSlice.reducer
