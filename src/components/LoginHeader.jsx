import React from 'react';
import { Box, Typography } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoginHeader = ({ itemVariants }) => {
  return (
    <motion.div variants={itemVariants}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        <SchoolIcon sx={{ fontSize: 48, mr: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
        <Typography variant="h2" component="h1" fontWeight="700" fontFamily='"Varela Round", sans-serif'>
          EduCO
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoginHeader;