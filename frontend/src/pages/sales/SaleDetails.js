import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Grid, Typography, Paper, Divider,
  Card, CardContent, CircularProgress, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Snackbar, alpha, useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await api.sales.getById(id);
        setSale(response.data.sale);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sale:', err);
        setError(err.response?.data?.error || 'Failed to fetch sale details');
        setLoading(false);
      }
    };
    
    fetchSale();
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/sales');
  };
  
  const handleCancelSale = () => {
    setConfirmCancel(true);
  };

  const confirmCancelSale = async () => {
    try {
      setCancelling(true);
      
      await api.sales.cancel(id);
      
      // Update the local state to reflect the cancellation
      setSale(prev => ({
        ...prev,
        status: 'Cancelled'
      }));
      
      setNotification({
        open: true,
        message: 'Sale cancelled successfully',
        severity: 'success'
      });
      
    } catch (err) {
      console.error('Error cancelling sale:', err);
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Failed to cancel sale',
        severity: 'error'
      });
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };
  
  const handleCloseCancelDialog = () => {
    setConfirmCancel(false);
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  const handlePrintReceipt = () => {
    // Implement print functionality here
    window.print();
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

  if (loading) {
    return (
      <MainLayout title="Sale Details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Sale Details">
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
            Back to Sales
          </Button>
        </Box>
      </MainLayout>
    );
  }

  if (!sale) {
    return (
      <MainLayout title="Sale Details">
        <Alert severity="info">Sale record not found</Alert>
        <Button 
          variant="outlined" 
          onClick={handleGoBack} 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Sales
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Sale: ${sale.transactionId}`}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button 
          variant="outlined" 
          onClick={handleGoBack} 
          startIcon={<ArrowBackIcon />}
        >
          Back to Sales
        </Button>
        
        <Box>
          <Button 
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintReceipt}
            sx={{ mr: 2, borderRadius: 2 }}
          >
            Print Receipt
          </Button>
          
          {sale.status !== 'Cancelled' && (
            <Button 
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelSale}
              sx={{ borderRadius: 2 }}
            >
              Cancel Sale
            </Button>
          )}
        </Box>
      </Box>

      {/* Sale Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3
          }}>
            <CardContent>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  mb: 3
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Sale Information
                </Typography>
                <Chip 
                  label={sale.status} 
                  color={getStatusColor(sale.status)}
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                  <Typography variant="body1" fontWeight="medium">{sale.transactionId}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">{formatDate(sale.saleDate)}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body1">{sale.paymentMethod}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(sale.totalAmount)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Product Details
              </Typography>
              
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">{sale.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unit Price: {formatCurrency(sale.unitPrice)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {sale.quantity}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Subtotal: {formatCurrency(sale.unitPrice * sale.quantity)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              {sale.notes && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Notes
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography variant="body2">{sale.notes}</Typography>
                  </Paper>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3,
            overflow: 'hidden'
          }}>
            <Box 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                p: 2
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Customer Information
              </Typography>
            </Box>
            <CardContent>
              {sale.customerName || sale.customerContact ? (
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {sale.customerName || 'Unnamed Customer'}
                  </Typography>
                  
                  {sale.customerContact && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {sale.customerContact}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Walk-in customer (No details provided)
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            mb: 3,
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Box textAlign="center" p={2}>
              <ReceiptIcon 
                sx={{ 
                  fontSize: 48, 
                  color: theme.palette.info.main,
                  mb: 1
                }} 
              />
              <Typography variant="h6" gutterBottom>
                Need a Receipt?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can print a receipt for this transaction or send it via email.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="info"
                startIcon={<PrintIcon />}
                onClick={handlePrintReceipt}
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  mb: 1
                }}
              >
                Print Receipt
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={confirmCancel}
        onClose={handleCloseCancelDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Confirm Cancellation</Typography>
          <IconButton onClick={handleCloseCancelDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
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
            sx={{ mr: 1 }}
            disabled={cancelling}
          >
            No, Keep It
          </Button>
          <Button 
            onClick={confirmCancelSale} 
            variant="contained" 
            color="error"
            startIcon={cancelling ? <CircularProgress size={24} /> : <CancelIcon />}
            disabled={cancelling}
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
    </MainLayout>
  );
};

export default SaleDetails; 