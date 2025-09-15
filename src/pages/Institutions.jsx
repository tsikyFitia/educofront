// pages/Institutions.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchInstitutions } from '../store/slices/institutionSlice'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import { LocationOn as LocationIcon } from '@mui/icons-material'

const Institutions = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const { list: institutions, loading, error } = useSelector(state => state.institutions)

  useEffect(() => {
    if (user) {
      dispatch(fetchInstitutions())
    }
  }, [dispatch, user])

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      </Container>
    )
  }

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Institutions
        </Typography>
        {user.is_super_admin && (
          <Button
            variant="contained"
            component={Link}
            to="/create-institution"
          >
            Créer une institution
          </Button>
        )}
      </Box>

      {institutions.length === 0 ? (
        <Alert severity="info">Aucune institution disponible pour votre compte.</Alert>
      ) : (
        institutions.map((institution) => {
          const institutionId = institution.id ?? institution._id
          if (!institutionId) return null // skip si ID manquant

          return (
            <Card key={institutionId} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6">
                      {institution.name}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {institution.address}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={`${institution.photo_albums?.length || 0} albums`}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${institution.admin_ids?.length || 0} admins`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/institutions/${institutionId}`}
                  >
                    Voir détails
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )
        })
      )}
    </Container>
  )
}

export default Institutions
