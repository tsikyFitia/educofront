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
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLevels,
  createLevel,
  deleteLevel,
  updateLevel,
} from '../store/slices/levelSlice'
import { fetchSubjects } from '../store/slices/subjectSlice'

const InstitutionLevels = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: levels, loading, error } = useSelector((state) => state.levels)
  const { items: subjects } = useSelector((state) => state.subjects)

  const [form, setForm] = useState({
    name: '',
    cycle: '',
    average_age: '',
    description: '',
    subjects: [],
  })
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    if (user?.role === 'admin' && user?.institution_ids?.[0]) {
      dispatch(fetchLevels(user.institution_ids[0]))
      dispatch(fetchSubjects(user.institution_ids[0]))
    }
  }, [dispatch, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubjectsChange = (e) => {
    const { value } = e.target
    setForm({ ...form, subjects: typeof value === 'string' ? value.split(',') : value })
  }

  const handleSubmit = () => {
    const { name, cycle, average_age } = form
    if (!name || !cycle || !average_age) return

    const payload = {
      ...form,
      average_age: parseInt(form.average_age),
      institution_id: user.institution_ids[0],
    }

    if (editMode) {
      dispatch(updateLevel({ levelId: editId, data: payload }))
        .then(() => {
          setAlert({ open: true, message: 'Niveau modifié avec succès', severity: 'success' })
          resetForm()
        })
        .catch(() => {
          setAlert({ open: true, message: 'Erreur lors de la modification', severity: 'error' })
        })
    } else {
      dispatch(createLevel(payload))
        .then(() => {
          setAlert({ open: true, message: 'Niveau ajouté avec succès', severity: 'success' })
          resetForm()
        })
        .catch(() => {
          setAlert({ open: true, message: 'Erreur lors de l’ajout', severity: 'error' })
        })
    }
  }

  const resetForm = () => {
    setForm({ name: '', cycle: '', average_age: '', description: '', subjects: [] })
    setEditMode(false)
    setEditId(null)
  }

  const handleEdit = (level) => {
    setForm({
      name: level.name,
      cycle: level.cycle,
      average_age: level.average_age.toString(),
      description: level.description || '',
      subjects: level.subjects || [],
    })
    setEditMode(true)
    setEditId(level.id)
  }

  const confirmDelete = (id) => {
    setConfirmDeleteId(id)
  }

  const handleDeleteConfirmed = () => {
    dispatch(deleteLevel(confirmDeleteId))
      .then(() => {
        setAlert({ open: true, message: 'Niveau supprimé avec succès', severity: 'success' })
      })
      .catch(() => {
        setAlert({ open: true, message: 'Erreur lors de la suppression', severity: 'error' })
      })
    setConfirmDeleteId(null)
  }

  if (user?.role !== 'admin') {
    return <Typography>Accès réservé aux administrateurs d’institution.</Typography>
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestion des niveaux
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1">{editMode ? 'Modifier le niveau' : 'Ajouter un niveau'}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField label="Nom du niveau" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Cycle" name="cycle" value={form.cycle} onChange={handleChange} select fullWidth>
            <MenuItem value="Primaire">Primaire</MenuItem>
            <MenuItem value="Collège">Collège</MenuItem>
            <MenuItem value="Lycée">Lycée</MenuItem>
            <MenuItem value="Université">Université</MenuItem>
          </TextField>
          <TextField label="Âge moyen" name="average_age" type="number" value={form.average_age} onChange={handleChange} fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={2} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Matières</InputLabel>
            <Select
              multiple
              name="subjects"
              value={form.subjects}
              onChange={handleSubjectsChange}
              input={<OutlinedInput label="Matières" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const subject = subjects.find((s) => s.id === value)
                    return <Chip key={value} label={subject?.name || value} />
                  })}
                </Box>
              )}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Modifier' : 'Ajouter'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1">Niveaux existants</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {levels.map((level) => (
              <ListItem
                key={level.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleEdit(level)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => confirmDelete(level.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={level.name}
                  secondary={`${level.cycle} • Âge moyen: ${level.average_age}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>Voulez-vous vraiment supprimer ce niveau ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Annuler</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default InstitutionLevels
