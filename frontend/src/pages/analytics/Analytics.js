import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, MenuItem,
  FormControl, InputLabel, Select, CircularProgress, Alert,
  Card, CardContent, Stack, Tab, Tabs
} from '@mui/material';
import { 
  TrendingUp, AttachMoney, Inventory, ShoppingCart, 
  Category, Payment, DateRange
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { format, subDays, subMonths, parseISO } from 'date-fns';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalQuantity: 0,
    topProducts: [],
    categorySales: [],
    timeSeriesData: [],
    paymentMethodStats: [],
    stockStatus: { low: 0, optimal: 0, excess: 0 }
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Prepare date range based on selected timeRange
        let startDate, endDate;
        const now = new Date();
        
        switch(timeRange) {
          case 'week':
            startDate = subDays(now, 7);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'quarter':
            startDate = subMonths(now, 3);
            break;
          case 'year':
            startDate = subMonths(now, 12);
            break;
          default:
            startDate = subMonths(now, 1);
        }
        
        // Format dates as ISO strings
        const formattedStartDate = startDate.toISOString();
        const formattedEndDate = now.toISOString();
        
        // Call API with date range and period
        const response = await api.sales.getStats({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          period: timePeriod
        });
        
        if (response.data && response.data.stats) {
          setData(response.data.stats);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to fetch analytics data');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, timePeriod]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <MainLayout title="Analytics">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Analytics">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  // Prepare chart data
  const salesTrendData = {
    labels: data.timeSeriesData.map(item => {
      if (timePeriod === 'monthly') {
        const [year, month] = item.period.split('-');
        return `${month}/${year.slice(2)}`;
      } else if (timePeriod === 'hourly') {
        // For hourly data, show date + hour
        const date = new Date(item.period);
        return `${date.getHours()}:00 ${date.getDate()}/${date.getMonth() + 1}`;
      }
      return item.period;
    }),
    datasets: [
      {
        label: 'Revenue',
        data: data.timeSeriesData.map(item => item.totalRevenue),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Orders',
        data: data.timeSeriesData.map(item => item.orderCount),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        tension: 0.4,
        yAxisID: 'y1',
        borderDash: [5, 5]
      }
    ]
  };

  const salesTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Revenue') {
              label += `$${context.raw.toFixed(2)}`;
            } else {
              label += context.raw;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      }
    }
  };

  const categoryData = {
    labels: data.categorySales.map(item => item.category),
    datasets: [
      {
        label: 'Sales by Category',
        data: data.categorySales.map(item => item.totalAmount),
        backgroundColor: [
          '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#ec4899', '#0ea5e9', '#14b8a6', '#f97316', '#6366f1'
        ],
        borderWidth: 1
      }
    ]
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const topProductsData = {
    labels: data.topProducts.map(product => product.productName),
    datasets: [
      {
        label: 'Units Sold',
        data: data.topProducts.map(product => product.totalQuantity),
        backgroundColor: '#4f46e5',
        borderRadius: 6,
        barThickness: 20,
      }
    ]
  };

  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Units Sold: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Sold'
        }
      }
    }
  };

  const paymentMethodData = {
    labels: data.paymentMethodStats.map(item => item.method),
    datasets: [
      {
        label: 'Payment Methods',
        data: data.paymentMethodStats.map(item => item.totalAmount),
        backgroundColor: [
          '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
        ],
        borderWidth: 1
      }
    ]
  };

  const stockStatusData = {
    labels: ['Low Stock', 'Optimal Stock', 'Excess Stock'],
    datasets: [
      {
        label: 'Stock Status',
        data: [
          data.stockStatus.low,
          data.stockStatus.optimal,
          data.stockStatus.excess
        ],
        backgroundColor: [
          '#ef4444', '#10b981', '#f59e0b'
        ],
        borderWidth: 1
      }
    ]
  };

  // Stat card component
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Paper sx={{ p: 2.5, height: '100%', borderRadius: 2, boxShadow: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color || 'primary'}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box 
          sx={{ 
            borderRadius: '50%', 
            backgroundColor: `${color || '#4f46e5'}15`,
            p: 1
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <MainLayout title="Analytics">
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Business Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and analyze your business performance
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="time-range"
                  value={timeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="time-period-label">Group By</InputLabel>
                <Select
                  labelId="time-period-label"
                  id="time-period"
                  value={timePeriod}
                  label="Group By"
                  onChange={handleTimePeriodChange}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* KPI Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(data.totalRevenue)}
            icon={<AttachMoney color="primary" />}
            subtitle={`From ${data.totalSales} orders`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Order Value" 
            value={formatCurrency(data.totalSales ? data.totalRevenue / data.totalSales : 0)}
            icon={<TrendingUp color="success" />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Units Sold" 
            value={data.totalQuantity.toLocaleString()}
            icon={<ShoppingCart color="info" />}
            color="#0ea5e9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Low Stock Items" 
            value={data.stockStatus.low}
            icon={<Inventory color="error" />}
            color="#ef4444"
            subtitle="Require attention"
          />
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Box mb={4}>
        <Paper sx={{ borderRadius: 2, boxShadow: 2, overflow: 'hidden' }}>
          <Box p={2}>
            <Typography variant="h6" fontWeight="bold">
              Sales Trends
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revenue and order volume over time
            </Typography>
          </Box>
          <Divider />
          <Box p={2} height={400}>
            <Line 
              data={salesTrendData} 
              options={salesTrendOptions} 
            />
          </Box>
        </Paper>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, pt: 2 }}
        >
          <Tab icon={<Category />} label="Categories" iconPosition="start" />
          <Tab icon={<Inventory />} label="Products" iconPosition="start" />
          <Tab icon={<Payment />} label="Payments" iconPosition="start" />
          <Tab icon={<DateRange />} label="Inventory Status" iconPosition="start" />
        </Tabs>
        <Divider />
        
        {/* Tab Panels */}
        <Box p={3}>
          {/* Category Analysis */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Sales by Category
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Distribution of sales across product categories
                </Typography>
                <Box height={400}>
                  <Doughnut 
                    data={categoryData} 
                    options={categoryOptions} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Category Performance
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Revenue breakdown by category
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Stack spacing={2}>
                    {data.categorySales
                      .sort((a, b) => b.totalAmount - a.totalAmount)
                      .map((item, index) => (
                        <Paper 
                          key={index} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            boxShadow: 1
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.category}
                          </Typography>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Revenue
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.totalAmount)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Units Sold
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {item.totalQuantity}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))
                    }
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Product Analysis */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Top Selling Products
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Products with highest units sold
                </Typography>
                <Box height={400}>
                  <Bar 
                    data={topProductsData} 
                    options={topProductsOptions} 
                  />
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Payment Methods */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Payment Methods
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Distribution of sales by payment method
                </Typography>
                <Box height={400}>
                  <Pie 
                    data={paymentMethodData} 
                    options={{
                      ...categoryOptions,
                      cutout: 0,
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Payment Method Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Revenue and transaction count by payment method
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Stack spacing={2}>
                    {data.paymentMethodStats
                      .sort((a, b) => b.totalAmount - a.totalAmount)
                      .map((item, index) => (
                        <Paper 
                          key={index} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            boxShadow: 1
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.method}
                          </Typography>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Revenue
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.totalAmount)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Transactions
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {item.count}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))
                    }
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Inventory Status */}
          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Inventory Status
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Current stock level distribution
                </Typography>
                <Box height={400}>
                  <Doughnut 
                    data={stockStatusData} 
                    options={{
                      ...categoryOptions,
                      cutout: '50%'
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Stock Level Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Status of your inventory levels
                </Typography>
                <Stack spacing={3} mt={4}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      boxShadow: 1,
                      borderLeft: '4px solid #ef4444'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#ef4444">
                      Low Stock Items
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" my={1}>
                      {data.stockStatus.low}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items that need to be restocked soon
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      boxShadow: 1,
                      borderLeft: '4px solid #10b981'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#10b981">
                      Optimal Stock Items
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" my={1}>
                      {data.stockStatus.optimal}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items with healthy stock levels
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      boxShadow: 1,
                      borderLeft: '4px solid #f59e0b'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#f59e0b">
                      Excess Stock Items
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" my={1}>
                      {data.stockStatus.excess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items with potential overstocking
                    </Typography>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </MainLayout>
  );
};

export default Analytics; 