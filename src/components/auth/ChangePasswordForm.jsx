import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material'
import { changePassword, clearError } from '../../store/slices/authSlice'

const ChangePasswordForm = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch(clearError())
      dispatch({
        type: 'auth/setError',
        payload: 'Les mots de passe ne correspondent pas',
      })
      return
    }

    dispatch(changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    })).then((result) => {
      if (!result.error) {
        setSuccess('Mot de passe mis à jour avec succès')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    })
  }

  const handleCloseError = () => {
    dispatch(clearError())
  }

  const handleCloseSuccess = () => {
    setSuccess('')
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Changer le mot de passe
      </Typography>

      {error && (
        <Alert severity="error" onClose={handleCloseError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={handleCloseSuccess} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="currentPassword"
          label="Mot de passe actuel"
          type={showPassword.current ? 'text' : 'password'}
          value={formData.currentPassword}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('current')}
                  edge="end"
                >
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="Nouveau mot de passe"
          type={showPassword.new ? 'text' : 'password'}
          value={formData.newPassword}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('new')}
                  edge="end"
                >
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmer le mot de passe"
          type={showPassword.confirm ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('confirm')}
                  edge="end"
                >
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={<LockIcon />}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {loading ? 'Changement...' : 'Changer le mot de passe'}
        </Button>
      </Box>
    </Paper>
  )
}

export default ChangePasswordForm