import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: true,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', String(state.darkMode))
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    initDarkMode: (state) => {
      if (state.darkMode) document.documentElement.classList.add('dark')
    },
  },
})

export const { toggleDarkMode, toggleSidebar, initDarkMode } = uiSlice.actions
export default uiSlice.reducer
