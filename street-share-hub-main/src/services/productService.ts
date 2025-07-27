import axios from 'axios';
import { getToken } from './authService';

const API_URL = '/api/products';

export const getProducts = () => axios.get(API_URL);

export const createProduct = (data: any) => axios.post(API_URL, data, {
  headers: { Authorization: `Bearer ${getToken()}` }
}); 