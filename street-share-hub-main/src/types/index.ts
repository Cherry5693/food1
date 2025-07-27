// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'vendor' | 'supplier';
//   location: string;
//   phone?: string;
// }

// export interface Product {
//   id: string;
//   name: string;
//   pricePerKg: number;
//   supplierId: string;
//   supplierName: string;
//   category: string;
//   unit: string;
//   minOrderQty: number;
//   description?: string;
//   imageUrl?: string;
// }

// // CORRECTED: This type now includes _id to match MongoDB and correctly types participants
// export interface GroupOrder {
//   _id: string; // The primary key from MongoDB
//   id?: string; // Optional: To handle any data that might still use 'id'
//   
//   productId: string;
//   productName: string;
//   supplierId: string;
//   supplierName: string;
//   
//   // Your code uses .length on this, so the backend must return an array
//   participants: string[]; 

//   currentQty: number;
//   targetQty: number;
//   pricePerKg: number;
//   status: 'open' | 'closed' | 'delivered';
//   createdAt: string;
//   deliveryDate?: string;
//   participants_details?: { vendorId: string; vendorName: string; quantity: number }[];
// }

// export interface OrderTracking {
//   id: string;
//   groupOrderId: string;
//   status: 'pending' | 'confirmed' | 'in_transit' | 'delivered';
//   deliveryDate?: string;
//   contactNumber?: string;
//   notes?: string;
//   updatedAt: string;
// }

// export interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
//   logout: () => void;
// }
// src/types.ts

// The User type looks good
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'supplier';
  location: string;
  phone?: string;
}

// The Product type looks good
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

// CORRECTED: 'productId' is now a string to resolve the frontend error.
// NOTE: This now mismatches the backend controller, which populates 'productId' with a full Product object.
export interface GroupOrder {
  _id: string;
  id?: string;
  
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

// NEW: Define a type for a single tracking event
export interface OrderTrackingEvent {
  status: string;
  timestamp: Date;
}

// CORRECTED: This type now includes the 'events' and 'estimatedDelivery' properties
// to match the data sent from the backend controller.
export interface OrderTracking {
  id?: string;
  groupOrderId: string;
  
  status: 'open' | 'closed' | 'delivered';

  estimatedDelivery?: string;
  events?: OrderTrackingEvent[];

  deliveryDate?: string;
  contactNumber?: string;
  notes?: string;
  updatedAt: string;
}

// The AuthState type looks good
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}