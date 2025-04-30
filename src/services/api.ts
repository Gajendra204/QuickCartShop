import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'https://quickcart-bdxm.onrender.com/api/shopkeeper';
const API_BASE_URL = 'http://192.168.13.222:6000/api/shopkeeper';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to include the token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired - clear storage and redirect to login
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        // You might want to use navigation here to redirect to login
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
      }
    }
    return Promise.reject(error);
  }
);

export const shopkeeperService = {
  // Authentication
  register: async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/register', data);
      return response;
    } catch (error) {
      handleApiError(error, 'Registration failed');
      throw error;
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', data);
      return response;
    } catch (error) {
      handleApiError(error, 'Login failed');
      throw error;
    }
  },

  // Store operations
  createStore: async (data: { name: string; address: string; shopkeeper: { id: string } }) => {
    try {
      const response = await api.post('/stores', data);
      return response;
    } catch (error) {
      handleApiError(error, 'Create store failed');
      throw error;
    }
  },

  getStores: async () => {
    try {
      const response = await api.get('/stores');
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch stores failed');
      throw error;
    }
  },

  getStoreById: async (id: string) => {
    try {
      const response = await api.get(`/stores/${id}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch store failed');
      throw error;
    }
  },

  updateStore: async (storeId: string, data: { name: string; address: string }) => {
    try {
      // Add shopkeeper data to the update request
      const response = await api.put(`/stores/${storeId}`, data);
      return response;
    } catch (error) {
      handleApiError(error, 'Update store failed');
      throw error;
    }
  },

  deleteStore: async (storeId: string) => {
    try {
      const response = await api.delete(`/stores/${storeId}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Delete store failed');
      throw error;
    }
  },

  // Category operations
  createCategory: async (data: { name: string; store: string }) => {
    try {
      const response = await api.post('/categories', data);
      return response;
    } catch (error) {
      handleApiError(error, 'Create category failed');
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch categories failed');
      throw error;
    }
  },

  getCategoryById: async (id: string) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch category failed');
      throw error;
    }
  },

  getCategoriesByStore: async (storeId: string) => {
    try {
      const response = await api.get(`/stores/${storeId}/categories`);
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch categories by store failed');
      throw error;
    }
  },

  updateCategory: async (categoryId: string, data: { name: string; store: string }) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, data);
      return response;
    } catch (error) {
      handleApiError(error, 'Update category failed');
      throw error;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Delete category failed');
      throw error;
    }
  },

  // Item operations
  createItem: async (data: { 
    name: string; 
    description: string; 
    mrp: number; 
    discount: number; 
    category: string; 
    store: string 
  }) => {
    try {
      const response = await api.post('/items', data);
      return response;
    } catch (error) {
      handleApiError(error, 'Create item failed');
      throw error;
    }
  },

  getItems: async () => {
    try {
      const response = await api.get('/items');
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch items failed');
      throw error;
    }
  },

  getItemById: async (id: string) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch item failed');
      throw error;
    }
  },

  getItemsByCategory: async (categoryId: string) => {
    try {
      const response = await api.get(`/categories/${categoryId}/items`);
      return response;
    } catch (error) {
      handleApiError(error, 'Fetch items by category failed');
      throw error;
    }
  },

  updateItem: async (itemId: string, data: {
    name: string;
    description: string;
    mrp: number;
    discount: number;
    category: string;
    store: string;
  }) => {
    try {
      const response = await api.put(`/items/${itemId}`, data);
      return response;
    } catch (error) {
      handleApiError(error, 'Update item failed');
      throw error;
    }
  },

  deleteItem: async (itemId: string) => {
    try {
      const response = await api.delete(`/items/${itemId}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Delete item failed');
      throw error;
    }
  },

  // Order operations
  getAllOrders: async () => {
    try {
      console.log('Making GET request to /orders');
      const token = await AsyncStorage.getItem('token');
      console.log('Token available:', !!token); // Debug log
      
      const response = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Orders API raw response:', response.data);
      return response;
    } catch (error) {
      console.error('getAllOrders error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      // Validate orderId format
      const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);
      if (!isValidObjectId(orderId)) {
        throw new Error(`Invalid orderId format: ${orderId}`);
      }

      // Validate status value
      const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status value: ${status}`);
      }

      const response = await api.patch(`/orders/${orderId}`, { status });
      return response;
    } catch (error) {
      handleApiError(error, 'Update order status failed');
      throw error;
    }
  },
 };

// Helper function for consistent error handling
function handleApiError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  
  if (axios.isAxiosError(error)) {
    console.error("Axios error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // You could add additional handling based on status code
    if (error.response?.status === 401) {
      console.error("Authentication error - redirect to login");
    }
  }
}