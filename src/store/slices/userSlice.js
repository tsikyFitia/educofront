import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// 🔄 Récupérer tous les utilisateurs
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors du chargement des utilisateurs' })
    }
  }
)

// 🔄 Récupérer uniquement les admins
export const fetchAdmins = createAsyncThunk(
  'users/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users?role=ADMIN')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors du chargement des admins' })
    }
  }
)

// 🔄 Créer un utilisateur
export const createUser = createAsyncThunk(
  'users/create',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de la création' })
    }
  }
)

// 🔄 Récupérer un utilisateur par ID
export const fetchUser = createAsyncThunk(
  'users/fetchOne',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Utilisateur introuvable' })
    }
  }
)

// 🔄 Mettre à jour un utilisateur
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}`, updateData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de la mise à jour' })
    }
  }
)

// 🔄 Supprimer un utilisateur
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`)
      return userId
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de la suppression' })
    }
  }
)

// 🔄 Lier un admin à une institution
export const linkAdminToInstitution = createAsyncThunk(
  'users/linkAdmin',
  async ({ institutionId, adminId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/institutions/${institutionId}/link-admin`, { adminId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors de la liaison' })
    }
  }
)

// 🔄 Retirer un admin d’une institution
export const unlinkAdminFromInstitution = createAsyncThunk(
  'users/unlinkAdmin',
  async ({ institutionId, adminId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/institutions/${institutionId}/unlink-admin`, { adminId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: 'Erreur lors du retrait' })
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
    setCurrentUser: (state, action) => {
      state.current = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail
      })

      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.current = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.list.findIndex(u => u._id === updated._id)
        if (index !== -1) {
          state.list[index] = updated
        }
        if (state.current?._id === updated._id) {
          state.current = updated
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u._id !== action.payload)
        if (state.current?._id === action.payload) {
          state.current = null
        }
      })

      .addCase(linkAdminToInstitution.fulfilled, (state, action) => {
        // Optionnel : mettre à jour institution ou admin localement
      })
      .addCase(unlinkAdminFromInstitution.fulfilled, (state, action) => {
        // Optionnel : mettre à jour institution ou admin localement
      })
  },
})

export const { clearUserError, setCurrentUser } = userSlice.actions
export default userSlice.reducer
