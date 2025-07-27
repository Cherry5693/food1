import axios from './axiosConfig'; // This file now exists
import { GroupOrder } from '@/types';

// The return type is inferred by TypeScript, which is often sufficient
// to prevent the error in the consuming component.
export const getGroupOrders = async () => {
  return await axios.get<{ data: GroupOrder[] }>('/group-orders');
};

export const createGroupOrder = async (productId: string, targetQty: number, quantity: number) => {
  return await axios.post('/group-orders', { productId, targetQty, quantity });
};

export const joinGroupOrder = async (groupOrderId: string, quantity: number) => {
  return await axios.post('/group-orders/join', { groupOrderId, quantity });
};