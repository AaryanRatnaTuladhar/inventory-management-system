import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Grid, Typography, Paper, Divider,
  TextField, CircularProgress, Alert, Chip,
  Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Snackbar,
  Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, InputAdornment,
  alpha, useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const theme = useTheme();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Form state for editing
  const [editedProduct, setEditedProduct] = useState({});
  
  // State for sell dialog
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [saleData, setSaleData] = useState({
    productId: '',
    quantity: 1,
    customerName: '',
    customerContact: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  const [saleErrors, setSaleErrors] = useState({});
  const [submittingSale, setSubmittingSale] = useState(false);
  
  // Add state for restock dialog
  const [openRestockDialog, setOpenRestockDialog] = useState(false);
  const [restockData, setRestockData] = useState({
    productId: '',
    quantity: 10,
    notes: '',
    action: 'Restock'
  });
  const [restockErrors, setRestockErrors] = useState({});
  const [submittingRestock, setSubmittingRestock] = useState(false);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.products.getById(id);
        setProduct(response.data.product);
        setEditedProduct(response.data.product);
        setSaleData(prev => ({
          ...prev,
          productId: response.data.product._id
        }));
        setRestockData(prev => ({
          ...prev,
          productId: response.data.product._id
        }));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.error || 'Failed to fetch product details');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/inventory');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!editedProduct.name) errors.name = 'Name is required';
    if (!editedProduct.category) errors.category = 'Category is required';
    if (!editedProduct.price) {
      errors.price = 'Price is required';
    } else if (isNaN(editedProduct.price) || Number(editedProduct.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!editedProduct.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(editedProduct.quantity) || Number(editedProduct.quantity) < 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Convert string values to numbers where needed
      const productToUpdate = {
        ...editedProduct,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
        minStockLevel: editedProduct.minStockLevel ? Number(editedProduct.minStockLevel) : 10
      };
      
      const response = await api.products.update(id, productToUpdate);
      
      // Update the product state with the updated data
      setProduct(response.data.product);
      setIsEditing(false);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Product updated successfully',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error updating product:', err);
      
      // Show error notification
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to update product',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(true);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      
      await api.products.delete(id);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
      
      // Redirect after a short delay to show the notification
      setTimeout(() => {
        navigate('/inventory');
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting product:', err);
      
      // Show error notification
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to delete product',
        severity: 'error'
      });
      setSubmitting(false);
      setConfirmDelete(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle sell dialog actions
  const handleOpenSellDialog = () => {
    setOpenSellDialog(true);
  };
  
  const handleCloseSellDialog = () => {
    setOpenSellDialog(false);
    setSaleData({
      productId: product?._id || '',
      quantity: 1,
      customerName: '',
      customerContact: '',
      paymentMethod: 'Cash',
      notes: ''
    });
    setSaleErrors({});
  };
  
  const handleSaleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (saleErrors[name]) {
      setSaleErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateSaleForm = () => {
    const errors = {};
    
    if (!saleData.quantity || saleData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (saleData.quantity > product.quantity) {
      errors.quantity = `Only ${product.quantity} units available in stock`;
    }
    
    return errors;
  };
  
  const handleProcessSale = async () => {
    const errors = validateSaleForm();
    
    if (Object.keys(errors).length > 0) {
      setSaleErrors(errors);
      return;
    }
    
    try {
      setSubmittingSale(true);
      
      const response = await api.sales.create(saleData);
      
      setNotification({
        open: true,
        message: 'Sale processed successfully',
        severity: 'success'
      });
      
      // Update product data with new quantity
      setProduct(prev => ({
        ...prev,
        quantity: prev.quantity - saleData.quantity
      }));
      
      // Close dialog
      handleCloseSellDialog();
      
    } catch (err) {
      console.error('Error processing sale:', err);
      
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to process sale',
        severity: 'error'
      });
    } finally {
      setSubmittingSale(false);
    }
  };
  
  const getStockStatus = (quantity, minStockLevel) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error', severity: 'error' };
    if (quantity < minStockLevel) return { label: 'Low Stock', color: 'warning', severity: 'warning' };
    return { label: 'In Stock', color: 'success', severity: 'success' };
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

  // Handle restock dialog actions
  const handleOpenRestockDialog = () => {
    setOpenRestockDialog(true);
    setRestockData(prev => ({
      ...prev,
      productId: product._id,
      quantity: Math.max(product.minStockLevel - product.quantity, 10) // Calculate suggested quantity
    }));
  };
  
  const handleCloseRestockDialog = () => {
    setOpenRestockDialog(false);
    setRestockErrors({});
  };
  
  const handleRestockInputChange = (e) => {
    const { name, value } = e.target;
    setRestockData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (restockErrors[name]) {
      setRestockErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateRestockForm = () => {
    const errors = {};
    
    if (!restockData.quantity || restockData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    return errors;
  };
  
  const handleProcessRestock = async () => {
    const errors = validateRestockForm();
    
    if (Object.keys(errors).length > 0) {
      setRestockErrors(errors);
      return;
    }
    
    try {
      setSubmittingRestock(true);
      
      // Call API to update stock
      const response = await api.products.update(id, {
        ...product,
        quantity: Number(product.quantity) + Number(restockData.quantity),
        stockHistory: [
          ...(product.stockHistory || []),
          {
            date: new Date(),
            quantity: Number(product.quantity) + Number(restockData.quantity),
            previousQuantity: product.quantity,
            action: 'Restock'
          }
        ]
      });
      
      // Update the product state with the updated data
      setProduct(response.data.product);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Product restocked successfully',
        severity: 'success'
      });
      
      // Close dialog
      handleCloseRestockDialog();
      
    } catch (err) {
      console.error('Error restocking product:', err);
      
      // Show error notification
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to restock product',
        severity: 'error'
      });
    } finally {
      setSubmittingRestock(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Product Details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Product Details">
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
            Back to Inventory
          </Button>
        </Box>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout title="Product Details">
        <Alert severity="info">Product not found</Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/inventory')} 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Inventory
        </Button>
      </MainLayout>
    );
  }
  
  const stockStatus = getStockStatus(product.quantity, product.minStockLevel || 10);

  return (
    <MainLayout title={`Product: ${product.name}`}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/inventory')} 
          startIcon={<ArrowBackIcon />}
        >
          Back to Inventory
        </Button>
        
        <Box>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<PointOfSaleIcon />}
            onClick={handleOpenSellDialog}
            disabled={product.quantity === 0}
            sx={{ 
              mr: 2,
              borderRadius: 2,
              px: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            Sell Product
          </Button>
          
          {isAdmin && (
            <>
              <Button 
                variant="outlined"
                color="info"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/inventory/${id}/edit`)}
                sx={{ 
                  mr: 2,
                  borderRadius: 2
                }}
              >
                Edit
              </Button>
              
              <Button 
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDelete(true)}
                sx={{ 
                  borderRadius: 2
                }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Product Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3
          }}>
            <CardContent>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ mb: 2 }}
              >
                <Tab label="Details" />
                <Tab label="Stock History" />
              </Tabs>
              
              <Divider sx={{ mb: 3 }} />
              
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      General Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">SKU</Typography>
                        <Typography variant="body1">{product.sku || 'N/A'}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Category</Typography>
                        <Typography variant="body1">{product.category || 'Uncategorized'}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Description</Typography>
                        <Typography variant="body1">{product.description || 'No description provided'}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Stock Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="bold"
                          color={stockStatus.color}
                        >
                          {product.quantity} {stockStatus.color === 'warning' && <WarningIcon fontSize="small" sx={{ ml: 0.5 }} />}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Minimum Stock</Typography>
                        <Typography variant="body1">{product.minStockLevel || 10}</Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Price</Typography>
                        <Typography variant="body1" fontWeight="bold">${product.price.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Supplier Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Supplier</Typography>
                        <Typography variant="body1">{product.supplierName || 'N/A'}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Contact</Typography>
                        <Typography variant="body1">{product.supplierContact || 'N/A'}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography variant="body1">{product.supplierAddress || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Dates
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body1">{formatDate(product.createdAt)}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1">{formatDate(product.updatedAt)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              
              {tabValue === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          '& th': { fontWeight: 'bold' }
                        }}
                      >
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell align="right">Previous Qty</TableCell>
                        <TableCell align="right">New Qty</TableCell>
                        <TableCell align="right">Change</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.stockHistory?.map((entry, index) => {
                        const change = entry.quantity - entry.previousQuantity;
                        return (
                          <TableRow key={index}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell>{entry.action}</TableCell>
                            <TableCell align="right">{entry.previousQuantity}</TableCell>
                            <TableCell align="right">{entry.quantity}</TableCell>
                            <TableCell 
                              align="right"
                              sx={{ 
                                color: change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                fontWeight: 'bold'
                              }}
                            >
                              {change >= 0 ? `+${change}` : change}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {(!product.stockHistory || product.stockHistory.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No stock history available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3,
            p: 2,
            bgcolor: stockStatus.color === 'error' 
              ? alpha(theme.palette.error.light, 0.1)
              : stockStatus.color === 'warning'
                ? alpha(theme.palette.warning.light, 0.1)
                : alpha(theme.palette.success.light, 0.1),
            border: `1px solid ${alpha(
              stockStatus.color === 'error' 
                ? theme.palette.error.main
                : stockStatus.color === 'warning'
                  ? theme.palette.warning.main
                  : theme.palette.success.main,
              0.2
            )}`
          }}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" gutterBottom>Inventory Status</Typography>
              
              <Box sx={{ 
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: theme.shadows[2],
                my: 2,
                mx: 'auto',
                border: `5px solid ${
                  stockStatus.color === 'error' 
                    ? theme.palette.error.main
                    : stockStatus.color === 'warning'
                      ? theme.palette.warning.main
                      : theme.palette.success.main
                }`
              }}>
                <Typography variant="h4" fontWeight="bold">{product.quantity}</Typography>
                <Typography variant="caption" color="text.secondary">In Stock</Typography>
              </Box>
              
              <Typography 
                variant="body1" 
                fontWeight="bold"
                color={
                  stockStatus.color === 'error' 
                    ? theme.palette.error.main
                    : stockStatus.color === 'warning'
                      ? theme.palette.warning.main
                      : theme.palette.success.main
                }
              >
                {stockStatus.label}
              </Typography>
              
              {stockStatus.color === 'warning' && (
                <Alert severity="warning" sx={{ mt: 2, textAlign: 'left' }}>
                  Stock is below the minimum level ({product.minStockLevel || 10}). Consider restocking soon.
                </Alert>
              )}
              
              {stockStatus.color === 'error' && (
                <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                  This product is out of stock. Please restock to continue sales.
                </Alert>
              )}
            </Box>
          </Card>

          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            p: 2,
          }}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PointOfSaleIcon />}
                onClick={handleOpenSellDialog}
                disabled={product.quantity === 0}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                Sell This Product
              </Button>
              
              {isAdmin && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleOpenRestockDialog}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Restock Product
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Sell Product Dialog */}
      <Dialog 
        open={openSellDialog} 
        onClose={handleCloseSellDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5],
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <PointOfSaleIcon sx={{ mr: 1 }} />
          Process Sale - {product.name}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, px: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Current Stock: <b>{product.quantity}</b> units | Price: <b>${product.price.toFixed(2)}</b> per unit
              </Alert>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={saleData.quantity}
                onChange={handleSaleInputChange}
                error={!!saleErrors.quantity}
                helperText={saleErrors.quantity}
                InputProps={{
                  inputProps: { min: 1, max: product.quantity }
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="totalAmount"
                label="Total Amount"
                fullWidth
                variant="outlined"
                type="number"
                value={(saleData.quantity * product.price).toFixed(2)}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                Customer Information (Optional)
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="customerName"
                label="Customer Name"
                fullWidth
                variant="outlined"
                value={saleData.customerName}
                onChange={handleSaleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="customerContact"
                label="Customer Contact"
                fullWidth
                variant="outlined"
                value={saleData.customerContact}
                onChange={handleSaleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  name="paymentMethod"
                  value={saleData.paymentMethod}
                  onChange={handleSaleInputChange}
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
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={saleData.notes}
                onChange={handleSaleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
          <Button 
            onClick={handleCloseSellDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcessSale}
            variant="contained"
            color="primary"
            disabled={submittingSale}
            sx={{ 
              borderRadius: 2,
              px: 3,
              ml: 1
            }}
            startIcon={submittingSale ? <CircularProgress size={20} /> : <PointOfSaleIcon />}
          >
            {submittingSale ? 'Processing...' : 'Complete Sale'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmDelete} 
        onClose={handleCancelDelete}
        maxWidth="sm"
      >
        <DialogTitle sx={{ 
          pb: 1, 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Confirm Deletion</Typography>
          <IconButton onClick={handleCancelDelete} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete "{product?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelDelete} 
            color="inherit"
            sx={{ mr: 1 }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Delete Product'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Restock Product Dialog */}
      <Dialog 
        open={openRestockDialog} 
        onClose={handleCloseRestockDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5],
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.info.main,
          color: 'white',
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <ShoppingCartIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Restock - {product?.name}</Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleCloseRestockDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity={stockStatus.severity} sx={{ mb: 3 }}>
                Current Stock: <b>{product?.quantity}</b> units | Minimum Required: <b>{product?.minStockLevel || 10}</b> units
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="quantity"
                label="Quantity to Add"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={restockData.quantity}
                onChange={handleRestockInputChange}
                error={!!restockErrors.quantity}
                helperText={restockErrors.quantity}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">New Stock Level</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {Number(product?.quantity) + Number(restockData.quantity)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                placeholder="Optional - Add notes about this restock"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={restockData.notes}
                onChange={handleRestockInputChange}
              />
            </Grid>
            
            {(product?.supplierName || product?.supplierContact) && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, fontWeight: 'medium' }}>
                  Supplier Information
                </Typography>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.7),
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  {product?.supplierName && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Supplier:</strong> {product.supplierName}
                    </Typography>
                  )}
                  
                  {product?.supplierContact && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button 
                        variant="text" 
                        size="small" 
                        startIcon={<CallIcon />}
                        href={`tel:${product.supplierContact}`}
                      >
                        Call
                      </Button>
                      
                      <Button 
                        variant="text" 
                        size="small" 
                        startIcon={<EmailIcon />}
                        href={`mailto:${product.supplierContact}`}
                      >
                        Email
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
          <Button 
            onClick={handleCloseRestockDialog} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcessRestock}
            variant="contained"
            color="info"
            disabled={submittingRestock}
            sx={{ 
              borderRadius: 2,
              px: 3,
              ml: 1
            }}
            startIcon={submittingRestock ? <CircularProgress size={20} /> : <LocalShippingIcon />}
          >
            {submittingRestock ? 'Processing...' : 'Confirm Restock'}
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
    </MainLayout>
  );
};

export default ProductDetails; 