import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert as MuiAlert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { fetchInstitution } from '../store/slices/institutionSlice'
import { fetchAllUsers, createStudent, createTeacher, deleteUser, updateUser } from '../store/slices/userSlice'
import { fetchSubjects } from '../store/slices/subjectSlice'
import { fetchLevels } from '../store/slices/levelSlice'


const InstitutionUsers = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { current: institution, loading: institutionLoading, error: institutionError } = useSelector(state => state.institutions)
  const { list: allUsers = [], loading: usersLoading, error: usersError } = useSelector(state => state.users)
  const user = useSelector(state => state.auth.user)
  const { items: subjects = [] } = useSelector(state => state.subjects || {})
  const { items: levels = [] } = useSelector(state => state.levels || {})


  // UI state
  const [activeTab, setActiveTab] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [userType, setUserType] = useState('student')
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })

  // Create forms
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    level_id: '',
    institution_id: id,
    guardians: [],
  })
  const [teacherData, setTeacherData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    institution_id: id,
    subjects: [],
    levels: [],
    bio: '',
    qualifications: [],
    teaching_experience: 0,
  })
  const [guardianData, setGuardianData] = useState({
    email: '',
    last_name: '',
    first_name: '',
    phone: '',
  })

  // Edit modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUserData, setEditUserData] = useState(null)

  // Confirm dialog state
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null })

  useEffect(() => {
    if (id) {
      dispatch(fetchInstitution(id))
      dispatch(fetchAllUsers())
      dispatch(fetchSubjects(id))
      dispatch(fetchLevels(id))
    }
  }, [dispatch, id])

  // Filtrer les utilisateurs de cette institution
  const institutionUsers = allUsers.filter(u =>
    Array.isArray(u.institution_ids) && u.institution_ids.map(String).includes(String(id))
  )

  const isAdmin =
    user &&
    user.role === 'admin' &&
    Array.isArray(user.institution_ids) &&
    user.institution_ids.map(String).includes(String(id))

  const isSuperAdmin = user && user.is_super_admin

  if (!isAdmin && !isSuperAdmin) {
    return <MuiAlert severity="error">Accès non autorisé</MuiAlert>
  }

  const handleCreateUser = () => {
    if (userType === 'student') {
      dispatch(createStudent(studentData))
        .unwrap()
        .then((result) => {
          setAlert({ open: true, message: `Étudiant créé. Mot de passe: ${result.temporary_password}`, severity: 'success' })
          setCreateDialogOpen(false)
          setActiveStep(0)
          setStudentData({
            first_name: '',
            last_name: '',
            email: '',
            birth_date: '',
            level_id: '',
            institution_id: id,
            guardians: [],
          })
          
          dispatch(fetchAllUsers())
        })
        .catch(error => {
          setAlert({ open: true, message: error || 'Erreur création étudiant', severity: 'error' })
        })
        console.log('Payload étudiant envoyé :', studentData)
    } else if (userType === 'teacher') {
      dispatch(createTeacher(teacherData))
        .unwrap()
        .then((result) => {
          setAlert({ open: true, message: `Enseignant créé. Mot de passe: ${result.temporary_password}`, severity: 'success' })
          setCreateDialogOpen(false)
          setActiveStep(0)
          setTeacherData({
            first_name: '',
            last_name: '',
            email: '',
            birth_date: '',
            institution_id: id,
            subjects: [],
            levels: [],
            bio: '',
            qualifications: [],
            teaching_experience: 0,
          })
          dispatch(fetchAllUsers())
        })
        .catch(error => {
          setAlert({ open: true, message: error || 'Erreur création enseignant', severity: 'error' })
        })
        console.log('Payload teacherData envoyé :', teacherData)
    }

  }

  const handleAddGuardian = () => {
    setStudentData({
      ...studentData,
      guardians: [...studentData.guardians, { ...guardianData }],
    })
    setGuardianData({
      email: '',
      last_name: '',
      first_name: '',
      phone: '',
    })
  }

  const handleRemoveGuardian = (index) => {
    const newGuardians = [...studentData.guardians]
    newGuardians.splice(index, 1)
    setStudentData({ ...studentData, guardians: newGuardians })
  }

  const handleNextStep = () => setActiveStep((s) => s + 1)
  const handleBackStep = () => setActiveStep((s) => s - 1)

  const confirmAction = (title, message, onConfirm) => {
    setConfirm({ open: true, title, message, onConfirm })
  }

  const handleRemoveFromInstitution = async (userId) => {
    const userToUpdate = allUsers.find(u => (u.id || u._id) === userId || u._id === userId)
    if (!userToUpdate) return
    const currentInst = (userToUpdate.institution_ids || []).map(String)
    const updatedInstitutionIds = currentInst.filter(instId => instId !== String(id))

    confirmAction(
      'Retirer de l’institution',
      'Confirmer le retrait de cet utilisateur de l’institution ?',
      () => {
        dispatch(updateUser({ userId, updateData: { institution_ids: updatedInstitutionIds } }))
          .unwrap()
          .then(() => {
            setAlert({ open: true, message: 'Utilisateur retiré de l’institution', severity: 'success' })
            dispatch(fetchAllUsers())
          })
          .catch((e) => setAlert({ open: true, message: e || 'Erreur lors du retrait', severity: 'error' }))
      }
    )
  }

  const handleAddToInstitution = async (userId) => {
    const userToUpdate = allUsers.find(u => (u.id || u._id) === userId || u._id === userId)
    if (!userToUpdate) return
    const currentInst = (userToUpdate.institution_ids || []).map(String)
    if (currentInst.includes(String(id))) return

    const updatedInstitutionIds = [...(userToUpdate.institution_ids || []), id]

    confirmAction(
      'Ajouter à l’institution',
      'Confirmer l’ajout de cet utilisateur à l’institution ?',
      () => {
        dispatch(updateUser({ userId, updateData: { institution_ids: updatedInstitutionIds } }))
          .unwrap()
          .then(() => {
            setAlert({ open: true, message: 'Utilisateur ajouté à l’institution', severity: 'success' })
            dispatch(fetchAllUsers())
          })
          .catch((e) => setAlert({ open: true, message: e || 'Erreur lors de l’ajout', severity: 'error' }))
      }
    )
  }

  const handleOpenEdit = (u) => {
    setEditUserData({
      id: u.id || u._id,
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      role: u.role || '',
      bio: u.bio || '',
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editUserData) return
    const { id: userId, ...updateData } = editUserData
    confirmAction(
      'Modifier utilisateur',
      'Confirmer la modification de cet utilisateur ?',
      () => {
        dispatch(updateUser({ userId, updateData }))
          .unwrap()
          .then(() => {
            setAlert({ open: true, message: 'Utilisateur modifié avec succès', severity: 'success' })
            setEditDialogOpen(false)
            setEditUserData(null)
            dispatch(fetchAllUsers())
          })
          .catch((e) => setAlert({ open: true, message: e || 'Erreur lors de la modification', severity: 'error' }))
      }
    )
  }

  const handleHardDeleteUser = (userId) => {
    confirmAction(
      'Suppression définitive',
      'Voulez-vous supprimer définitivement cet utilisateur ?',
      () => {
        dispatch(deleteUser(userId))
          .unwrap()
          .then(() => {
            setAlert({ open: true, message: 'Utilisateur supprimé', severity: 'success' })
            dispatch(fetchAllUsers())
          })
          .catch((e) => setAlert({ open: true, message: e || 'Erreur lors de la suppression', severity: 'error' }))
      }
    )
  }

  if (institutionLoading || usersLoading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />
  }

  if (institutionError) {
    return <MuiAlert severity="error">{institutionError}</MuiAlert>
  }

  if (usersError) {
    return <MuiAlert severity="error">{usersError}</MuiAlert>
  }

  // Utilisateurs non associés à cette institution
  const availableUsers = allUsers.filter(u =>
    !Array.isArray(u.institution_ids) || !u.institution_ids.map(String).includes(String(id))
  )

  const steps =
    userType === 'student'
      ? ["Type d'utilisateur", 'Informations étudiant', 'Parents/tuteurs']
      : ["Type d'utilisateur", 'Informations enseignant']

  return (
    <Container maxWidth="lg">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(`/institutions/${id}`)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Gestion des utilisateurs
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab icon={<GroupIcon />} label="Utilisateurs actuels" />
          <Tab icon={<PersonIcon />} label="Ajouter des utilisateurs" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Utilisateurs de cette institution ({institutionUsers.length})</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
                Nouvel utilisateur
              </Button>
            </Box>

            <Grid container spacing={3}>
              {institutionUsers.map(u => (
                <Grid item xs={12} sm={6} md={4} key={u.id || u._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{u.first_name} {u.last_name}</Typography>
                      <Typography color="textSecondary">{u.email}</Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <IconButton size="small" onClick={() => handleOpenEdit(u)} title="Modifier">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromInstitution(u.id || u._id)}
                        title="Retirer de l'institution"
                      >
                        <DeleteIcon />
                      </IconButton>
                      {isSuperAdmin && (
                        <Button color="error" size="small" onClick={() => handleHardDeleteUser(u.id || u._id)}>
                          Supprimer
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Utilisateurs disponibles
            </Typography>

            <Grid container spacing={3}>
              {availableUsers.map(u => (
                <Grid item xs={12} sm={6} md={4} key={u.id || u._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{u.first_name} {u.last_name}</Typography>
                      <Typography color="textSecondary">{u.email}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleAddToInstitution(u.id || u._id)}>
                        Ajouter à l'institution
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          Créer un nouvel utilisateur
        </DialogTitle>
        <DialogContent>
          {activeStep === 0 && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type d'utilisateur</InputLabel>
                <Select value={userType} label="Type d'utilisateur" onChange={(e) => setUserType(e.target.value)}>
                  <MenuItem value="student">Étudiant</MenuItem>
                  <MenuItem value="teacher">Enseignant</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && userType === 'student' && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Prénom" value={studentData.first_name} onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })} required />
              <TextField label="Nom" value={studentData.last_name} onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })} required />
              <TextField label="Email" type="email" value={studentData.email} onChange={(e) => setStudentData({ ...studentData, email: e.target.value })} required />
              <TextField label="Date de naissance" type="date" InputLabelProps={{ shrink: true }} value={studentData.birth_date} onChange={(e) => setStudentData({ ...studentData, birth_date: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select
                  value={studentData.level_id}
                  onChange={(e) => setStudentData({ ...studentData, level_id: e.target.value })}
                  label="Niveau"
                  required
                >
                  {levels.map((l) => (
                    <MenuItem key={l.id || l._id} value={l.id || l._id}>
                      {l.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && userType === 'teacher' && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Prénom" value={teacherData.first_name} onChange={(e) => setTeacherData({ ...teacherData, first_name: e.target.value })} required />
              <TextField label="Nom" value={teacherData.last_name} onChange={(e) => setTeacherData({ ...teacherData, last_name: e.target.value })} required />
              <TextField label="Email" type="email" value={teacherData.email} onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })} required />
              <TextField label="Date de naissance" type="date" InputLabelProps={{ shrink: true }} value={teacherData.birth_date} onChange={(e) => setTeacherData({ ...teacherData, birth_date: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel>Matières</InputLabel>
                <Select
                  multiple
                  value={teacherData.subjects}
                  onChange={(e) => setTeacherData({ ...teacherData, subjects: e.target.value })}
                  label="Matières"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const subject = subjects.find(s => (s.id || s._id) === id)
                        return <Chip key={id} label={subject?.name || id} />
                      })}
                    </Box>
                  )}
                >
                  {subjects.map((s) => (
                    <MenuItem key={s.id || s._id} value={s.id || s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Niveaux</InputLabel>
                <Select
                  multiple
                  value={teacherData.levels}
                  onChange={(e) => setTeacherData({ ...teacherData, levels: e.target.value })}
                  label="Niveaux"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const level = levels.find(l => (l.id || l._id) === id)
                        return <Chip key={id} label={level?.name || id} />
                      })}
                    </Box>
                  )}
                >
                  {levels.map((l) => (
                    <MenuItem key={l.id || l._id} value={l.id || l._id}>
                      {l.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Biographie" multiline rows={3} value={teacherData.bio} onChange={(e) => setTeacherData({ ...teacherData, bio: e.target.value })} />
            </Box>
          )}

          {activeStep === 2 && userType === 'student' && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">Ajouter un parent/tuteur</Typography>
              <TextField label="Email du parent" type="email" value={guardianData.email} onChange={(e) => setGuardianData({ ...guardianData, email: e.target.value })} />
              <TextField label="Prénom du parent" value={guardianData.first_name} onChange={(e) => setGuardianData({ ...guardianData, first_name: e.target.value })} />
              <TextField label="Nom du parent" value={guardianData.last_name} onChange={(e) => setGuardianData({ ...guardianData, last_name: e.target.value })} />
              <TextField label="Téléphone du parent" value={guardianData.phone} onChange={(e) => setGuardianData({ ...guardianData, phone: e.target.value })} />
              <Button onClick={handleAddGuardian} variant="outlined" startIcon={<AddIcon />}>
                Ajouter ce parent
              </Button>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Parents/tuteurs ajoutés ({studentData.guardians.length})
              </Typography>
              {studentData.guardians.map((guardian, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box>
                    <Typography>{guardian.first_name} {guardian.last_name}</Typography>
                    <Typography variant="body2" color="textSecondary">{guardian.email}</Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleRemoveGuardian(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackStep} disabled={activeStep === 0}>
            Retour
          </Button>
          <Button
            onClick={activeStep === steps.length - 1 ? handleCreateUser : handleNextStep}
            variant="contained"
          >
            {activeStep === steps.length - 1 ? 'Créer' : 'Suivant'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale d’édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          {editUserData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Prénom" value={editUserData.first_name} onChange={(e) => setEditUserData({ ...editUserData, first_name: e.target.value })} />
              <TextField label="Nom" value={editUserData.last_name} onChange={(e) => setEditUserData({ ...editUserData, last_name: e.target.value })} />
              <TextField label="Email" type="email" value={editUserData.email} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} />
              <TextField label="Rôle" value={editUserData.role} onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })} helperText="admin, teacher, student..." />
              <TextField label="Bio" multiline rows={3} value={editUserData.bio || ''} onChange={(e) => setEditUserData({ ...editUserData, bio: e.target.value })} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog open={confirm.open} onClose={() => setConfirm({ ...confirm, open: false })}>
        <DialogTitle>{confirm.title || 'Confirmation'}</DialogTitle>
        <DialogContent>{confirm.message || 'Confirmez-vous cette action ?'}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ ...confirm, open: false })}>Annuler</Button>
          <Button
            color="error"
            onClick={() => {
              const cb = confirm.onConfirm
              setConfirm({ ...confirm, open: false })
              if (typeof cb === 'function') cb()
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <MuiAlert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default InstitutionUsers
