import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

export const generateAIDictation = createAsyncThunk('aiDictation/generate', async ({ topic, wpm, duration }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/ai-dictation/generate', { topic, wpm, duration })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to generate dictation')
  }
})

export const submitAIPractice = createAsyncThunk('aiDictation/submit', async (practiceData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/ai-dictation/submit', practiceData)
    toast.success('Practice submitted!')
    return data.data.practice
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Submit failed')
  }
})

export const fetchTopics = createAsyncThunk('aiDictation/topics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/ai-dictation/topics')
    return data.data.topics
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load topics')
  }
})

const aiDictationSlice = createSlice({
  name: 'aiDictation',
  initialState: {
    passage: null,
    topic: null,
    wpm: null,
    duration: null,
    topics: [],
    generating: false,
    submitting: false,
    lastResult: null,
    error: null,
  },
  reducers: {
    resetAIDictation: (state) => {
      state.passage = null
      state.topic = null
      state.lastResult = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIDictation.pending, (state) => { state.generating = true; state.error = null; state.passage = null; state.lastResult = null })
      .addCase(generateAIDictation.fulfilled, (state, action) => {
        state.generating = false
        state.passage = action.payload.passage
        state.topic = action.payload.topic
        state.wpm = action.payload.wpm
        state.duration = action.payload.duration
      })
      .addCase(generateAIDictation.rejected, (state, action) => {
        state.generating = false
        state.error = action.payload
        toast.error(action.payload)
      })
      .addCase(submitAIPractice.pending, (state) => { state.submitting = true })
      .addCase(submitAIPractice.fulfilled, (state, action) => {
        state.submitting = false
        state.lastResult = action.payload
      })
      .addCase(submitAIPractice.rejected, (state, action) => {
        state.submitting = false
        toast.error(action.payload)
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload
      })
  },
})

export const { resetAIDictation } = aiDictationSlice.actions
export default aiDictationSlice.reducer
