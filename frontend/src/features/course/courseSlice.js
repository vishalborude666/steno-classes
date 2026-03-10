import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosInstance'
import toast from 'react-hot-toast'

// Courses
export const fetchCourses = createAsyncThunk('course/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/courses')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load courses')
  }
})

export const fetchCourse = createAsyncThunk('course/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/courses/${id}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load course')
  }
})

export const createCourse = createAsyncThunk('course/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Course created!')
    return data.data.course
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create course')
  }
})

export const updateCourse = createAsyncThunk('course/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Course updated!')
    return data.data.course
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed')
  }
})

export const deleteCourse = createAsyncThunk('course/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${id}`)
    toast.success('Course deleted')
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

// Lessons
export const addLesson = createAsyncThunk('course/addLesson', async ({ courseId, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/lessons`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Lesson added!')
    return data.data.lesson
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add lesson')
  }
})

export const updateLesson = createAsyncThunk('course/updateLesson', async ({ courseId, lessonId, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/courses/${courseId}/lessons/${lessonId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Lesson updated!')
    return data.data.lesson
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed')
  }
})

export const deleteLesson = createAsyncThunk('course/deleteLesson', async ({ courseId, lessonId }, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${courseId}/lessons/${lessonId}`)
    toast.success('Lesson deleted')
    return { courseId, lessonId }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

// Payment
export const createOrder = createAsyncThunk('course/createOrder', async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/courses/payment/create-order', { courseId })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create order')
  }
})

export const verifyPayment = createAsyncThunk('course/verifyPayment', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/courses/payment/verify', payload)
    toast.success('Payment successful! You are now enrolled.')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment verification failed')
  }
})

export const fetchMyEnrollments = createAsyncThunk('course/myEnrollments', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/courses/my-enrollments')
    return data.data.enrollments
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load enrollments')
  }
})

// Analytics
export const fetchCourseAnalytics = createAsyncThunk('course/analytics', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/courses/${id}/analytics`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load analytics')
  }
})

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    currentCourse: null,
    enrollments: [],
    analytics: null,
    orderData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null
    },
    clearOrderData: (state) => {
      state.orderData = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload.courses
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      // Fetch single course
      .addCase(fetchCourse.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      // Create course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload)
      })
      .addCase(createCourse.rejected, (_, action) => { toast.error(action.payload) })
      // Update course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const idx = state.courses.findIndex((c) => c._id === action.payload._id)
        if (idx !== -1) state.courses[idx] = action.payload
        if (state.currentCourse?.course?._id === action.payload._id) {
          state.currentCourse.course = action.payload
        }
      })
      .addCase(updateCourse.rejected, (_, action) => { toast.error(action.payload) })
      // Delete course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload)
      })
      .addCase(deleteCourse.rejected, (_, action) => { toast.error(action.payload) })
      // Add lesson
      .addCase(addLesson.fulfilled, (state, action) => {
        if (state.currentCourse?.lessons) {
          state.currentCourse.lessons.push(action.payload)
        }
      })
      .addCase(addLesson.rejected, (_, action) => { toast.error(action.payload) })
      // Update lesson
      .addCase(updateLesson.fulfilled, (state, action) => {
        if (state.currentCourse?.lessons) {
          const idx = state.currentCourse.lessons.findIndex((l) => l._id === action.payload._id)
          if (idx !== -1) state.currentCourse.lessons[idx] = action.payload
        }
      })
      .addCase(updateLesson.rejected, (_, action) => { toast.error(action.payload) })
      // Delete lesson
      .addCase(deleteLesson.fulfilled, (state, action) => {
        if (state.currentCourse?.lessons) {
          state.currentCourse.lessons = state.currentCourse.lessons.filter((l) => l._id !== action.payload.lessonId)
        }
      })
      .addCase(deleteLesson.rejected, (_, action) => { toast.error(action.payload) })
      // Create order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderData = action.payload
      })
      .addCase(createOrder.rejected, (_, action) => { toast.error(action.payload) })
      // Verify payment
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.orderData = null
        if (state.currentCourse?.course) {
          state.currentCourse.course.isEnrolled = true
        }
      })
      .addCase(verifyPayment.rejected, (_, action) => { toast.error(action.payload) })
      // Enrollments
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload
      })
      // Analytics
      .addCase(fetchCourseAnalytics.pending, (state) => { state.loading = true })
      .addCase(fetchCourseAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
      })
      .addCase(fetchCourseAnalytics.rejected, (state, action) => {
        state.loading = false
        toast.error(action.payload)
      })
  },
})

export const { clearCurrentCourse, clearOrderData } = courseSlice.actions
export default courseSlice.reducer
