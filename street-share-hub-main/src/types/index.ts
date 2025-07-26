export interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'supplier';
  location: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  supplierId: string;
  supplierName: string;
  category: string;
  unit: string;
  minOrderQty: number;
  description?: string;
  imageUrl?: string;
}

export interface GroupOrder {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  participants: string[];
  currentQty: number;
  targetQty: number;
  pricePerKg: number;
  status: 'open' | 'closed' | 'delivered';
  createdAt: string;
  deliveryDate?: string;
  participants_details?: { vendorId: string; vendorName: string; quantity: number }[];
}

export interface OrderTracking {
  id: string;
  groupOrderId: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered';
  deliveryDate?: string;
  contactNumber?: string;
  notes?: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}