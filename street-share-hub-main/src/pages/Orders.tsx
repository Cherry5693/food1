import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { GroupOrder } from '@/types';
import * as orderService from '../services/orderService';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Users,
  Calendar,
  IndianRupee,
  Package
} from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderService.getOrders();
        setOrders(res.data as GroupOrder[]);
      } catch (err) {
        setOrders([] as GroupOrder[]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders for current user
  const userOrders = orders.filter(order =>
    order.participants?.includes(user?.id || '')
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'delivered':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const OrderCard = ({ order }: { order: GroupOrder }) => {
    const progressPercentage = (order.currentQty / order.targetQty) * 100;
    const userParticipation = order.participants_details?.find(p => p.vendorId === user?.id);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{order.productName}</CardTitle>
              <CardDescription>by {order.supplierName}</CardDescription>
            </div>
            <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Progress</span>
              <span>{order.currentQty}kg / {order.targetQty}kg</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Your Contribution */}
          {userParticipation && (
            <Card className="bg-secondary/20">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Order:</span>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{userParticipation.quantity}kg</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-primary">
                      <IndianRupee className="w-3 h-3" />
                      <span>{(userParticipation.quantity * order.pricePerKg).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{order.participants?.length || 0} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              <span>{order.pricePerKg}/kg</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
            {order.status === 'open' && (
              <Button size="sm" className="flex-1">
                Modify Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const activeOrders = userOrders.filter(order => order.status === 'open');
  const completedOrders = userOrders.filter(order => order.status === 'delivered');
  const processingOrders = userOrders.filter(order => order.status === 'closed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your group orders</p>
        </div>

        {/* Order Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold text-primary">{activeOrders.length}</p>
                </div>
                <Clock className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-accent">{processingOrders.length}</p>
                </div>
                <Package className="w-8 h-8 text-accent/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">Loading orders...</div>
            ) : activeOrders.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-4">
                  Browse products to join or create new group orders
                </p>
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-6">
            {processingOrders.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {processingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No processing orders</h3>
                <p className="text-muted-foreground">
                  Orders being prepared will appear here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {completedOrders.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {completedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No completed orders</h3>
                <p className="text-muted-foreground">
                  Your delivery history will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;