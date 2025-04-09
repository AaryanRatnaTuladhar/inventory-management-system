import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Paper, Card, CardContent,
  Button, TextField, MenuItem, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Snackbar,
  Divider, alpha, useTheme, FormControl, InputLabel, Select
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Sales = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const theme = useTheme();
  
  // State for sales data
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSales, setTotalSales] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for filtering/searching
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // State for sale cancellation
  const [cancelSaleId, setCancelSaleId] = useState(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // State for new sale dialog
  const [newSaleDialogOpen, setNewSaleDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newSaleData, setNewSaleData] = useState({
    productId: '',
    quantity: 1,
    customerName: '',
    customerContact: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  const [newSaleErrors, setNewSaleErrors] = useState({});
  const [submittingNewSale, setSubmittingNewSale] = useState(false);
  
  // State for notifications
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Stats
  const [salesStats, setSalesStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageOrderValue: 0,
  });

  // Fetch sales on component mount
  useEffect(() => {
    fetchSales();
    fetchSalesStats();
  }, [refreshTrigger, page, rowsPerPage, searchTerm, startDate, endDate, paymentMethod]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      
      // Construct query parameters for filtering
      const params = {
        page,
        limit: rowsPerPage
      };
      
      if (searchTerm) params.search = searchTerm;
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      if (paymentMethod) params.paymentMethod = paymentMethod;
      
      const response = await api.sales.getAll(params);
      setSales(response.data.sales);
      setTotalSales(response.data.totalCount || response.data.sales.length);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.response?.data?.error || 'Failed to fetch sales');
      setLoading(false);
    }
  };

  const fetchSalesStats = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      
      console.log('Fetching sales stats with params:', params);
      const response = await api.sales.getStats(params);
      console.log('Sales stats API response:', response.data);
      
      // The API returns data in a 'stats' object
      if (response.data && response.data.stats) {
        const { totalSales, totalRevenue } = response.data.stats;
        console.log('Extracted stats:', { totalSales, totalRevenue });
        
        setSalesStats({
          totalSales,
          totalRevenue,
          averageOrderValue: totalSales ? totalRevenue / totalSales : 0
        });
      } else {
        console.error('Invalid response format from sales stats API');
      }
    } catch (err) {
      console.error('Error fetching sales statistics:', err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPage(0);
  };
  
  const handleDateChange = (type, date) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setPage(0);
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
    setPaymentMethod('');
    setPage(0);
  };
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    // Also explicitly fetch sales stats
    fetchSalesStats();
  };
  
  const handleViewSale = (id) => {
    navigate(`/sales/${id}`);
  };
  
  const handleCancelSale = (id) => {
    setCancelSaleId(id);
    setConfirmCancelOpen(true);
  };
  
  const confirmCancelSale = async () => {
    try {
      setCancelling(true);
      
      await api.sales.cancel(cancelSaleId);
      
      setNotification({
        open: true,
        message: 'Sale cancelled successfully',
        severity: 'success'
      });
      
      // Refresh the sales list
      handleRefresh();
      
    } catch (err) {
      console.error('Error cancelling sale:', err);
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to cancel sale',
        severity: 'error'
      });
    } finally {
      setCancelling(false);
      setConfirmCancelOpen(false);
      setCancelSaleId(null);
    }
  };
  
  const handleCloseCancelDialog = () => {
    setConfirmCancelOpen(false);
    setCancelSaleId(null);
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  const exportSalesData = () => {
    // Implement export functionality here
    // This is a placeholder for future implementation
    alert('Export functionality will be implemented in a future update.');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Add function to fetch products for the new sale dialog
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.products.getAll();
      // Filter out products with zero quantity
      const availableProducts = response.data.products.filter(product => product.quantity > 0);
      setProducts(availableProducts);
      setLoadingProducts(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setNotification({
        open: true,
        message: 'Failed to fetch products',
        severity: 'error'
      });
      setLoadingProducts(false);
    }
  };

  // Handle opening the new sale dialog
  const handleOpenNewSaleDialog = () => {
    fetchProducts();
    setNewSaleDialogOpen(true);
  };

  // Handle closing the new sale dialog
  const handleCloseNewSaleDialog = () => {
    setNewSaleDialogOpen(false);
    // Reset form data
    setNewSaleData({
      productId: '',
      quantity: 1,
      customerName: '',
      customerContact: '',
      paymentMethod: 'Cash',
      notes: ''
    });
    setSelectedProduct('');
    setNewSaleErrors({});
  };

  // Handle changes in the new sale form
  const handleNewSaleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      setSelectedProduct(value);
      const selectedProductData = products.find(p => p._id === value);
      
      setNewSaleData(prev => ({
        ...prev,
        productId: value,
        // Reset quantity when product changes
        quantity: 1
      }));
    } else {
      setNewSaleData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (newSaleErrors[name]) {
      setNewSaleErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate the new sale form
  const validateNewSaleForm = () => {
    const errors = {};
    
    if (!newSaleData.productId) {
      errors.productId = 'Please select a product';
    }
    
    if (!newSaleData.quantity || newSaleData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    // Check if quantity exceeds available stock
    if (newSaleData.productId && newSaleData.quantity) {
      const selectedProductData = products.find(p => p._id === newSaleData.productId);
      if (selectedProductData && newSaleData.quantity > selectedProductData.quantity) {
        errors.quantity = `Only ${selectedProductData.quantity} units available`;
      }
    }
    
    return errors;
  };

  // Handle creating a new sale
  const handleCreateSale = async () => {
    const errors = validateNewSaleForm();
    
    if (Object.keys(errors).length > 0) {
      setNewSaleErrors(errors);
      return;
    }
    
    try {
      setSubmittingNewSale(true);
      
      await api.sales.create(newSaleData);
      
      setNotification({
        open: true,
        message: 'Sale created successfully',
        severity: 'success'
      });
      
      // Refresh sales data
      handleRefresh();
      
      // Close dialog
      handleCloseNewSaleDialog();
      
    } catch (err) {
      console.error('Error creating sale:', err);
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to create sale',
        severity: 'error'
      });
    } finally {
      setSubmittingNewSale(false);
    }
  };

  return (
    <MainLayout title="Sales">
      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">Sales Overview</Typography>
          <Tooltip title="Refresh Stats">
            <IconButton onClick={fetchSalesStats} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <Box 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <PointOfSaleIcon color="primary" fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(salesStats.totalRevenue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <Box 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <ReceiptIcon color="success" fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {salesStats.totalSales || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <Box 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <ReceiptIcon color="info" fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Order Value
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(salesStats.averageOrderValue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Actions Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search transactions..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 240 }}
          />
          
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "contained" : "outlined"}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportSalesData}
            sx={{ borderRadius: 2 }}
          >
            Export
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewSaleDialog}
            sx={{ borderRadius: 2 }}
          >
            New Sale
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      {showFilters && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            boxShadow: theme.shadows[2]
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleDateChange('start', value ? new Date(value) : null);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleDateChange('end', value ? new Date(value) : null);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Payment Method"
                fullWidth
                size="small"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <MenuItem value="">All Methods</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="Mobile Payment">Mobile Payment</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleResetFilters}
                sx={{ borderRadius: 2, mr: 1 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={fetchSales}
                sx={{ borderRadius: 2 }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Sales Table */}
      <Paper 
        sx={{ 
          overflow: 'hidden', 
          borderRadius: 3,
          boxShadow: theme.shadows[2]
        }}
      >
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No sales records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale._id} hover>
                    <TableCell>{sale.transactionId}</TableCell>
                    <TableCell>{formatDate(sale.saleDate)}</TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>
                      {sale.customerName || 'Walk-in Customer'}
                      {sale.customerContact && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {sale.customerContact}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                    <TableCell align="right">{sale.quantity}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(sale.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={sale.status} 
                        size="small"
                        color={getStatusColor(sale.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewSale(sale._id)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {sale.status !== 'Cancelled' && (
                        <Tooltip title="Cancel Sale">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleCancelSale(sale._id)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalSales}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Cancel Sale Confirmation Dialog */}
      <Dialog
        open={confirmCancelOpen}
        onClose={handleCloseCancelDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to cancel this sale? This will return the items to inventory.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseCancelDialog} 
            color="inherit" 
            disabled={cancelling}
          >
            No, Keep It
          </Button>
          <Button 
            onClick={confirmCancelSale} 
            color="error" 
            variant="contained"
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={24} /> : <CancelIcon />}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Sale'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* New Sale Dialog */}
      <Dialog
        open={newSaleDialogOpen}
        onClose={handleCloseNewSaleDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            px: 3, 
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box display="flex" alignItems="center">
            <PointOfSaleIcon 
              sx={{ 
                mr: 1.5, 
                color: theme.palette.primary.main,
                fontSize: 28
              }} 
            />
            <Typography variant="h6" fontWeight="bold">
              Create New Sale
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseNewSaleDialog}
            size="small"
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Product Information
              </Typography>
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.background.default, 0.5)
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Select a product from inventory to create a sale
                    </Typography>
                    <FormControl 
                      fullWidth 
                      error={!!newSaleErrors.productId}
                      variant="outlined"
                      sx={{ minHeight: 80 }}
                    >
                      <InputLabel id="product-select-label">Select Product</InputLabel>
                      <Select
                        labelId="product-select-label"
                        name="productId"
                        value={newSaleData.productId}
                        onChange={handleNewSaleInputChange}
                        label="Select Product"
                        disabled={loadingProducts}
                        sx={{ 
                          '& .MuiSelect-select': { 
                            py: 1.5,
                            fontSize: '1rem'
                          }
                        }}
                      >
                        {loadingProducts ? (
                          <MenuItem value="" disabled>
                            <Box display="flex" alignItems="center">
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              <Typography>Loading products...</Typography>
                            </Box>
                          </MenuItem>
                        ) : products.length === 0 ? (
                          <MenuItem value="" disabled>
                            <Box display="flex" alignItems="center" sx={{ py: 1 }}>
                              <Typography color="error">No products available</Typography>
                            </Box>
                          </MenuItem>
                        ) : (
                          products.map(product => (
                            <MenuItem key={product._id} value={product._id} sx={{ py: 1.5 }}>
                              <Box>
                                <Typography fontWeight="medium">{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Price: ${product.price.toFixed(2)} • Available: {product.quantity} units
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {newSaleErrors.productId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {newSaleErrors.productId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  
                  {selectedProduct && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="quantity"
                          label="Quantity"
                          fullWidth
                          variant="outlined"
                          type="number"
                          required
                          value={newSaleData.quantity}
                          onChange={handleNewSaleInputChange}
                          error={!!newSaleErrors.quantity}
                          helperText={newSaleErrors.quantity}
                          InputProps={{
                            inputProps: { 
                              min: 1, 
                              max: products.find(p => p._id === selectedProduct)?.quantity || 1 
                            }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Total Amount"
                          fullWidth
                          variant="outlined"
                          value={
                            formatCurrency(newSaleData.quantity * 
                            (products.find(p => p._id === selectedProduct)?.price || 0))
                          }
                          InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
            
            {selectedProduct && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Customer Information
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: alpha(theme.palette.background.default, 0.5)
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="customerName"
                          label="Customer Name"
                          placeholder="Optional"
                          fullWidth
                          variant="outlined"
                          value={newSaleData.customerName}
                          onChange={handleNewSaleInputChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="customerContact"
                          label="Customer Contact"
                          placeholder="Optional"
                          fullWidth
                          variant="outlined"
                          value={newSaleData.customerContact}
                          onChange={handleNewSaleInputChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="payment-method-label">Payment Method</InputLabel>
                          <Select
                            labelId="payment-method-label"
                            name="paymentMethod"
                            value={newSaleData.paymentMethod}
                            onChange={handleNewSaleInputChange}
                            label="Payment Method"
                          >
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                            <MenuItem value="Mobile Payment">Mobile Payment</MenuItem>
                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Additional Information
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: alpha(theme.palette.background.default, 0.5)
                    }}
                  >
                    <TextField
                      name="notes"
                      label="Notes"
                      placeholder="Optional"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      value={newSaleData.notes}
                      onChange={handleNewSaleInputChange}
                    />
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            px: 3, 
            py: 2.5, 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Button 
            onClick={handleCloseNewSaleDialog} 
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSale}
            variant="contained"
            color="primary"
            size="large"
            disabled={submittingNewSale || !selectedProduct}
            sx={{ 
              borderRadius: 2,
              px: 3,
              ml: 2
            }}
            startIcon={submittingNewSale ? <CircularProgress size={20} /> : <PointOfSaleIcon />}
          >
            {submittingNewSale ? 'Processing...' : 'Complete Sale'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Sales; 