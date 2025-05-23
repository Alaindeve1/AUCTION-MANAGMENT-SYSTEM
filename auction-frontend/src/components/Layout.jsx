import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme, useMediaQuery } from '@mui/material';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <Navbar />
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        position: 'relative'
      }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { xs: 0, sm: '240px' }, // Sidebar width
            width: { xs: '100%', sm: `calc(100% - 240px)` },
            minHeight: 'calc(100vh - 64px)', // Subtract navbar height
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: '56px', sm: '64px' } // Approximate AppBar height
          }}
        >
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1, sm: 2, md: 3 } // Responsive padding
          }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 