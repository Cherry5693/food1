import { Product, GroupOrder } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Onions',
    pricePerKg: 25,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Vegetables',
    unit: 'kg',
    minOrderQty: 10,
    description: 'Premium quality red onions, directly from farms',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '2',
    name: 'Basmati Rice',
    pricePerKg: 85,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Grains',
    unit: 'kg',
    minOrderQty: 25,
    description: 'Premium basmati rice, 1121 variety',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '3',
    name: 'Cooking Oil (Sunflower)',
    pricePerKg: 140,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Oils',
    unit: 'litre',
    minOrderQty: 5,
    description: 'Pure sunflower oil, 15L cans available',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    pricePerKg: 35,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Vegetables',
    unit: 'kg',
    minOrderQty: 10,
    description: 'Fresh red tomatoes, grade A quality',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '5',
    name: 'Turmeric Powder',
    pricePerKg: 220,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Spices',
    unit: 'kg',
    minOrderQty: 2,
    description: 'Pure turmeric powder, organic certified',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '6',
    name: 'Red Chili Powder',
    pricePerKg: 280,
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    category: 'Spices',
    unit: 'kg',
    minOrderQty: 2,
    description: 'Premium red chili powder, medium spice level',
    imageUrl: '/api/placeholder/300/200'
  }
];

export const mockGroupOrders: GroupOrder[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Fresh Onions',
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    participants: ['1', '3'],
    currentQty: 35,
    targetQty: 100,
    pricePerKg: 25,
    status: 'open',
    createdAt: '2024-01-20T10:00:00Z',
    deliveryDate: '2024-01-25T00:00:00Z',
    participants_details: [
      { vendorId: '1', vendorName: 'Raj Sharma', quantity: 20 },
      { vendorId: '3', vendorName: 'Amit Kumar', quantity: 15 }
    ]
  },
  {
    id: '2',
    productId: '2',
    productName: 'Basmati Rice',
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    participants: ['1'],
    currentQty: 50,
    targetQty: 200,
    pricePerKg: 85,
    status: 'open',
    createdAt: '2024-01-21T14:30:00Z',
    deliveryDate: '2024-01-28T00:00:00Z',
    participants_details: [
      { vendorId: '1', vendorName: 'Raj Sharma', quantity: 50 }
    ]
  },
  {
    id: '3',
    productId: '3',
    productName: 'Cooking Oil (Sunflower)',
    supplierId: '2',
    supplierName: 'Priya Suppliers',
    participants: ['3'],
    currentQty: 20,
    targetQty: 50,
    pricePerKg: 140,
    status: 'open',
    createdAt: '2024-01-22T09:15:00Z',
    deliveryDate: '2024-01-30T00:00:00Z',
    participants_details: [
      { vendorId: '3', vendorName: 'Amit Kumar', quantity: 20 }
    ]
  }
];

export const categories = [
  'All',
  'Vegetables',
  'Grains',
  'Oils',
  'Spices',
  'Dairy',
  'Pulses'
];