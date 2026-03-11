import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dictationReducer from '../features/dictation/dictationSlice'
import practiceReducer from '../features/practice/practiceSlice'
import userReducer from '../features/user/userSlice'
import uiReducer from '../features/ui/uiSlice'
import learningVideoReducer from '../features/learningVideo/learningVideoSlice'
import courseReducer from '../features/course/courseSlice'
import aiDictationReducer from '../features/aiDictation/aiDictationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dictation: dictationReducer,
    practice: practiceReducer,
    user: userReducer,
    ui: uiReducer,
    learningVideo: learningVideoReducer,
    course: courseReducer,
    aiDictation: aiDictationReducer,
  },
})
