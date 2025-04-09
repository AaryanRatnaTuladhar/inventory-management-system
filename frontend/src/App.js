import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Inventory from './pages/inventory/Inventory';
import ProductDetails from './pages/inventory/ProductDetails';
import ProductEdit from './pages/inventory/ProductEdit';
import Analytics from './pages/analytics/Analytics';
import Sales from './pages/sales/Sales';
import SaleDetails from './pages/sales/SaleDetails';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#4b83fb',
      dark: '#1e4fc7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6d28d9',
      light: '#8b5cf6',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    info: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.03), 0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 6px 8px rgba(0, 0, 0, 0.05), 0px 3px 6px rgba(0, 0, 0, 0.07)',
    '0px 8px 12px rgba(0, 0, 0, 0.06), 0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 10px 14px rgba(0, 0, 0, 0.07), 0px 5px 10px rgba(0, 0, 0, 0.09)',
    '0px 12px 16px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.10)',
    '0px 14px 18px rgba(0, 0, 0, 0.09), 0px 7px 14px rgba(0, 0, 0, 0.11)',
    '0px 16px 20px rgba(0, 0, 0, 0.10), 0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 18px 22px rgba(0, 0, 0, 0.11), 0px 9px 18px rgba(0, 0, 0, 0.13)',
    '0px 20px 24px rgba(0, 0, 0, 0.12), 0px 10px 20px rgba(0, 0, 0, 0.14)',
    '0px 22px 26px rgba(0, 0, 0, 0.13), 0px 11px 22px rgba(0, 0, 0, 0.15)',
    '0px 24px 28px rgba(0, 0, 0, 0.14), 0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 26px 30px rgba(0, 0, 0, 0.15), 0px 13px 26px rgba(0, 0, 0, 0.17)',
    '0px 28px 32px rgba(0, 0, 0, 0.16), 0px 14px 28px rgba(0, 0, 0, 0.18)',
    '0px 30px 34px rgba(0, 0, 0, 0.17), 0px 15px 30px rgba(0, 0, 0, 0.19)',
    '0px 32px 36px rgba(0, 0, 0, 0.18), 0px 16px 32px rgba(0, 0, 0, 0.20)',
    '0px 34px 38px rgba(0, 0, 0, 0.19), 0px 17px 34px rgba(0, 0, 0, 0.21)',
    '0px 36px 40px rgba(0, 0, 0, 0.20), 0px 18px 36px rgba(0, 0, 0, 0.22)',
    '0px 38px 42px rgba(0, 0, 0, 0.21), 0px 19px 38px rgba(0, 0, 0, 0.23)',
    '0px 40px 44px rgba(0, 0, 0, 0.22), 0px 20px 40px rgba(0, 0, 0, 0.24)',
    '0px 42px 46px rgba(0, 0, 0, 0.23), 0px 21px 42px rgba(0, 0, 0, 0.25)',
    '0px 44px 48px rgba(0, 0, 0, 0.24), 0px 22px 44px rgba(0, 0, 0, 0.26)',
    '0px 46px 50px rgba(0, 0, 0, 0.25), 0px 23px 46px rgba(0, 0, 0, 0.27)',
    '0px 48px 52px rgba(0, 0, 0, 0.26), 0px 24px 48px rgba(0, 0, 0, 0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.08)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory/:id/edit" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales" 
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales/:id" 
              element={
                <ProtectedRoute>
                  <SaleDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  {/* Admin component will go here */}
                  <div>Admin Panel</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;