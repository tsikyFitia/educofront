import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  AutoStories,
  Calculate,
} from '@mui/icons-material';

const AnimatedEducationalBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      }}
    >
      {/* Étoiles de connaissance */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#fff',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      
      {/* Planètes éducatives */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
          boxShadow: '0 0 20px rgba(255, 154, 158, 0.5)',
        }}
        animate={{
          y: [0, -20, 0],
          rotate: 360,
        }}
        transition={{
          y: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          rotate: {
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
          <AutoStories />
        </Box>
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)',
          boxShadow: '0 0 20px rgba(161, 196, 253, 0.5)',
        }}
        animate={{
          y: [0, 15, 0],
          rotate: 360,
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          rotate: {
            duration: 40,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
          <Calculate />
        </Box>
      </motion.div>
      
      {/* Éléments éducatifs flottants */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            fontSize: `${Math.random() * 24 + 16}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        >
          {i % 4 === 0 ? '📚' : i % 4 === 1 ? '🔬' : i % 4 === 2 ? '🧪' : '📊'}
        </motion.div>
      ))}
    </Box>
  );
};

export default AnimatedEducationalBackground;