import axios from 'axios';

// Base API URL - change this to match your backend
const API_URL = 'http://localhost:8000';

// Setup axios interceptors for token handling
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
const auth = {
  login: (email, password) => axios.post(`${API_URL}/login`, { email, password }),
  register: (userData) => axios.post(`${API_URL}/register`, userData),
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Products API
const products = {
  getAll: () => axios.get(`${API_URL}/products`),
  getById: (id) => axios.get(`${API_URL}/products/${id}`),
  create: (productData) => axios.post(`${API_URL}/products`, productData),
  update: (id, productData) => axios.put(`${API_URL}/products/${id}`, productData),
  delete: (id) => axios.delete(`${API_URL}/products/${id}`),
  getStats: () => axios.get(`${API_URL}/dashboard/product-stats`)
};

// Categories API
const categories = {
  getAll: () => axios.get(`${API_URL}/categories`),
  create: (name) => axios.post(`${API_URL}/categories`, { name }),
  update: (id, name) => axios.put(`${API_URL}/categories/${id}`, { name }),
  delete: (id) => axios.delete(`${API_URL}/categories/${id}`)
};

// Dashboard API
const dashboard = {
  getStats: () => axios.get(`${API_URL}/dashboard/stats`),
  getLowStockItems: () => axios.get(`${API_URL}/dashboard/low-stock`),
  getRecentActivity: () => axios.get(`${API_URL}/dashboard/activity`)
};

// Analytics API
const analytics = {
  getInventoryTrends: (period) => axios.get(`${API_URL}/analytics/trends`, { params: { period } }),
  getStockForecasting: (productId) => axios.get(`${API_URL}/analytics/forecast/${productId}`)
};

// Notifications API
const notifications = {
  getAll: () => axios.get(`${API_URL}/notifications`),
  markAsRead: (id) => axios.patch(`${API_URL}/notifications/${id}/read`),
  markAllAsRead: () => axios.patch(`${API_URL}/notifications/read-all`)
};

// Users API (admin only)
const users = {
  getAll: () => axios.get(`${API_URL}/users`),
  getById: (id) => axios.get(`${API_URL}/users/${id}`),
  update: (id, userData) => axios.put(`${API_URL}/users/${id}`, userData),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`),
  updateRole: (id, isAdmin) => axios.patch(`${API_URL}/users/${id}/role`, { isAdmin })
};

// Add sales API methods
const sales = {
  getAll: () => axios.get(`${API_URL}/sales`),
  getById: (id) => axios.get(`${API_URL}/sales/${id}`),
  create: (saleData) => axios.post(`${API_URL}/sales`, saleData),
  cancel: (id) => axios.put(`${API_URL}/sales/${id}/cancel`),
  getStats: (params) => axios.get(`${API_URL}/sales/stats`, { params })
};

export default {
  auth,
  products,
  categories,
  dashboard,
  analytics,
  notifications,
  users,
  sales
}; 