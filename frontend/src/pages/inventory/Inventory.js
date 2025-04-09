import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Grid, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField,
  InputAdornment, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Alert, Fade, Grow,
  Backdrop, Tooltip, alpha, useTheme, Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state for add product dialog
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    minStockLevel: '',
    sku: '',
    supplierName: '',
    supplierContact: '',
    supplierAddress: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.products.getAll();
        setProducts(response.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.error || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      minStockLevel: '',
      sku: '',
      supplierName: '',
      supplierContact: '',
      supplierAddress: ''
    });
    setFormErrors({});
  };

  const handleFilterDialogOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/inventory/${productId}`);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStockFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setSearchTerm('');
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newProduct.name) errors.name = 'Name is required';
    if (!newProduct.category) errors.category = 'Category is required';
    if (!newProduct.price) {
      errors.price = 'Price is required';
    } else if (isNaN(newProduct.price) || Number(newProduct.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!newProduct.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(newProduct.quantity) || Number(newProduct.quantity) < 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
    
    return errors;
  };

  const handleAddProduct = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await api.products.create(newProduct);
      
      // Add the new product to the state
      setProducts(prev => [...prev, response.data.product]);
      
      // Close dialog and reset form
      handleCloseDialog();
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Product added successfully',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error adding product:', err);
      
      // Show error notification
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to add product',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(products.filter(product => product.category).map(product => product.category))];

  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => 
      (searchTerm === '' || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(product => categoryFilter === 'all' || product.category === categoryFilter)
    .filter(product => {
      if (stockFilter === 'all') return true;
      if (stockFilter === 'low') return product.quantity < (product.minStockLevel || 10);
      if (stockFilter === 'out') return product.quantity === 0;
      return true;
    })
    .sort((a, b) => {
      const factor = sortOrder === 'asc' ? 1 : -1;
      
      if (sortBy === 'name') {
        return factor * ((a.name || '').localeCompare(b.name || ''));
      } else if (sortBy === 'price') {
        return factor * ((a.price || 0) - (b.price || 0));
      } else if (sortBy === 'stock') {
        return factor * ((a.quantity || 0) - (b.quantity || 0));
      } else if (sortBy === 'date') {
        return factor * (new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));
      }
      
      return 0;
    });

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return sortOrder === 'asc' ? 
      <span style={{ marginLeft: 4, fontSize: '0.75rem' }}>↑</span> : 
      <span style={{ marginLeft: 4, fontSize: '0.75rem' }}>↓</span>;
  };

  // Add this function for determining stock status
  const getStockStatus = (quantity, minStockLevel) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error', severity: 'error' };
    if (quantity < minStockLevel) return { label: 'Low Stock', color: 'warning', severity: 'warning' };
    return { label: 'In Stock', color: 'success', severity: 'success' };
  };

  // Add this helper function for date formatting after the renderSortIcon function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format date as MM/DD/YYYY, hh:mm AM/PM
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (loading) {
    return (
      <MainLayout title="Inventory Management">
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="60vh">
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary">
            Loading inventory data...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Inventory Management">
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }}
        >
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </MainLayout>
    );
  }

  // Add Product Dialog
  const addProductDialog = (
    <Dialog 
      open={openAddDialog} 
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 2.5,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h5" fontWeight="600">Add New Product</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>Fill in the details to add a new product to inventory</Typography>
        </Box>
        <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 4, py: 4 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {/* First Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  width: 4, 
                  height: 20, 
                  bgcolor: theme.palette.primary.main, 
                  mr: 1, 
                  borderRadius: 4,
                  display: 'inline-block' 
                }} />
                Product Information
              </Typography>
              
              <TextField
                name="name"
                label="Product Name"
                fullWidth
                variant="outlined"
                required
                value={newProduct.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  sx: { borderRadius: 2, mb: 2 }
                }}
              />
              
              <TextField
                name="description"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
                InputProps={{
                  sx: { borderRadius: 2, mb: 2 }
                }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="category"
                    label="Category"
                    fullWidth
                    variant="outlined"
                    required
                    value={newProduct.category}
                    onChange={handleInputChange}
                    error={!!formErrors.category}
                    helperText={formErrors.category}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sku"
                    label="SKU"
                    fullWidth
                    variant="outlined"
                    value={newProduct.sku}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  width: 4, 
                  height: 20, 
                  bgcolor: theme.palette.primary.main, 
                  mr: 1, 
                  borderRadius: 4,
                  display: 'inline-block' 
                }} />
                Pricing & Inventory
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Price"
                    fullWidth
                    variant="outlined"
                    required
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      sx: { borderRadius: 2 }
                    }}
                    value={newProduct.price}
                    onChange={handleInputChange}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="quantity"
                    label="Quantity"
                    fullWidth
                    variant="outlined"
                    required
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    error={!!formErrors.quantity}
                    helperText={formErrors.quantity}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="minStockLevel"
                    label="Min Stock Level"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={newProduct.minStockLevel}
                    onChange={handleInputChange}
                    placeholder="Default: 10"
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Second Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  width: 4, 
                  height: 20, 
                  bgcolor: theme.palette.primary.main, 
                  mr: 1, 
                  borderRadius: 4,
                  display: 'inline-block' 
                }} />
                Supplier Information
              </Typography>
              
              <TextField
                name="supplierName"
                label="Supplier Name"
                fullWidth
                variant="outlined"
                value={newProduct.supplierName}
                onChange={handleInputChange}
                InputProps={{
                  sx: { borderRadius: 2, mb: 2 }
                }}
              />
              
              <TextField
                name="supplierContact"
                label="Supplier Contact"
                fullWidth
                variant="outlined"
                value={newProduct.supplierContact}
                onChange={handleInputChange}
                placeholder="Phone or email"
                InputProps={{
                  sx: { borderRadius: 2, mb: 2 }
                }}
              />
              
              <TextField
                name="supplierAddress"
                label="Supplier Address"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                value={newProduct.supplierAddress}
                onChange={handleInputChange}
                placeholder="Full supplier address"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        px: 4, 
        py: 3, 
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        borderTop: '1px solid', 
        borderColor: theme.palette.divider
      }}>
        <Button 
          onClick={handleCloseDialog} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddProduct} 
          variant="contained" 
          color="primary"
          disableElevation
          startIcon={<AddIcon />}
          disabled={submitting}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            ml: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 2
          }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <MainLayout title="Inventory Management">
      <Box 
        mb={4}
        sx={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Inventory Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your products and stock levels
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Export Inventory">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderRadius: 2,
                    mr: 1
                  }}
                >
                  Export
                </Button>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Add Product
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filter Bar */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button 
                startIcon={<FilterListIcon />}
                variant="outlined"
                onClick={handleFilterDialogOpen}
                sx={{ borderRadius: 2 }}
              >
                Filters
              </Button>
            </Grid>
            <Grid item>
              <Button 
                startIcon={<SortIcon />}
                variant="outlined"
                onClick={() => {
                  // Toggle between name ascending and descending as a quick sort
                  if (sortBy === 'name' && sortOrder === 'asc') {
                    setSortOrder('desc');
                  } else {
                    setSortBy('name');
                    setSortOrder('asc');
                  }
                }}
                sx={{ borderRadius: 2 }}
              >
                Sort
              </Button>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Active Filters Display */}
        {(categoryFilter !== 'all' || stockFilter !== 'all' || searchTerm) && (
          <Box mt={2} display="flex" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Active Filters:
            </Typography>
            
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                size="small" 
                onDelete={() => setSearchTerm('')}
                sx={{ borderRadius: 1.5 }}
              />
            )}
            
            {categoryFilter !== 'all' && (
              <Chip 
                label={`Category: ${categoryFilter}`} 
                size="small" 
                onDelete={() => setCategoryFilter('all')}
                sx={{ borderRadius: 1.5 }}
              />
            )}
            
            {stockFilter !== 'all' && (
              <Chip 
                label={`Stock: ${stockFilter === 'low' ? 'Low Stock' : 'Out of Stock'}`} 
                size="small" 
                onDelete={() => setStockFilter('all')}
                color={stockFilter === 'out' ? 'error' : 'warning'}
                sx={{ borderRadius: 1.5 }}
              />
            )}
            
            <Button 
              variant="text" 
              size="small" 
              onClick={clearFilters}
              sx={{ ml: 1, fontSize: '0.75rem' }}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      {/* Dashboard Stats */}
      <Box mb={3}
        sx={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.4s ease-out 0.25s, transform 0.4s ease-out 0.25s',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 3, 
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.success.light, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Products</Typography>
              <Typography variant="h4" color="text.primary" fontWeight="600">{products.length}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 3, 
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.warning.light, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Low Stock Items</Typography>
              <Typography variant="h4" color="text.primary" fontWeight="600">
                {products.filter(p => p.quantity > 0 && p.quantity < (p.minStockLevel || 10)).length}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 3, 
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.error.light, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Out of Stock</Typography>
              <Typography variant="h4" color="text.primary" fontWeight="600">
                {products.filter(p => p.quantity === 0).length}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              onClick={() => {
                setStockFilter('low');
                handleFilterDialogOpen();
              }}
              sx={{ 
                p: 2, 
                borderRadius: 3, 
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.primary.light, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reorder Needed</Typography>
                <FilterListIcon color="primary" fontSize="small" />
              </Box>
              <Typography variant="h4" color="text.primary" fontWeight="600">
                {products.filter(p => p.quantity < (p.minStockLevel || 10)).length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Products Table */}
      <Paper 
        sx={{ 
          p: 0, 
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.4s ease-out 0.3s, transform 0.4s ease-out 0.3s',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: alpha(theme.palette.primary.main, 0.05),
                      '& th': {
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                        py: 2,
                      }
                    }}
                  >
                    <TableCell 
                      onClick={() => handleSortChange('name')}
                      sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
                    >
                      Product Name {renderSortIcon('name')}
                    </TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell 
                      align="right"
                      onClick={() => handleSortChange('stock')}
                      sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
                    >
                      In Stock {renderSortIcon('stock')}
                    </TableCell>
                    <TableCell 
                      align="right"
                      onClick={() => handleSortChange('price')}
                      sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
                    >
                      Price {renderSortIcon('price')}
                    </TableCell>
                    <TableCell 
                      onClick={() => handleSortChange('date')}
                      sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
                    >
                      Last Updated {renderSortIcon('date')}
                    </TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product.quantity, product.minStockLevel || 10);
                    return (
                      <Fade 
                        in={true} 
                        timeout={300} 
                        style={{ transitionDelay: `${index * 50}ms` }}
                        key={product._id}
                      >
                        <TableRow 
                          hover
                          onClick={() => handleProductClick(product._id)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            },
                            ...(product.quantity === 0 && {
                              backgroundColor: alpha(theme.palette.error.light, 0.05)
                            }),
                            ...(product.quantity > 0 && product.quantity < (product.minStockLevel || 10) && {
                              backgroundColor: alpha(theme.palette.warning.light, 0.05)
                            })
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={500}>
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category} 
                              size="small"
                              sx={{ 
                                borderRadius: 1.5,
                                bgcolor: `${alpha(theme.palette.primary.light, 0.1)}`,
                                color: theme.palette.primary.main,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <Chip 
                                label={
                                  <>
                                    {product.quantity}
                                    {product.quantity < (product.minStockLevel || 10) && (
                                      <Box component="span" sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
                                        <WarningIcon fontSize="small" sx={{ width: 14, height: 14 }} />
                                      </Box>
                                    )}
                                  </>
                                }
                                color={stockStatus.color}
                                size="small"
                                sx={{ 
                                  fontWeight: 'bold',
                                  minWidth: 50,
                                  borderRadius: 1.5,
                                }}
                              />
                              <Tooltip title={stockStatus.label}>
                                <Chip
                                  label={stockStatus.label}
                                  size="small"
                                  color={stockStatus.color}
                                  variant="outlined"
                                  sx={{ 
                                    height: 24,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    borderRadius: 1.5
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={500}>
                              ${product.price.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(product.updatedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(product._id);
                                  }}
                                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Product">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/inventory/${product._id}/edit`);
                                  }}
                                  sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {isAdmin && (
                                <Tooltip title="Delete Product">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle delete action
                                    }}
                                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No products found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your search or filters to find what you're looking for.
                          </Typography>
                          {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
                            <Button 
                              variant="outlined" 
                              size="small" 
                              onClick={clearFilters}
                              sx={{ mt: 2 }}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination or Results Summary */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredProducts.length} of {products.length} products
              </Typography>
              
              {/* Pagination could go here */}
            </Box>
          </>
        )}
      </Paper>

      {/* Filter Dialog */}
      <Dialog 
        open={openFilterDialog} 
        onClose={handleFilterDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <FilterListIcon sx={{ mr: 1 }} />
            Filter Products
          </Box>
          <IconButton size="small" onClick={handleFilterDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="stock-filter-label">Stock Level</InputLabel>
            <Select
              labelId="stock-filter-label"
              id="stock-filter"
              value={stockFilter}
              label="Stock Level"
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="all">All Stock Levels</MenuItem>
              <MenuItem value="low">Low Stock Items</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Product Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="stock">Stock Level</MenuItem>
              <MenuItem value="date">Last Updated</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="sort-order-label">Order</InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order"
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              clearFilters();
              handleFilterDialogClose();
            }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleFilterDialogClose}
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      {addProductDialog}
      
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
    </MainLayout>
  );
};

export default Inventory; 