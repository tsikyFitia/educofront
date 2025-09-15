// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light'
  } catch {
    return 'light'
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    theme: getInitialTheme(),
    notifications: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('theme', state.theme)
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du thème:', error)
      }
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
  },
})

export const { setLoading, toggleTheme, addNotification, removeNotification } = uiSlice.actions
export default uiSlice.reducer