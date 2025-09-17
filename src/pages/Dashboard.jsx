import React from 'react'
import { useSelector } from 'react-redux'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
} from '@mui/material'
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  BarChart as ChartIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import Navbar from '../components/Navbar'

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <Navbar/>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bonjour {user?.first_name} {user?.last_name}, bienvenue sur votre espace EduAI
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cours suivis"
            value="12"
            icon={<SchoolIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Exercices complétés"
            value="47"
            icon={<AssignmentIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Moyenne générale"
            value="84%"
            icon={<ChartIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notifications"
            value="3"
            icon={<NotificationsIcon />}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progression des cours
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: 100 }}>
                  Mathématiques
                </Typography>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress variant="determinate" value={75} />
                </Box>
                <Typography variant="body2">75%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: 100 }}>
                  Physique
                </Typography>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress variant="determinate" value={60} />
                </Box>
                <Typography variant="body2">60%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: 100 }}>
                  Histoire
                </Typography>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress variant="determinate" value={90} />
                </Box>
                <Typography variant="body2">90%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommandations récentes
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                    <SchoolIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Nouveau cours recommandé"
                  secondary="Algèbre linéaire - Il y a 2 jours"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                    <AssignmentIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Exercice à réviser"
                  secondary="Problèmes de physique - Il y a 5 jours"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard