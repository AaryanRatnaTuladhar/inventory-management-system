
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar,
  Badge, Tooltip, Menu, MenuItem, alpha, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

const MainLayout = ({ children, title = 'Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [activeRoute, setActiveRoute] = useState('');
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Debug: Log current user info
  useEffect(() => {
    console.log('Current user in MainLayout:', currentUser);
  }, [currentUser]);

  // Get current pathname when location changes
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: "Widget A stock is low", read: false },
    { id: 2, message: "New shipment arrived", read: true },
    { id: 3, message: "Product catalog updated", read: false },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Define base menu items
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Sales', icon: <PointOfSaleIcon />, path: '/sales' },
  ];

  // Add Analytics for admin users only
  if (isAdmin) {
    menuItems.push(
      { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' }
    );
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        color: 'white',
        height: 64
      }}>
        <InventoryIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" noWrap>
          InvenTrack Pro
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = activeRoute === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    backgroundColor: isActive 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    fontWeight: isActive ? 600 : 400,
                    '&:hover': {
                      backgroundColor: isActive 
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.05),
                    },
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '60%',
                      width: 4,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 4px 4px 0',
                    } : {}
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ color: 'error' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ height: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="semibold" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              sx={{ ml: 1 }}
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            PaperProps={{
              elevation: 3,
              sx: { 
                width: 320,
                maxHeight: 400,
                mt: 1.5,
                borderRadius: 2,
                overflow: 'hidden',
                '& .MuiList-root': {
                  py: 0,
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={handleNotificationsClose}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderLeft: notification.read ? 'none' : '3px solid',
                      borderColor: 'primary.main',
                      backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 500 }}>
                      {notification.message}
                    </Typography>
                  </MenuItem>
                ))}
                <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    View all notifications
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </Menu>

          {/* User Menu */}
          <Box 
            sx={{ 
              ml: 2, 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 1.5,
              px: 1,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
            }}
            onClick={handleUserMenuOpen}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: 'white'
              }}
            >
              {currentUser?.userName ? currentUser.userName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight="medium">
                {currentUser?.userName || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser?.email || 'user@example.com'}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon 
              fontSize="small" 
              sx={{ ml: 0.5, color: 'text.secondary', display: { xs: 'none', md: 'block' } }} 
            />
          </Box>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { 
                width: 200,
                mt: 1.5,
                borderRadius: 2,
                overflow: 'hidden',
                '& .MuiList-root': {
                  py: 0.5,
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <AccountCircleIcon fontSize="small" sx={{ mr: 1.5 }} />
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.error.main }} />
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: 'background.default',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(10px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 
