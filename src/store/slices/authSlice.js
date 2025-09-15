// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.access_token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      console.log('Réponse utilisateur:', response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const uploadProfilePicture = createAsyncThunk(
  'auth/uploadProfilePicture',
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/profile/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/profile/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Erreur de mise à jour')
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked: false, // ✅ nouveau flag
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authChecked = true
    },
    clearError: (state) => {
      state.error = null
    },
    setAuthChecked: (state) => {
      state.authChecked = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.authChecked = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail || 'Erreur de connexion'
        state.authChecked = true
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.authChecked = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.authChecked = true
        localStorage.removeItem('token')
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload.detail || 'Erreur lors du changement de mot de passe'
      })

      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading = false
        if (state.user) {
          state.user.profile_picture = action.payload.profile_picture
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail || 'Erreur lors du téléchargement de la photo'
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail || 'Erreur lors de la mise à jour du profil'
      })
  },
})

export const { logout, clearError, setAuthChecked } = authSlice.actions
export default authSlice.reducer
