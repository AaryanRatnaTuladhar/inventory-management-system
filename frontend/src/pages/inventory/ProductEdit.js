import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Grid, Typography, Paper, Divider,
  TextField, CircularProgress, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent,
  alpha, useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    minStockLevel: '',
    sku: '',
    supplierName: '',
    supplierContact: '',
    supplierAddress: ''
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/inventory');
    }
  }, [isAdmin, navigate]);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.products.getById(id);
        
        // Set form data from product details
        setFormData({
          name: response.data.product.name || '',
          category: response.data.product.category || '',
          description: response.data.product.description || '',
          price: response.data.product.price || '',
          quantity: response.data.product.quantity || '',
          minStockLevel: response.data.product.minStockLevel || '',
          sku: response.data.product.sku || '',
          supplierName: response.data.product.supplierName || '',
          supplierContact: response.data.product.supplierContact || '',
          supplierAddress: response.data.product.supplierAddress || ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.error || 'Failed to fetch product details');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!formData.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
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
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minStockLevel: formData.minStockLevel ? Number(formData.minStockLevel) : 10
      };
      
      await api.products.update(id, productToUpdate);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Product updated successfully',
        severity: 'success'
      });
      
      // Redirect back to product details after a short delay
      setTimeout(() => {
        navigate(`/inventory/${id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating product:', err);
      
      // Show error notification
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to update product',
        severity: 'error'
      });
      setSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    navigate(`/inventory/${id}`);
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  if (loading) {
    return (
      <MainLayout title="Edit Product">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Edit Product">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button 
          variant="outlined" 
          onClick={handleGoBack} 
          startIcon={<ArrowBackIcon />}
        >
          Back to Product
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Edit Product
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Basic Information
              </Typography>
              
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  mb: 3
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="Product Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="sku"
                      label="SKU"
                      fullWidth
                      value={formData.sku}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="category"
                      label="Category"
                      fullWidth
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      error={!!formErrors.category}
                      helperText={formErrors.category}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Inventory Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Inventory Information
              </Typography>
              
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  mb: 3
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="price"
                      label="Price (USD)"
                      fullWidth
                      required
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      fullWidth
                      required
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      error={!!formErrors.quantity}
                      helperText={formErrors.quantity}
                      InputProps={{
                        inputProps: { min: 0, step: 1 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="minStockLevel"
                      label="Minimum Stock Level"
                      fullWidth
                      type="number"
                      value={formData.minStockLevel}
                      onChange={handleInputChange}
                      InputProps={{
                        inputProps: { min: 0, step: 1 }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Supplier Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Supplier Information
              </Typography>
              
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  mb: 3
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="supplierName"
                      label="Supplier Name"
                      fullWidth
                      value={formData.supplierName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="supplierContact"
                      label="Supplier Contact"
                      fullWidth
                      value={formData.supplierContact}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      name="supplierAddress"
                      label="Supplier Address"
                      fullWidth
                      value={formData.supplierAddress}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 3
            }}
          >
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{ mr: 2, borderRadius: 2 }}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
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

export default ProductEdit; 