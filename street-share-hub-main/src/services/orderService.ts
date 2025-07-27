import axios from 'axios';
import { getToken } from './authService';

const API_URL = '/api/orders';

export const getOrders = () => axios.get(API_URL, {
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const createOrder = (data: any) => axios.post(API_URL, data, {
  headers: { Authorization: `Bearer ${getToken()}` }
}); 