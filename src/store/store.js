import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'
import institutionReducer from './slices/institutionSlice'
import invitationReducer from './slices/invitationSlice'
import userReducer from './slices/userSlice' 
import levelReducer from './slices/levelSlice'
import subjectReducer from './slices/subjectSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    institutions: institutionReducer,
    invitation : invitationReducer,
    users: userReducer,
    levels: levelReducer,
    subjects: subjectReducer,
  },
})

export default store