import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme, useMediaQuery } from '@mui/material';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Approximate AppBar height
  const appBarHeight = { xs: '56px', sm: '64px' };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <Navbar />
      {/* This Box contains both the Sidebar and the main content */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        // Add padding top to create space below the fixed Navbar
        pt: appBarHeight
      }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { xs: 0, sm: '240px' }, // Margin for sidebar width
            // Remove mt as padding on the parent Box handles space below navbar
            mt: 0,
            width: { xs: '100%', sm: `calc(100% - 240px)` }, // Width calculation seems correct
            // Remove explicit minHeight calculation and let flex properties manage height
            minHeight: 'auto', // Or remove this line to rely on flex: 1
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            // Keep padding for content within the main area, adjust as needed
            p: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {/* Inner box for padding and flex content */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            // Remove padding here as it's applied to the main content box
            p: 0
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