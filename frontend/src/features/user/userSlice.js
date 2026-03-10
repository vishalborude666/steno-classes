import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

export const fetchUsers = createAsyncThunk('user/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/users', { params })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load users')
  }
})

export const updateUserRole = createAsyncThunk('user/updateRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/users/${id}/role`, { role })
    toast.success('Role updated')
    return data.data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update role')
  }
})

export const toggleUserActive = createAsyncThunk('user/toggle', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/users/${id}/toggle`)
    toast.success('User status updated')
    return data.data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle user')
  }
})

export const deleteUser = createAsyncThunk('user/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${id}`)
    toast.success('User deleted')
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
  }
})

export const fetchAnalytics = createAsyncThunk('user/analytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/analytics')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load analytics')
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    pagination: null,
    analytics: null,
    dailyActivity: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state) => { state.loading = false })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload)
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics
        state.dailyActivity = action.payload.dailyActivity
      })
  },
})

export default userSlice.reducer
