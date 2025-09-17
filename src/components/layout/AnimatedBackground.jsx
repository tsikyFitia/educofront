// src/components/layout/AnimatedBackground.jsx
import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// Animation de rotation pour le tourbillon
const swirl = keyframes`
  0% { transform: rotate(0deg) scale(1); opacity: 0.7; }
  50% { transform: rotate(180deg) scale(1.1); opacity: 0.9; }
  100% { transform: rotate(360deg) scale(1); opacity: 0.7; }
`;

// Animation pour les étoiles scintillantes
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

// Animation pour les éléments éducatifs flottants
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

// Animation pour le pulsement du cœur galactique
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0a0e2a 0%, #000000 70%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background: 
            'radial-gradient(circle at center, rgba(31, 40, 85, 0.8) 0%, transparent 50%),' +
            'repeating-radial-gradient(circle at 30% 60%, transparent 0, rgba(18, 25, 60, 0.6) 2px, transparent 4px)',
          transform: 'translate(-50%, -50%)',
          animation: `${swirl} 120s linear infinite`,
        },
      }}
    >
      {/* Cœur galactique */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92, 107, 192, 0.6) 0%, rgba(32, 40, 90, 0.2) 60%)',
          boxShadow: '0 0 200px 100px rgba(92, 107, 192, 0.3)',
          transform: 'translate(-50%, -50%)',
          animation: `${pulse} 15s ease-in-out infinite`,
        }}
      />

      {/* Étoiles */}
      {[...Array(150)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: '#fff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `${twinkle} ${Math.random() * 5 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255, 255, 255, 0.5)`,
            }}
          />
        );
      })}

      {/* Éléments éducatifs flottants */}
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          fontSize: '2.8rem',
          animation: `${float} 15s ease-in-out infinite`,
          filter: 'drop-shadow(0 0 8px rgba(100, 181, 246, 0.8))',
        }}
      >
        📚
      </Box>
      
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          fontSize: '2.5rem',
          animation: `${float} 12s ease-in-out infinite 2s`,
          filter: 'drop-shadow(0 0 8px rgba(77, 182, 172, 0.8))',
        }}
      >
        🔬
      </Box>
      
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '65%',
          left: '10%',
          fontSize: '3rem',
          animation: `${float} 18s ease-in-out infinite 1s`,
          filter: 'drop-shadow(0 0 8px rgba(239, 108, 72, 0.8))',
        }}
      >
        🧪
      </Box>
      
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '75%',
          right: '15%',
          fontSize: '2.2rem',
          animation: `${float} 14s ease-in-out infinite 3s`,
          filter: 'drop-shadow(0 0 8px rgba(246, 191, 38, 0.8))',
        }}
      >
        📝
      </Box>
      
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '25%',
          fontSize: '2.5rem',
          animation: `${float} 16s ease-in-out infinite 4s`,
          filter: 'drop-shadow(0 0 8px rgba(120, 111, 166, 0.8))',
        }}
      >
        🧮
      </Box>
      
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '40%',
          right: '10%',
          fontSize: '2.8rem',
          animation: `${float} 13s ease-in-out infinite 5s`,
          filter: 'drop-shadow(0 0 8px rgba(77, 171, 247, 0.8))',
        }}
      >
        🌍
      </Box>

      {/* Planètes éducatives */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '8%',
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ff9a9e, #fad0c4)',
          boxShadow: '0 0 30px rgba(255, 154, 158, 0.6), inset -10px -10px 20px rgba(0, 0, 0, 0.3)',
          animation: `${float} 25s ease-in-out infinite`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          color: 'white',
          filter: 'drop-shadow(0 0 10px rgba(255, 154, 158, 0.8))',
        }}
      >
        📖
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #a1c4fd, #c2e9fb)',
          boxShadow: '0 0 25px rgba(161, 196, 253, 0.6), inset -10px -10px 20px rgba(0, 0, 0, 0.3)',
          animation: `${float} 30s ease-in-out infinite reverse 3s`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.8rem',
          color: 'white',
          filter: 'drop-shadow(0 0 10px rgba(161, 196, 253, 0.8))',
        }}
      >
        ∫
      </Box>

      {/* Traînées d'étoiles filantes */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 120,
            height: 2,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: 0,
            animation: `shootingStar ${Math.random() * 15 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 20}s`,
            '@keyframes shootingStar': {
              '0%': { 
                opacity: 0,
                transform: `rotate(${Math.random() * 360}deg) translateX(0)`,
              },
              '5%': { opacity: 1 },
              '100%': { 
                opacity: 0,
                transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 500 + 500}px)`,
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedBackground;