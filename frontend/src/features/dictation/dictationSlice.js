import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

export const fetchDictations = createAsyncThunk('dictation/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dictations', { params })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load dictations')
  }
})

export const fetchDictation = createAsyncThunk('dictation/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/dictations/${id}`)
    return data.data.dictation
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Dictation not found')
  }
})

export const fetchDailyChallenge = createAsyncThunk('dictation/daily', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dictations/daily-challenge')
    return data.data.dictation
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load daily challenge')
  }
})

export const setDailyChallenge = createAsyncThunk('dictation/setDaily', async (dictationId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/dictations/daily-challenge', { dictationId })
    toast.success('Daily challenge set for today')
    return data.data.daily
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set daily challenge')
  }
})

export const createDictation = createAsyncThunk('dictation/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/dictations', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Dictation uploaded successfully!')
    return data.data.dictation
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Upload failed')
  }
})

export const updateDictation = createAsyncThunk('dictation/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/dictations/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Dictation updated successfully!')
    return data.data.dictation
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed')
  }
})

export const deleteDictation = createAsyncThunk('dictation/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/dictations/${id}`)
    toast.success('Dictation deleted')
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

const dictationSlice = createSlice({
  name: 'dictation',
  initialState: {
    dictations: [],
    selectedDictation: null,
    dailyChallenge: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => { state.selectedDictation = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDictations.pending, (state) => { state.loading = true })
      .addCase(fetchDictations.fulfilled, (state, action) => {
        state.loading = false
        state.dictations = action.payload.dictations
        state.pagination = action.payload.pagination
      })
      .addCase(fetchDictations.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error(action.payload)
      })
      .addCase(fetchDictation.pending, (state) => { state.loading = true })
      .addCase(fetchDictation.fulfilled, (state, action) => {
        state.loading = false; state.selectedDictation = action.payload
      })
      .addCase(fetchDictation.rejected, (state, action) => {
        state.loading = false; toast.error(action.payload)
      })
      .addCase(fetchDailyChallenge.fulfilled, (state, action) => {
        state.dailyChallenge = action.payload
      })
      .addCase(setDailyChallenge.fulfilled, (state, action) => {
        state.dailyChallenge = action.payload.dictation || action.payload
      })
      .addCase(createDictation.fulfilled, (state, action) => {
        state.dictations.unshift(action.payload)
      })
      .addCase(createDictation.rejected, (state, action) => {
        toast.error(action.payload)
      })
      .addCase(updateDictation.fulfilled, (state, action) => {
        const idx = state.dictations.findIndex((d) => d._id === action.payload._id)
        if (idx !== -1) state.dictations[idx] = action.payload
      })
      .addCase(updateDictation.rejected, (state, action) => {
        toast.error(action.payload)
      })
      .addCase(deleteDictation.fulfilled, (state, action) => {
        state.dictations = state.dictations.filter((d) => d._id !== action.payload)
      })
  },
})

export const { clearSelected } = dictationSlice.actions
export default dictationSlice.reducer
