// pages/InviteAdmin.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { inviteAdmin, clearError, clearSuccess } from '../store/slices/invitationSlice'
import { fetchInstitutions } from '../store/slices/institutionSlice'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

const InviteAdmin = () => {
  const dispatch = useDispatch()
  const { list: institutions } = useSelector(state => state.institutions)
  const { loading, error, success } = useSelector(state => state.invitations)
  const [formData, setFormData] = useState({
    email: '',
    institution_id: '',
    role: 'admin'
  })

  useEffect(() => {
    dispatch(fetchInstitutions())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearSuccess())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(inviteAdmin(formData))
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Inviter un administrateur
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Invitation envoyée avec succès
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Institution"
            name="institution_id"
            value={formData.institution_id}
            onChange={handleChange}
            required
            margin="normal"
          >
            {institutions.map((institution) => (
              <MenuItem key={institution._id} value={institution._id}>
                {institution.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            margin="normal"
          >
            <MenuItem value="admin">Administrateur</MenuItem>
            <MenuItem value="super_admin">Super Administrateur</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Envoyer l'invitation
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default InviteAdmin