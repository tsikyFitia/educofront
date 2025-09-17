// pages/InstitutionDetail.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchInstitution, updatePhotoAlbums, updateInstitution , uploadPhotoToAlbum} from '../store/slices/institutionSlice'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material'
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon, 
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Group as GroupIcon
} from '@mui/icons-material'

const InstitutionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: institution, loading, error } = useSelector(state => state.institutions)
  const user = useSelector(state => state.auth.user)
  const [photoAlbums, setPhotoAlbums] = useState([])
  const [newAlbum, setNewAlbum] = useState('')
  const [isEditingAlbums, setIsEditingAlbums] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [institutionData, setInstitutionData] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      dispatch(fetchInstitution(id))
    } else {
      console.warn('ID institution invalide ou manquant:', id)
    }
  }, [dispatch, id])

  useEffect(() => {
    if (institution) {
      setPhotoAlbums(institution.photo_albums || [])
      setInstitutionData({
        name: institution.name || '',
        address: institution.address || '',
        email: institution.email || '',
        phone: institution.phone || '',
        website: institution.website || '',
        description: institution.description || '',
        is_active: institution.is_active || false
      })
    }
  }, [institution])

  const isAdmin = user &&
  user.role === 'admin' &&
  Array.isArray(user.institution_ids) &&
  user.institution_ids.map(String).includes(String(id))

  const isSuperAdmin = user && user.is_super_admin

  const handleAddAlbum = () => {
    if (newAlbum.name.trim()) {
      setPhotoAlbums([...photoAlbums, { name: newAlbum.name.trim(), description: newAlbum.description }])
      setNewAlbum({ name: '', description: '' })
    }
  }

  const handleRemoveAlbum = (index) => {
    setPhotoAlbums(photoAlbums.filter((_, i) => i !== index))
  }

  const handleSaveAlbums = () => {
    const albumsToSend = photoAlbums.map(album => ({
      name: album.name,
      description: album.description || ''
    }));

    dispatch(updatePhotoAlbums({ institutionId: id, photoAlbums: albumsToSend }))
      .unwrap()
      .then((updatedInstitution) => {
        setPhotoAlbums(updatedInstitution.photo_albums || []);
        setIsEditingAlbums(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la sauvegarde des albums:', error);
      });
  };


  const handleCancelAlbums = () => {
    setPhotoAlbums(institution.photo_albums || [])
    setIsEditingAlbums(false)
  }

  const handleSaveInfo = () => {
    if (!institution?._id) return

    const updatePayload = {
      institutionId: institution._id,
      updateData: {
        name: institutionData.name,
        email: institutionData.email,
        address: institutionData.address,
        phone: institutionData.phone,
        website: institutionData.website,
        description: institutionData.description,
        is_active: institutionData.is_active,
      }
    }

    dispatch(updateInstitution(updatePayload))
      .unwrap()
      .then(() => {
        setIsEditingInfo(false)
      })
      .catch((err) => {
        console.error('Erreur lors de la mise à jour:', err)
      })
  }

  const handleCancelInfo = () => {
    setInstitutionData({
      name: institution.name || '',
      address: institution.address || '',
      email: institution.email || '',
      phone: institution.phone || '',
      website: institution.website || '',
      description: institution.description || '',
      is_active: institution.is_active || false
    })
    setIsEditingInfo(false)
  }

  const handleDeleteInstitution = () => {
    // Ici vous devrez implémenter la suppression de l'institution
    console.log('Supprimer l institution:', id)
    setDeleteDialogOpen(false)
    navigate('/institutions')
  }

  const handleStatusChange = (event) => {
    setInstitutionData({
      ...institutionData,
      is_active: event.target.checked
    })
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedAlbum || !selectedAlbum._id) {
      console.error("Fichier ou album invalide")
      return
    }

    setUploadLoading(true)

    try {
      await dispatch(uploadPhotoToAlbum({
        institutionId: id,
        albumId: selectedAlbum._id,
        file: selectedFile,
        description: uploadDescription
      })).unwrap()

      // Recharger les données de l'institution
      dispatch(fetchInstitution(id))

      // Réinitialiser le formulaire
      setUploadDialogOpen(false)
      setSelectedFile(null)
      setUploadDescription('')
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDeletePhoto = async (albumId, photoId) => {
    try {
      const response = await fetch(`/api/institutions/${id}/photo-albums/${albumId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        // Recharger les données de l'institution
        dispatch(fetchInstitution(id))
      } else {
        console.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!institution) return <Alert severity="info">Institution non trouvée</Alert>

  return (
    <Container maxWidth="lg">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/institutions')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {institution.name}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Informations générales
          </Typography>
          
          {(isAdmin || isSuperAdmin) && !isEditingInfo && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditingInfo(true)}
            >
              Modifier
            </Button>
          )}
        </Box>

        {isEditingInfo ? (
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={institutionData.name}
                  onChange={(e) => setInstitutionData({...institutionData, name: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={institutionData.email}
                  onChange={(e) => setInstitutionData({...institutionData, email: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={institutionData.address}
                  onChange={(e) => setInstitutionData({...institutionData, address: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={institutionData.phone}
                  onChange={(e) => setInstitutionData({...institutionData, phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Site web"
                  value={institutionData.website}
                  onChange={(e) => setInstitutionData({...institutionData, website: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={institutionData.description}
                  onChange={(e) => setInstitutionData({...institutionData, description: e.target.value})}
                />
              </Grid>
              {isSuperAdmin && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={institutionData.is_active}
                        onChange={handleStatusChange}
                        color="primary"
                      />
                    }
                    label="Institution active"
                  />
                </Grid>
              )}
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={handleCancelInfo}
                sx={{ mr: 1 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveInfo}
              >
                Sauvegarder
              </Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography><strong>Adresse:</strong> {institution.address}</Typography>
            <Typography><strong>Email:</strong> {institution.email}</Typography>
            <Typography><strong>Téléphone:</strong> {institution.phone}</Typography>
            <Typography><strong>Site web:</strong> {institution.website || 'Non spécifié'}</Typography>
            <Typography><strong>Description:</strong> {institution.description || 'Non spécifiée'}</Typography>
            {isSuperAdmin && (
              <Typography>
                <strong>Statut:</strong> {institution.is_active ? 'Active' : 'Inactive'}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {isAdmin && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gestion des utilisateurs
            </Typography>
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              onClick={() => navigate(`/institutions/${id}/users`)}
            >
              Gérer les utilisateurs
            </Button>
          </Paper>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Albums photos
            </Typography>
            
            {institution.photo_albums && institution.photo_albums.length > 0 ? (
              institution.photo_albums.map((album) => (
                <Box key={album._id || album.name} sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">{album.name}</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => {
                        setSelectedAlbum(album)
                        setUploadDialogOpen(true)
                      }}
                    >
                      Ajouter des photos
                    </Button>
                  </Box>
                  
                  {album.photos && album.photos.length > 0 ? (
                    <Grid container spacing={2}>
                      {album.photos.map((photo) => (
                        <Grid item xs={12} sm={6} md={4} key={photo._id || photo.url}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="200"
                              image={photo.url}
                              alt={photo.description || photo.original_name}
                              sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                              <Typography variant="body2" color="textSecondary">
                                {photo.description || photo.original_name}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeletePhoto(album._id, photo._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="textSecondary" sx={{ py: 2 }}>
                      Aucune photo dans cet album
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                Aucun album photo créé
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Gestion des albums
              </Typography>
              {!isEditingAlbums ? (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingAlbums(true)}
                >
                  Modifier
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    onClick={handleCancelAlbums}
                    sx={{ mr: 1 }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAlbums}
                  >
                    Enregistrer
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {isEditingAlbums ? (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    value={newAlbum.name ?? ''}
                    onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                    placeholder="Nom de l'album"
                    size="small"
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <TextField
                    value={newAlbum.description ?? ''}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    placeholder="Description"
                    size="small"
                    sx={{ mr: 1, flexGrow: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddAlbum}
                  >
                    Ajouter
                  </Button>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1}>
                  {photoAlbums.map((album, index) => (
                    <Chip
                      key={index}
                      label={album.name}
                      onDelete={() => handleRemoveAlbum(index)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>

            ) : (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {photoAlbums.length > 0 ? (
                  photoAlbums.map((album, index) => (
                    <Chip key={index} label={album.name} variant="outlined" />
                  ))
                ) : (
                  <Typography color="textSecondary">
                    Aucun album photo défini
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </>
      )}

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter des photos à {selectedAlbum?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: '16px', width: '100%' }}
            />
            <TextField
              fullWidth
              label="Description (optionnelle)"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploadLoading}
            variant="contained"
          >
            {uploadLoading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {isSuperAdmin && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            Zone d'administration
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Supprimer l'institution
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'institution "{institution.name}" ? 
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteInstitution} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default InstitutionDetail