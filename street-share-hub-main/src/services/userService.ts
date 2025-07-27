import axios from 'axios';
import { getToken } from './authService';

const API_URL = '/api/users';

export const getUsers = () => axios.get(API_URL, {
  headers: { Authorization: `Bearer ${getToken()}` }
}); 