import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubjects, createSubject, deleteSubject } from '../store/slices/subjectSlice'

const InstitutionSubjects = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: subjects, loading, error } = useSelector((state) => state.subjects)

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
  })

  useEffect(() => {
    if (user?.role === 'admin' && user?.institution_ids?.[0]) {
      dispatch(fetchSubjects(user.institution_ids[0]))
    }
  }, [dispatch, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddSubject = () => {
    const { name, code } = form
    if (!name || !code) return

    dispatch(createSubject({
      ...form,
      institution_id: user.institution_ids[0],
    }))
    setForm({ name: '', code: '', description: '' })
  }

  const handleDelete = (id) => {
    dispatch(deleteSubject(id))
  }

  if (user?.role !== 'admin') {
    return <Typography>Accès réservé aux administrateurs d’institution.</Typography>
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestion des matières
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1">Ajouter une matière</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nom de la matière"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddSubject}>
            Ajouter
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1">Matières existantes</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {subjects.map((subject) => (
              <ListItem
                key={subject.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(subject.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${subject.name} (${subject.code})`}
                  secondary={subject.description}
                />
              </ListItem>
            ))}
          </List>
        )}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>
    </Box>
  )
}

export default InstitutionSubjects
