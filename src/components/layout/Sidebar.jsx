// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  SupervisedUserCircle as SuperAdminIcon,
  Person as ProfileIcon,
  Description as ContentIcon,
  Assignment as ExerciseIcon,
  TrendingUp as ProgressIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openSubmenu, setOpenSubmenu] = useState({});

  const getMenuItems = () => {
    const baseItems = [
      {
        text: 'Tableau de bord',
        icon: <DashboardIcon />,
        path: '/dashboard',
      },
      {
        text: 'Mon profil',
        icon: <ProfileIcon />,
        path: '/profile',
      },
    ];

    // Menu items for super admin
    if (user?.is_super_admin || user?.role === 'super_admin') {
      baseItems.push(
        {
          text: 'Super Admin',
          icon: <SuperAdminIcon />,
          path: '/super-admin',
        },
        {
          text: 'Institutions',
          icon: <SchoolIcon />,
          path: '/institutions',
        },
        {
          text: 'Utilisateurs',
          icon: <PeopleIcon />,
          path: '/users',
        }
      );
    }

    // Menu items for admin
    if (user?.role === 'admin') {
      baseItems.push(
        {
          text: 'Institutions',
          icon: <SchoolIcon />,
          path: '/institutions',
        },
        {
          text: 'Utilisateurs',
          icon: <PeopleIcon />,
          path: '/users',
        }
      );
    }

    // Menu items for teachers
    if (user?.role === 'teacher') {
      baseItems.push(
        {
          text: 'Contenu',
          icon: <ContentIcon />,
          path: '/content',
        },
        {
          text: 'Exercices',
          icon: <ExerciseIcon />,
          path: '/exercises',
        }
      );
    }

    // Menu items for students
    if (user?.role === 'student') {
      baseItems.push(
        {
          text: 'Contenu',
          icon: <ContentIcon />,
          path: '/content',
        },
        {
          text: 'Exercices',
          icon: <ExerciseIcon />,
          path: '/exercises',
        },
        {
          text: 'Progression',
          icon: <ProgressIcon />,
          path: '/progress',
        }
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleToggleSubmenu = (text) => {
    setOpenSubmenu((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 60,
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                EduAI
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        <IconButton onClick={onClose}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ px: 1, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive(item.path)
                  ? 'rgba(78, 84, 200, 0.1)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(78, 84, 200, 0.05)',
                },
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        '& .MuiTypography-root': {
                          fontWeight: isActive(item.path) ? 600 : 400,
                          color: isActive(item.path)
                            ? 'primary.main'
                            : 'text.primary',
                        },
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'white',
            },
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemText
                  primary="Déconnexion"
                  sx={{
                    opacity: open ? 1 : 0,
                    '& .MuiTypography-root': {
                      color: 'inherit',
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;