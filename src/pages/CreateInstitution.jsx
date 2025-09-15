import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createInstitution } from '../store/slices/invitationSlice'
import { fetchAdmins } from '../store/slices/userSlice'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Select,
  Grid,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'

const CreateInstitution = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const { loading, error } = useSelector(state => state.invitation)
  const { list: adminOptions } = useSelector(state => state.users)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    admin_id: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
    admin_address: '',
    admin_bio: ''
  })

  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [mode, setMode] = useState('select') // 'select' | 'create'

  useEffect(() => {
    dispatch(fetchAdmins())
  }, [dispatch])

  // Préremplissage en mode "select"
  useEffect(() => {
    if (mode === 'select' && formData.admin_email) {
      const match = adminOptions.find(a => a.email === formData.admin_email)
      if (match) {
        setFormData(prev => ({ ...prev, admin_id: match.id }))
        setSelectedAdmin({ id: match.id, email: match.email })
      }
    }
  }, [formData.admin_email, adminOptions, mode])

  // Préremplissage en mode "create" si email existant
  useEffect(() => {
    if (mode === 'create' && formData.admin_email) {
      const match = adminOptions.find(a => a.email === formData.admin_email)
      if (match) {
        setFormData(prev => ({
          ...prev,
          admin_first_name: match.first_name || '',
          admin_last_name: match.last_name || '',
          admin_address: match.address || '',
          admin_bio: match.bio || '',
          admin_id: match.id || ''
        }))
        setSelectedAdmin({ id: match.id, email: match.email })
      }
    }
  }, [formData.admin_email, adminOptions, mode])

  if (!user?.is_super_admin) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Vous n'avez pas les droits pour créer une institution.
        </Alert>
      </Container>
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdminSelect = (e) => {
    const value = e.target.value
    if (value === 'custom') {
      setMode('create')
      setSelectedAdmin(null)
      setFormData(prev => ({ ...prev, admin_id: '', admin_email: '' }))
      return
    }
    const found = adminOptions.find(a => a.id === value)
    setMode('select')
    setSelectedAdmin(found ? { id: found.id, email: found.email } : null)
    setFormData(prev => ({
      ...prev,
      admin_id: found?.id || '',
      admin_email: found?.email || ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      address: formData.address,
    }

    if (formData.admin_id) {
      payload.admin_id = formData.admin_id
    } else {
      payload.admin_email = formData.admin_email
      payload.admin_first_name = formData.admin_first_name
      payload.admin_last_name = formData.admin_last_name
      payload.admin_password = formData.admin_password
      payload.admin_address = formData.admin_address
      payload.admin_bio = formData.admin_bio
    }

    dispatch(createInstitution(payload))
      .unwrap()
      .then(() => navigate('/institutions'))
  }

  return (
    <Container maxWidth="md" sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Créer une institution
      </Typography>

      <Paper sx={{ p: 3, width: '100%' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Informations de l'institution
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nom de l'institution *" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Adresse" name="address" value={formData.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Site web" name="website" value={formData.website} onChange={handleChange} />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Administrateur principal
          </Typography>

          <Grid container spacing={2}>
            {mode === 'select' && (
              <Grid item xs={12} sx={{ width: "97%"}}>
                <FormControl fullWidth>
                  <InputLabel id="admin-select-label">Administrateur</InputLabel>
                  <Select
                    labelId="admin-select-label"
                    value={formData.admin_id || ''}
                    onChange={handleAdminSelect}
                    label="Administrateur"
                    fullWidth
                  >
                    {adminOptions.map(admin => (
                      <MenuItem key={admin.id} value={admin.id}>
                        {admin.first_name} {admin.last_name} ({admin.email})
                      </MenuItem>
                    ))}
                    <MenuItem value="custom">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {mode === 'create' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Prénom *" name="admin_first_name" value={formData.admin_first_name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Nom *" name="admin_last_name" value={formData.admin_last_name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email *" name="admin_email" type="email" value={formData.admin_email} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Mot de passe *" name="admin_password" type="password" value={formData.admin_password} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Adresse" name="admin_address" value={formData.admin_address} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Bio" name="admin_bio" multiline rows={3} value={formData.admin_bio} onChange={handleChange} />
                </Grid>
              </>
            )}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            Créer l'institution
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreateInstitution
