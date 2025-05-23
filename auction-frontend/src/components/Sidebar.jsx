import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Gavel as GavelIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Items', icon: <GavelIcon />, path: '/items' },
    { text: 'My Bids', icon: <GavelIcon />, path: '/bids' },
    { text: 'My Wins', icon: <EmojiEventsIcon />, path: '/wins' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' }
  ];

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 240 },
        flexShrink: 0,
        borderRight: { xs: 'none', sm: '1px solid' },
        borderColor: 'divider',
        height: { xs: 'auto', sm: '100vh' },
        position: { xs: 'relative', sm: 'fixed' },
        backgroundColor: 'background.paper',
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 