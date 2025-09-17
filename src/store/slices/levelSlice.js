import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// 🔄 Récupérer tous les niveaux d'une institution
export const fetchLevels = createAsyncThunk(
  'levels/fetchLevels',
  async (institutionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/levels/institution/${institutionId}`)
      return res.data.map((lvl) => ({
        ...lvl,
        id: lvl.id || lvl._id, // compatibilité Mongo
      }))
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur de chargement des niveaux')
    }
  }
)

// ➕ Créer un niveau
export const createLevel = createAsyncThunk(
  'levels/createLevel',
  async ({ name, cycle, average_age, description, institution_id, subjects = [] }, { rejectWithValue }) => {
    try {
      const res = await api.post('/levels', {
        name,
        cycle,
        average_age,
        description,
        institution_id,
        subjects,
      })
      return {
        ...res.data,
        id: res.data.id || res.data._id,
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de la création du niveau')
    }
  }
)

// ✏️ Modifier un niveau
export const updateLevel = createAsyncThunk(
  'levels/updateLevel',
  async ({ levelId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/levels/${levelId}`, data)
      return {
        ...res.data,
        id: res.data.id || res.data._id,
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de la modification du niveau')
    }
  }
)

// ❌ Supprimer un niveau
export const deleteLevel = createAsyncThunk(
  'levels/deleteLevel',
  async (levelId, { rejectWithValue }) => {
    try {
      await api.delete(`/levels/${levelId}`)
      return levelId
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de la suppression du niveau')
    }
  }
)

const levelSlice = createSlice({
  name: 'levels',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📦 FETCH
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ➕ CREATE
      .addCase(createLevel.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createLevel.rejected, (state, action) => {
        state.error = action.payload
      })
      
      .addCase(updateLevel.fulfilled, (state, action) => {
        const index = state.items.findIndex((lvl) => lvl.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateLevel.rejected, (state, action) => {
        state.error = action.payload
      })

      // ❌ DELETE
      .addCase(deleteLevel.fulfilled, (state, action) => {
        state.items = state.items.filter((lvl) => lvl.id !== action.payload && lvl._id !== action.payload)
      })
      .addCase(deleteLevel.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default levelSlice.reducer
