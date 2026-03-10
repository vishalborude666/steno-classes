import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

export const submitPractice = createAsyncThunk('practice/submit', async (practiceData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/practice/submit', practiceData)
    toast.success('Practice submitted!')
    return data.data.practice
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Submit failed')
  }
})

export const fetchHistory = createAsyncThunk('practice/history', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/practice/history', { params })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load history')
  }
})

export const fetchStats = createAsyncThunk('practice/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/practice/stats')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load stats')
  }
})

export const fetchLeaderboard = createAsyncThunk('practice/leaderboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/practice/leaderboard')
    return data.data.leaderboard
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load leaderboard')
  }
})

const practiceSlice = createSlice({
  name: 'practice',
  initialState: {
    lastResult: null,
    history: [],
    pagination: null,
    stats: null,
    chartData: [],
    leaderboard: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearResult: (state) => { state.lastResult = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPractice.pending, (state) => { state.submitting = true })
      .addCase(submitPractice.fulfilled, (state, action) => {
        state.submitting = false; state.lastResult = action.payload
      })
      .addCase(submitPractice.rejected, (state, action) => {
        state.submitting = false; toast.error(action.payload)
      })
      .addCase(fetchHistory.pending, (state) => { state.loading = true })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload.history
        state.pagination = action.payload.pagination
      })
      .addCase(fetchHistory.rejected, (state) => { state.loading = false })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats
        state.chartData = action.payload.chartData
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload
      })
  },
})

export const { clearResult } = practiceSlice.actions
export default practiceSlice.reducer
