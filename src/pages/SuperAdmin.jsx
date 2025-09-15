// src/pages/SuperAdmin.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    admin_email: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_password: '',
    admin_phone: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/super-admin/institutions', formData);
      setSuccess('Institution créée avec succès');
      setDialogOpen(false);
      // Reset form
      setFormData({
        name: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        admin_email: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_password: '',
        admin_phone: '',
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await api.get('/super-admin/institutions');
      setInstitutions(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des institutions');
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await api.get('/super-admin/invitations');
      setInvitations(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des invitations');
    }
  };

  React.useEffect(() => {
    if (activeTab === 0) {
      fetchInstitutions();
    } else if (activeTab === 1) {
      fetchInvitations();
    }
  }, [activeTab]);

  return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="600" color="primary">
                Super Administration
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Gestion des institutions et administrateurs
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Créer une institution
            </Button>
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

          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Institutions" />
              <Tab label="Invitations en cours" />
              <Tab label="Statistiques" />
            </Tabs>
          </Paper>

          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {institutions.map((institution) => (
                  <Grid item xs={12} md={6} key={institution.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SchoolIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            {institution.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {institution.address}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip label={institution.email} size="small" variant="outlined" />
                          <Chip label={institution.phone} size="small" variant="outlined" />
                          <Chip 
                            label={institution.is_active ? 'Active' : 'Inactive'} 
                            size="small" 
                            color={institution.is_active ? 'success' : 'default'} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {invitations.map((invitation) => (
                  <Grid item xs={12} md={6} key={invitation.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EmailIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            {invitation.email}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          Institution: {invitation.institution_id}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip 
                            label={invitation.is_used ? 'Acceptée' : 'En attente'} 
                            size="small" 
                            color={invitation.is_used ? 'success' : 'warning'} 
                          />
                          <Chip 
                            label={new Date(invitation.expires_at).toLocaleDateString()} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Statistiques de la plateforme
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      15
                    </Typography>
                    <Typography variant="body2">
                      Institutions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary" gutterBottom>
                      245
                    </Typography>
                    <Typography variant="body2">
                      Utilisateurs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="success" gutterBottom>
                      1,245
                    </Typography>
                    <Typography variant="body2">
                      Contenus
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning" gutterBottom>
                      5,678
                    </Typography>
                    <Typography variant="body2">
                      Exercices
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Dialog pour créer une institution */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Créer une nouvelle institution</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informations de l'institution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Nom de l'institution"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Site web"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Administrateur de l'institution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Prénom de l'admin"
                      name="admin_first_name"
                      value={formData.admin_first_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Nom de l'admin"
                      name="admin_last_name"
                      value={formData.admin_last_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email de l'admin"
                      name="admin_email"
                      type="email"
                      value={formData.admin_email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Mot de passe"
                      name="admin_password"
                      type="password"
                      value={formData.admin_password}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Téléphone de l'admin"
                      name="admin_phone"
                      value={formData.admin_phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button 
                onClick={handleCreateInstitution} 
                variant="contained" 
                disabled={loading}
              >
                {loading ? <LoadingSpinner size={20} /> : 'Créer'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
  );
};

export default SuperAdmin;