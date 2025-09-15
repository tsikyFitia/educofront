import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// 🔄 Thunks

export const fetchInstitutions = createAsyncThunk(
  'institutions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/super-admin/institutions')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchInstitution = createAsyncThunk(
  'institutions/fetchOne',
  async (institutionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/institutions/${institutionId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createInstitution = createAsyncThunk(
  'institutions/create',
  async (institutionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/super-admin/institutions', institutionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateInstitution = createAsyncThunk(
  'institutions/update',
  async ({ institutionId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/super-admin/${institutionId}`, updateData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de la mise à jour' })
    }
  }
)

export const updatePhotoAlbums = createAsyncThunk(
  'institutions/updatePhotoAlbums',
  async ({ institutionId, photoAlbums }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/institutions/${institutionId}/photo-albums`, photoAlbums)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const uploadPhotoToAlbum = createAsyncThunk(
  'institutions/uploadPhotoToAlbum',
  async ({ institutionId, albumId, file, description }, { dispatch, rejectWithValue }) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', description)

    try {
      const response = await api.post(
        `/institutions/${institutionId}/photo-albums/${albumId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      // Recharger l'institution après upload
      dispatch(fetchInstitution(institutionId))
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de l’upload' })
    }
  }
)

// 🧠 Slice

const institutionSlice = createSlice({
  name: 'institutions',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentInstitution: (state, action) => {
      state.current = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInstitutions.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchInstitutions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail
      })

      .addCase(fetchInstitution.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInstitution.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchInstitution.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail
      })

      .addCase(createInstitution.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })

      .addCase(updateInstitution.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInstitution.fulfilled, (state, action) => {
        const updated = action.payload
        state.loading = false
        state.error = null

        if (state.current && state.current._id === updated._id) {
          state.current = updated
        }

        const index = state.list.findIndex(inst => inst._id === updated._id)
        if (index !== -1) {
          state.list[index] = updated
        }
      })
      .addCase(updateInstitution.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.detail || 'Échec de la mise à jour'
      })

      .addCase(updatePhotoAlbums.fulfilled, (state, action) => {
        if (state.current && state.current._id === action.payload._id) {
          state.current = action.payload
        }
        const index = state.list.findIndex(inst => inst._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })

      .addCase(uploadPhotoToAlbum.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadPhotoToAlbum.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(uploadPhotoToAlbum.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.detail || 'Échec de l’upload'
      })
  },
})

export const { clearError, setCurrentInstitution } = institutionSlice.actions
export default institutionSlice.reducer
