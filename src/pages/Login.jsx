import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../store/slices/authSlice';
import AnimatedEducationalBackground from '../components/AnimatedEducationalBackground';
import LoginHeader from '../components/LoginHeader';
import LoginForm from '../components/LoginForm';

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
      <AnimatedEducationalBackground />
      
      <Container component="main" maxWidth="sm" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <LoginHeader itemVariants={itemVariants} />
          <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            error={error}
            handleCloseError={handleCloseError}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        </motion.div>
      </Container>
    </>
  );
};

export default Login;