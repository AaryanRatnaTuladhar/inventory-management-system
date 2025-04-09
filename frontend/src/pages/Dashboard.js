import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Paper, Typography, Box, Card, CardContent,
  List, ListItem, ListItemText, ListItemIcon, Divider,
  CircularProgress, IconButton, useTheme, alpha
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  // Debug: log current user
  useEffect(() => {
    console.log('Current user in Dashboard:', currentUser);
  }, [currentUser]);

  useEffect(() => {
    // Fetch dashboard data from the API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product statistics
        const response = await api.products.getStats();
        const productStats = response.data.stats;
        
        // Transform data for dashboard display
        setStats({
          totalProducts: productStats.totalProducts || 0,
          lowStockItems: productStats.lowStockProducts || [],
          recentActivity: productStats.recentActivity || []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <Box 
        mb={4}
        sx={{
          animation: 'slideDown 0.5s ease-out',
          '@keyframes slideDown': {
            '0%': {
              opacity: 0,
              transform: 'translateY(-20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {currentUser?.userName || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your inventory today.
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.1s',
            animationFillMode: 'both',
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
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                right: -20,
                bottom: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Products
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <InventoryIcon />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Last updated: Today
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  onClick={() => navigate('/inventory')}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.2s',
            animationFillMode: 'both',
          }}
        >
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                right: -20,
                bottom: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.lowStockItems.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Low Stock Items
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <WarningIcon />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Requires attention
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.3s',
            animationFillMode: 'both',
          }}
        >
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                right: -20,
                bottom: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.recentActivity.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Recent Activities
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Latest updates
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.4s',
            animationFillMode: 'both',
          }}
        >
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                right: -20,
                bottom: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    24
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Pending Orders
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <ShoppingCartIcon />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Awaiting processing
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Sections */}
      <Grid container spacing={3}>
        {/* Low Stock Alerts */}
        <Grid item xs={12} md={6}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.5s',
            animationFillMode: 'both',
          }}
        >
          <Paper 
            sx={{ 
              p: 0, 
              height: '100%',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: alpha(theme.palette.error.light, 0.1)
              }}
            >
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Low Stock Alerts
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/inventory')}
              >
                View All <VisibilityIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Typography>
            </Box>
            <List>
              {stats.lowStockItems.map((item, index) => (
                <ListItem 
                  key={item._id}
                  divider={index < stats.lowStockItems.length - 1}
                  sx={{ 
                    px: 3, 
                    py: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.light, 0.05),
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => navigate(`/inventory/${item._id}`)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main
                      }}
                    >
                      <WarningIcon fontSize="small" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Current stock: <span style={{ fontWeight: 600, color: theme.palette.error.main }}>{item.quantity}</span> (Threshold: {item.minStockLevel})
                      </Typography>
                    }
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
              ))}
              {stats.lowStockItems.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
                        No low stock items at the moment.
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}
          sx={{
            animation: 'fadeIn 0.5s ease-out',
            animationDelay: '0.6s',
            animationFillMode: 'both',
          }}
        >
          <Paper 
            sx={{ 
              p: 0, 
              height: '100%',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: alpha(theme.palette.primary.light, 0.1)
              }}
            >
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                View All <VisibilityIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Typography>
            </Box>
            <List>
              {stats.recentActivity.map((activity, index) => (
                <ListItem 
                  key={activity._id}
                  divider={index < stats.recentActivity.length - 1}
                  sx={{ 
                    px: 3, 
                    py: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.05),
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => navigate(`/inventory/${activity._id}`)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('increased') 
                          ? alpha(theme.palette.success.main, 0.1)
                          : activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('decreased') 
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.primary.main, 0.1),
                        color: activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('increased') 
                          ? theme.palette.success.main
                          : activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('decreased') 
                            ? theme.palette.error.main
                            : theme.palette.primary.main
                      }}
                    >
                      {activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('increased') ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : activity.stockHistory && activity.stockHistory.length > 0 && activity.stockHistory[activity.stockHistory.length - 1].action.includes('decreased') ? (
                        <TrendingDownIcon fontSize="small" />
                      ) : (
                        <InventoryIcon fontSize="small" />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          {activity.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {activity.stockHistory && activity.stockHistory.length > 0 
                          ? activity.stockHistory[activity.stockHistory.length - 1].action 
                          : 'Product updated'} • {activity.updatedAt ? new Date(activity.updatedAt).toLocaleString() : 'Recently'}
                      </Typography>
                    }
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
              ))}
              {stats.recentActivity.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
                        No recent activity to display.
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard; 