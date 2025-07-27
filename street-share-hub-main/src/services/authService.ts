import axios from 'axios';

const API_URL = '/api';

export const register = (data: any) => axios.post(`${API_URL}/register`, data);
export const login = (data: any) => axios.post(`${API_URL}/login`, data);

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => localStorage.getItem('token');

export const removeToken = () => {
  localStorage.removeItem('token');
}; 