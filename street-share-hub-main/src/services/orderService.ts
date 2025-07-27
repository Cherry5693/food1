// orderService.ts
import axios from './axiosConfig';
import { GroupOrder, OrderTracking } from '@/types'; // Import OrderTracking type

export const getGroupOrders = async () => {
  return await axios.get<{ data: GroupOrder[] }>('/group-orders');
};

export const createGroupOrder = async (productId: string, targetQty: number, quantity: number) => {
  return await axios.post('/group-orders', { productId, targetQty, quantity });
};

export const joinGroupOrder = async (groupOrderId: string, quantity: number) => {
  return await axios.post('/group-orders/join', { groupOrderId, quantity });
};

// CORRECTED: Removed the redundant '/api' from the path
export const getOrderTracking = (groupOrderId: string) => {
  return axios.get<{ data: OrderTracking }>(`/orders/${groupOrderId}/track`);
};

// CORRECTED: Removed the redundant '/api' from the path
export const modifyGroupOrder = (groupOrderId: string, newQuantity: number) => {
  return axios.put(`/orders/${groupOrderId}/modify`, { quantity: newQuantity });
};