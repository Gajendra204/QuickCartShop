import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://192.168.1.13:6000/api/shopkeeper';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(async(config) => {
  const token =  await AsyncStorage.getItem('token'); // or use AsyncStorage for mobile
  if (token) {
    console.log("coming here", token);
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("config", config);
  
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      const { logout } = useAuth();
      await logout();
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export const shopkeeperService = {
  register: async (data: { name: string; email: string; password: string }) => {
    try {
      console.log("Register request data:", data);
      const response = await api.post('/register', data);
      console.log("Register response:", response);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
      throw error;
    }
  },
    
  
  login: async  (data:{ email: string; password: string }) => {
    try {
    
      const response = await api.post('/login', data);
      console.log("aja re", response)
      return response;
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
      throw error;
    }
 
  },
  
  createStore:  async (data: { name: string; address: string; shopkeeper: { id: string } }) => 
  {
    try{
      console.log("create store data", data);
      
      const response = await api.post('/stores', data)
      return response;
    }
     catch(error){
      console.error("create store error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
      throw error;
     }

  },
  
  createCategory:  async (data: { name: string; store: string }) =>
  {
    try {
      const response = await api.post('/categories', data)
      return response;
    } catch (error) {
      console.error("Register error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
      throw error;
     }
  },
    
  
  createItem: (data: { 
    name: string; 
    description: string; 
    mrp: number; 
    discount: number; 
    category: string; 
    store: string 
  }) => api.post('/items', data),
};
