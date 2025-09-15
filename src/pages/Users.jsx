// src/pages/Users.jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Fab,
  MenuItem,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import api from '../services/api'
import { setLoading, addNotification } from '../store/slices/uiSlice'

const Users = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.ui)
  const [users, setUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    role: 'student',
    phone: '',
    address: '',
    bio: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true))
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs')
      console.error('Error fetching users:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user)
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birth_date: user.birth_date || '',
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        password: '',
      })
    } else {
      setSelectedUser(null)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        birth_date: '',
        role: 'student',
        phone: '',
        address: '',
        bio: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      birth_date: '',
      role: 'student',
      phone: '',
      address: '',
      bio: '',
    })
    setError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formData)
        dispatch(addNotification({ message: 'Utilisateur mis à jour avec succès', type: 'success' }))
      } else {
        await api.post('/users', formData)
        dispatch(addNotification({ message: 'Utilisateur créé avec succès', type: 'success' }))
      }
      handleCloseDialog()
      fetchUsers()
    } catch (error) {
      setError(error.response?.data?.detail || 'Une erreur est survenue')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        dispatch(setLoading(true))
        await api.delete(`/users/${id}`)
        dispatch(addNotification({ message: 'Utilisateur supprimé avec succès', type: 'success' }))
        fetchUsers()
      } catch (error) {
        setError('Erreur lors de la suppression')
        console.error('Error deleting user:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }
  }

  if (loading) {
    return (
        <LoadingSpinner message="Chargement..." />
    )
  }

  return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="600" color="primary">
              Gestion des Utilisateurs
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gérez les utilisateurs de la plateforme EduAI
            </Typography>
          </Box>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Nouvel Utilisateur
          </Fab>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" fontWeight="600">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.role}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="textSecondary">
                        {user.phone}
                      </Typography>
                    )}
                    {user.bio && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {user.bio}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedUser ? 'Modifier un utilisateur' : 'Créer un nouvel utilisateur'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                  />
                </Grid>
                {!selectedUser && (
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Mot de passe"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                )}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="role"
                    select
                    label="Rôle"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value="student">Étudiant</MenuItem>
                    <MenuItem value="teacher">Enseignant</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                    <MenuItem value="guardian">Parent/Tuteur</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
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
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedUser ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  )
}

export default Users