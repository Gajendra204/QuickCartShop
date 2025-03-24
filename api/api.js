import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.13:6000/api/shopkeeper';

export const registerShopkeeper = async data => {
  return axios.post(`${API_BASE_URL}/register`, data);
};

export const loginShopkeeper = async data => {
  return axios.post(`${API_BASE_URL}/login`, data);
};

export const createStore = async data => {
  return axios.post(`${API_BASE_URL}/stores`, data);
};

export const createCategory = async data => {
  return axios.post(`${API_BASE_URL}/categories`, data);
};

export const createItem = async data => {
  return axios.post(`${API_BASE_URL}/items`, data);
};
