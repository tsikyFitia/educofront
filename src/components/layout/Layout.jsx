// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import LoadingSpinner from '../common/LoadingSpinner';
import Notification from '../common/Notification';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useSelector((state) => state.ui);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AnimatedBackground />
      {/*<Navbar onMenuClick={toggleSidebar} />*/}
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: `calc(100% - ${sidebarOpen ? 280 : 60}px)`,
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        {loading && <LoadingSpinner />}
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
      <Notification />
    </Box>
  );
};

export default Layout;