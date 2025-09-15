import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchManagedInstitutions = createAsyncThunk(
  'superAdmin/fetchManagedInstitutions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/super-admin/institutions')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createInstitution = createAsyncThunk(
  'superAdmin/createInstitution',
  async (institutionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/super-admin/institutions', institutionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const inviteAdmin = createAsyncThunk(
  'superAdmin/inviteAdmin',
  async (invitationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/super-admin/invite-admin', invitationData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const invitationSlice = createSlice({
  name: 'superAdmin',
  initialState: {
    institutions: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagedInstitutions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchManagedInstitutions.fulfilled, (state, action) => {
        state.loading = false
        state.institutions = action.payload
      })
      .addCase(fetchManagedInstitutions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.detail
      })
      .addCase(createInstitution.fulfilled, (state, action) => {
        state.institutions.push(action.payload)
        state.success = true
      })
      .addCase(createInstitution.rejected, (state, action) => {
        state.error = action.payload.detail
      })
      .addCase(inviteAdmin.fulfilled, (state) => {
        state.success = true
      })
      .addCase(inviteAdmin.rejected, (state, action) => {
        state.error = action.payload.detail
      })
  },
})

export const { clearError, clearSuccess } = invitationSlice.actions
export default invitationSlice.reducer