// store/slices/subjectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (institutionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/subjects/institution/${institutionId}`)
      return res.data.map((s) => ({ ...s, id: s.id || s._id }))
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur de chargement des matières')
    }
  }
)

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async ({ name, code, description, institution_id }, { rejectWithValue }) => {
    try {
      const res = await api.post('/subjects', {
        name,
        code,
        description,
        institution_id,
      })
      return { ...res.data, id: res.data.id || res.data._id }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de la création du sujet')
    }
  }
)

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (subjectId, { rejectWithValue }) => {
    try {
      await api.delete(`/subjects/${subjectId}`)
      return subjectId
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de la suppression du sujet')
    }
  }
)

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload)
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default subjectSlice.reducer
