import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  IconButton, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  Tooltip,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { 
  ArrowUpward, 
  ArrowDownward, 
  Inventory as InventoryIcon, 
  TrendingUp, 
  Warning, 
  MoreVert, 
  ShoppingCart, 
  AttachMoney, 
  People, 
  Refresh,
  Star,
  ThumbUp,
  Timeline,
  CalendarMonth,
  Category
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

// Chart components (using Chart.js and react-chartjs-2)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalSales: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [animate, setAnimate] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
          // Mock data
          const mockStats = {
            totalProducts: 152,
            lowStock: 12,
            totalSales: 1842,
            totalRevenue: 18420,
            revenueGrowth: 12.8,
            ordersGrowth: 8.5
          };
          
          const mockRecentOrders = [
            { id: 1, customer: 'John Doe', date: '2023-06-22', total: 124.99, status: 'delivered' },
            { id: 2, customer: 'Jane Smith', date: '2023-06-21', total: 76.50, status: 'processing' },
            { id: 3, customer: 'Bob Johnson', date: '2023-06-20', total: 52.25, status: 'delivered' },
            { id: 4, customer: 'Sarah Williams', date: '2023-06-19', total: 210.75, status: 'delivered' },
            { id: 5, customer: 'Michael Brown', date: '2023-06-18', total: 89.99, status: 'shipped' }
          ];
          
          const mockTopProducts = [
            { id: 1, name: 'Widget A', sales: 124, revenue: 2356.76, growth: 15.2 },
            { id: 2, name: 'Gadget X', sales: 98, revenue: 4652.02, growth: 8.7 },
            { id: 3, name: 'Tool B', sales: 87, revenue: 1739.13, growth: -2.3 },
            { id: 4, name: 'Accessory Z', sales: 65, revenue: 974.35, growth: 5.8 }
          ];
          
          const mockInventorySummary = [
            { category: 'Widgets', count: 42, percentage: 28 },
            { category: 'Gadgets', count: 38, percentage: 25 },
            { category: 'Tools', count: 27, percentage: 18 },
            { category: 'Accessories', count: 24, percentage: 16 },
            { category: 'Components', count: 21, percentage: 13 }
          ];
          
          const mockMonthlySales = [
            { month: 'Jan', units: 145, revenue: 7250 },
            { month: 'Feb', units: 162, revenue: 8100 },
            { month: 'Mar', units: 158, revenue: 7900 },
            { month: 'Apr', units: 175, revenue: 8750 },
            { month: 'May', units: 182, revenue: 9100 },
            { month: 'Jun', units: 195, revenue: 9750 }
          ];
          
          setStats(mockStats);
          setRecentOrders(mockRecentOrders);
          setTopProducts(mockTopProducts);
          setInventorySummary(mockInventorySummary);
          setMonthlySales(mockMonthlySales);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Chart data for sales overview
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales Revenue',
        data: [5200, 6100, 5800, 8200, 7800, 9500, 10200, 10800, 9800, 11200, 11800, 12400],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        tension: 0.4,
        fill: true,
        pointBackgroundColor: theme.palette.primary.main,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Target',
        data: [6000, 6000, 6000, 8000, 8000, 8000, 10000, 10000, 10000, 12000, 12000, 12000],
        borderColor: theme.palette.grey[400],
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      }
    ]
  };

  // Chart options for sales overview
  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 10,
      }
    }
  };

  // Chart data for category distribution
  const categoryData = {
    labels: inventorySummary.map(item => item.category),
    datasets: [
      {
        data: inventorySummary.map(item => item.count),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
        ],
        borderWidth: 0,
        hoverOffset: 5,
      }
    ]
  };

  // Chart options for category distribution
  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => ({
              text: `${label} (${datasets[0].data[i]})`,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].backgroundColor[i],
              pointStyle: 'circle',
              hidden: false,
            }));
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  // Chart data for top products
  const topProductsData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Sales',
        data: topProducts.map(product => product.sales),
        backgroundColor: alpha(theme.palette.primary.main, 0.7),
        borderRadius: 6,
        barThickness: 12,
      }
    ]
  };

  // Chart options for top products
  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const product = topProducts[index];
            return [
              `Sales: ${product.sales} units`,
              `Revenue: $${product.revenue.toFixed(2)}`,
              `Growth: ${product.growth > 0 ? '+' : ''}${product.growth}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          }
        }
      }
    }
  };

  // Chart data for monthly sales
  const monthlySalesData = {
    labels: monthlySales.map(item => item.month),
    datasets: [
      {
        type: 'bar',
        label: 'Units Sold',
        data: monthlySales.map(item => item.units),
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        borderRadius: 6,
        barThickness: 20,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Revenue',
        data: monthlySales.map(item => item.revenue),
        borderColor: theme.palette.secondary.main,
        backgroundColor: 'transparent',
        pointBackgroundColor: theme.palette.secondary.main,
        tension: 0.2,
        pointRadius: 4,
        yAxisID: 'y1'
      }
    ]
  };

  // Chart options for monthly sales
  const monthlySalesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: theme.palette.text.primary
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Units',
          color: theme.palette.text.secondary
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue ($)',
          color: theme.palette.secondary.main
        },
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleRefresh = () => {
    // Reload dashboard data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const renderStatCard = (title, value, icon, change, changeType, subtitle, delay) => {
    return (
      <Fade in={animate} timeout={700} style={{ transitionDelay: `${delay}ms` }}>
        <Card 
          sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
            }
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                }}
              >
                {icon}
              </Avatar>
              <Box ml="auto">
                {change !== undefined && (
                  <Chip
                    size="small"
                    label={`${change > 0 ? '+' : ''}${change}%`}
                    icon={change > 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                    color={change > 0 ? 'success' : 'error'}
                    sx={{ 
                      borderRadius: 1,
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>
            </Box>
            <Typography variant="h4" fontWeight="bold" mb={0.5}>
              {typeof value === 'number' && !title.includes('Revenue') ? value.toLocaleString() : `$${value.toLocaleString()}`}
            </Typography>
            <Typography color="text.secondary" variant="body2" fontWeight={500}>
              {title}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Fade>
    );
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ mb: 3, opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease-out' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's an overview of your inventory system
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(
            'Total Products',
            stats.totalProducts,
            <InventoryIcon />,
            null,
            null,
            null,
            100
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(
            'Low Stock Items',
            stats.lowStock,
            <Warning />,
            null,
            null,
            `${Math.round((stats.lowStock / stats.totalProducts) * 100)}% of inventory`,
            200
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(
            'Total Revenue',
            stats.totalRevenue,
            <AttachMoney />,
            stats.revenueGrowth,
            'increase',
            'vs. last month',
            300
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatCard(
            'Total Orders',
            stats.totalSales,
            <ShoppingCart />,
            stats.ordersGrowth,
            'increase',
            'vs. last month',
            400
          )}
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Fade in={animate} timeout={700} style={{ transitionDelay: '500ms' }}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
              }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Sales Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly sales performance
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 320 }}>
                <Line data={salesData} options={salesOptions} />
              </Box>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in={animate} timeout={700} style={{ transitionDelay: '600ms' }}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
              }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Inventory by Category
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Product distribution
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => navigate('/inventory')}
                >
                  <Category fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut data={categoryData} options={categoryOptions} />
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Monthly Sales Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Fade in={animate} timeout={700} style={{ transitionDelay: '700ms' }}>
            <Paper 
              sx={{ 
                p: 3, 
                height: 400, 
                borderRadius: 3,
                boxShadow: theme.shadows[2]
              }}
            >
              <Box height="100%">
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <LinearProgress sx={{ width: '50%' }} />
                  </Box>
                ) : (
                  <Bar data={monthlySalesData} options={monthlySalesOptions} height="100%" />
                )}
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Recent Orders & Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Fade in={animate} timeout={700} style={{ transitionDelay: '800ms' }}>
            <Paper 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
              }}
            >
              <Box 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest customer purchases
                  </Typography>
                </Box>
                <Button 
                  endIcon={<Timeline />}
                  color="primary"
                  size="small"
                  onClick={() => navigate('/orders')}
                >
                  View All
                </Button>
              </Box>
              
              <List sx={{ width: '100%', p: 0 }}>
                {recentOrders.map((order, index) => (
                  <ListItem 
                    key={order.id}
                    alignItems="flex-start"
                    sx={{ 
                      px: 2,
                      borderBottom: index !== recentOrders.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }
                    }}
                    button
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {order.customer.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="medium">
                          {order.customer}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            Order #{order.id} • {order.date}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Typography variant="subtitle2" fontWeight="bold">
                          ${order.total.toFixed(2)}
                        </Typography>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ mt: 0.5, minWidth: 80, borderRadius: 1 }}
                        />
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Fade in={animate} timeout={700} style={{ transitionDelay: '900ms' }}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
              }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Top Selling Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best performers this month
                  </Typography>
                </Box>
                <Tooltip title="Best selling products by unit sales">
                  <IconButton size="small">
                    <Star fontSize="small" color="warning" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ height: 300 }}>
                <Bar data={topProductsData} options={topProductsOptions} />
              </Box>
              
              <Box mt={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate('/inventory')}
                  sx={{ borderRadius: 2 }}
                >
                  View All Products
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;