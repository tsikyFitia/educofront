// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  color: 'primary.main',
                }}
              >
                <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h3" component="h1" fontWeight="700">
                  EduAI
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paper
                elevation={8}
                sx={{
                  padding: 4,
                  width: '100%',
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      padding: 2,
                      borderRadius: '50%',
                      marginBottom: 2,
                    }}
                  >
                    <LoginIcon fontSize="large" />
                  </Box>
                  <Typography component="h2" variant="h4" gutterBottom fontWeight="600">
                    Connexion
                  </Typography>
                  <Typography variant="body1" color="textSecondary" align="center">
                    Bienvenue sur EduAI, veuillez vous connecter à votre compte
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" onClose={handleCloseError} sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Adresse email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
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
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<LoginIcon />}
                      sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
                    >
                      Se connecter
                    </LoadingButton>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Ou
                      </Typography>
                    </Divider>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box textAlign="center">
                      <Link href="/register" variant="body2" underline="hover">
                        {"Vous n'avez pas de compte ? Inscrivez-vous"}
                      </Link>
                    </Box>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </>
  );
};

export default Login;