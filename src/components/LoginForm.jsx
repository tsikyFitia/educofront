import React from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  loading,
  error,
  handleCloseError,
  containerVariants,
  itemVariants
}) => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div variants={itemVariants} style={{ width: '100%' }}>
          <Paper
            elevation={24}
            sx={{
              padding: 5,
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                    color: 'white',
                    padding: 3,
                    borderRadius: '50%',
                    marginBottom: 3,
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                  }}
                >
                  <LoginIcon fontSize="large" />
                </Box>
              </motion.div>
              <Typography component="h2" variant="h3" gutterBottom fontWeight="600" color="primary" fontFamily='"Varela Round", sans-serif'>
                Connexion
              </Typography>
              <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Accédez à votre espace éducatif EduCO
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" onClose={handleCloseError} sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      padding: '4px 12px',
                      '& input': {
                        padding: '12px 8px',
                      }
                    }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      padding: '4px 12px',
                      '& input': {
                        padding: '12px 8px',
                      }
                    }
                  }}
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
                  sx={{ 
                    mt: 4, 
                    mb: 3, 
                    py: 1.8, 
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976D2, #03A9F4)',
                      boxShadow: '0 6px 14px rgba(33, 150, 243, 0.5)',
                    }
                  }}
                >
                  Se connecter
                </LoadingButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body1" color="textSecondary" fontStyle="italic">
                    Plateforme éducative
                  </Typography>
                </Divider>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoginForm;