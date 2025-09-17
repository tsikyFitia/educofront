import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  if (user?.role !== 'admin') return null

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate('/institution/levels')}>
          Gérer les niveaux
        </Button>
        <Button variant="contained" onClick={() => navigate('/institution/subjects')}>
          Gérer les matières
        </Button>
        <Button variant="outlined" onClick={() => navigate('/institution/settings')}>
          Paramètres de l’institution
        </Button>
      </Stack>
    </Box>
  )
}

export default Navbar
