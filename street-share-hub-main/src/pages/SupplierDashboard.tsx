import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProducts, mockGroupOrders } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  TrendingUp, 
  Users, 
  IndianRupee,
  Plus,
  Calendar,
  Truck,
  Clock,
  CheckCircle
} from 'lucide-react';
import AddProductDialog from '@/components/AddProductDialog';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Filter data for current supplier
  const supplierProducts = mockProducts.filter(product => product.supplierId === user?.id);
  const supplierOrders = mockGroupOrders.filter(order => order.supplierId === user?.id);

  const activeOrders = supplierOrders.filter(order => order.status === 'open');
  const processingOrders = supplierOrders.filter(order => order.status === 'closed');
  const completedOrders = supplierOrders.filter(order => order.status === 'delivered');

  const totalRevenue = supplierOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.currentQty * order.pricePerKg), 0);

  const OrderCard = ({ order }: { order: any }) => {
    const progressPercentage = (order.currentQty / order.targetQty) * 100;
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{order.productName}</CardTitle>
              <CardDescription>Order #{order.id}</CardDescription>
            </div>
            <Badge variant={order.status === 'open' ? 'default' : order.status === 'closed' ? 'secondary' : 'outline'}>
              {order.status === 'open' ? 'Collecting Orders' : 
               order.status === 'closed' ? 'Ready to Ship' : 'Delivered'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{order.currentQty}kg / {order.targetQty}kg</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{order.participants.length} vendors</span>
            </div>
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              <span>{(order.currentQty * order.pricePerKg).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>{order.pricePerKg}/kg</span>
            </div>
          </div>

          {/* Participants List */}
          {order.participants_details && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Participants:</p>
              <div className="space-y-1">
                {order.participants_details.map((participant: any) => (
                  <div key={participant.vendorId} className="flex justify-between text-sm bg-secondary/20 p-2 rounded">
                    <span>{participant.vendorName}</span>
                    <span className="font-medium">{participant.quantity}kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {order.status === 'open' && (
              <Button size="sm" className="flex-1">
                Close Order
              </Button>
            )}
            {order.status === 'closed' && (
              <Button size="sm" className="flex-1">
                <Truck className="w-4 h-4 mr-2" />
                Mark as Shipped
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProductCard = ({ product }: { product: any }) => {
    const productOrders = supplierOrders.filter(order => order.productId === product.id);
    const totalSold = productOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.currentQty, 0);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </div>
            <Badge variant="secondary">{product.unit}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold text-primary">{product.pricePerKg}</span>
              <span className="text-muted-foreground">/{product.unit}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Sold</div>
              <div className="font-semibold">{totalSold}kg</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Min Order:</span>
              <div className="font-medium">{product.minOrderQty} {product.unit}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Active Orders:</span>
              <div className="font-medium">{productOrders.filter(o => o.status === 'open').length}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Edit Product
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and orders</p>
          </div>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-primary">{supplierProducts.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold text-accent">{activeOrders.length}</p>
                </div>
                <Clock className="w-8 h-8 text-accent/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-orange-600">{processingOrders.length}</p>
                </div>
                <Truck className="w-8 h-8 text-orange-600/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="products">Products ({supplierProducts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-6">
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Orders</h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Orders */}
              {processingOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ready to Ship</h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {processingOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {supplierOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Orders for your products will appear here
                  </p>
                  <Button onClick={() => setShowAddProduct(true)}>
                    Add Your First Product
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            {supplierProducts.length > 0 ? (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {supplierProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products added</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first product to the marketplace
                </p>
                <Button onClick={() => setShowAddProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Product Dialog */}
        <AddProductDialog
          isOpen={showAddProduct}
          onClose={() => setShowAddProduct(false)}
        />
      </div>
    </div>
  );
};

export default SupplierDashboard;