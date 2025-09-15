import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
} from '@mui/material'
import {
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
  CameraAlt as CameraIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} from '../store/slices/authSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    phone: '',
    address: '',
    bio: '',
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)


  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile({ id: user.id, ...formData })).unwrap()
      await dispatch(getCurrentUser())
      setSuccess('Profil mis à jour avec succès')
      setEditMode(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setSuccess('')
      return
    }
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.current_password,
        newPassword: passwordData.new_password,
      })).unwrap()
      setSuccess('Mot de passe mis à jour avec succès')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault()
    if (!profilePicture) return
    try {
      const formData = new FormData()
      formData.append('profile_picture', profilePicture)
      await dispatch(uploadProfilePicture({ userId: user.id, formData })).unwrap()
      await dispatch(getCurrentUser())
      setSuccess('Photo de profil mise à jour avec succès')
      setProfilePicture(null)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
        <LoadingSpinner message="Chargement..." />
    )
  }
  return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="600" color="primary">
              Mon Profil
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gérez vos informations personnelles
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Paper sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={
                    profilePicture
                      ? URL.createObjectURL(profilePicture)
                      : user?.profile_picture
                        ? `${import.meta.env.VITE_API_BASE_URL}${user.profile_picture}`
                        : undefined
                  }
                  alt={`${user?.first_name} ${user?.last_name}`}
                >
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <CameraIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="600">
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.role === 'super_admin' ? 'Super Administrateur' : 
                   user?.role === 'admin' ? 'Administrateur' :
                   user?.role === 'teacher' ? 'Enseignant' :
                   user?.role === 'student' ? 'Étudiant' : 'Tuteur'}
                </Typography>
              </Box>
            </Box>

            {profilePicture && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleProfilePictureSubmit}
                  disabled={loading}
                >
                  {loading ? 'Téléchargement...' : 'Enregistrer la photo'}
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Informations personnelles
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? "outlined" : "contained"}
              >
                {editMode ? 'Annuler' : 'Modifier'}
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="first_name"
                    label="Prénom"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="last_name"
                    label="Nom"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="birth_date"
                    label="Date de naissance"
                    name="birth_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.birth_date}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Adresse"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="bio"
                    label="Biographie"
                    name="bio"
                    multiline
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              {editMode && (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Changer le mot de passe
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="current_password"
                    label="Mot de passe actuel"
                    name="current_password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="new_password"
                    label="Nouveau mot de passe"
                    name="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle new password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="confirm_password"
                    label="Confirmer le mot de passe"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Changement...' : 'Changer le mot de passe'}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
  )
}

export default Profile