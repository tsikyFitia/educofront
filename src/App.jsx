// App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentUser, setAuthChecked } from './store/slices/authSlice'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Institutions from './pages/Institutions'
import InstitutionDetail from './pages/InstitutionDetail'
import InviteAdmin from './pages/InviteAdmin'
import Layout from './components/layout/Layout'
import CreateInstitution from './pages/CreateInstitution'
import InstitutionUsers from './pages/InstitutionUsers'
import InstitutionLevels from './pages/InstitutionLevels'
import InstitutionSubjects from './pages/InstitutionSubjects'
import { CircularProgress, Box } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
    },
  },
})

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser())
    } else {
      dispatch(setAuthChecked())
    }
  }, [dispatch])

  if (!authChecked) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/institutions" element={isAuthenticated ? <Layout><Institutions /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/institutions/:id" element={isAuthenticated ? <Layout><InstitutionDetail /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/invite-admin" element={isAuthenticated ? <Layout><InviteAdmin /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="/create-institution" element={isAuthenticated ? <Layout><CreateInstitution /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/institutions/:id/users" element={isAuthenticated ? <Layout><InstitutionUsers /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/institution/levels" element={isAuthenticated ? <Layout><InstitutionLevels /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/institution/subjects" element={isAuthenticated ? <Layout><InstitutionSubjects /></Layout> : <Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
