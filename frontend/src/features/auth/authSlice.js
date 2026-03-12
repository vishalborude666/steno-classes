import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

// Load persisted user from localStorage
const persistedUser = (() => {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  } catch { return null }
})()

export const registerUser = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', credentials)
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})


export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data.message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Request failed')
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password })
    return data.message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Reset failed')
  }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data.data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const fulfilled = (state, action) => {
      state.loading = false
      state.user = action.payload.user || action.payload
      state.token = action.payload.token || state.token
      state.isAuthenticated = true
    }
    const rejected = (state, action) => {
      state.loading = false
      state.error = action.payload
      toast.error(action.payload)
    }
    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        fulfilled(state, action)
        toast.success('Account created successfully!')
      })
      .addCase(registerUser.rejected, rejected)
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        fulfilled(state, action)
        toast.success('Welcome back!')
      })
      .addCase(loginUser.rejected, rejected)
      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        toast.success('Reset link sent to your email!')
      })
      .addCase(forgotPassword.rejected, rejected)
      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        toast.success('Password reset successful!')
      })
      .addCase(resetPassword.rejected, rejected)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
