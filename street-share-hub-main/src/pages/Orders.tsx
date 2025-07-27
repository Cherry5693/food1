// Orders.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { GroupOrder, Product } from '@/types';
import * as orderService from '../services/orderService';
import JoinOrderDialog from '@/components/JoinOrderDialog';
import OrderTrackingDialog from '@/components/OrderTrackingDialog'; 
import ModifyOrderDialog from '@/components/ModifyOrderDialog';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Users,
  Calendar,
  IndianRupee,
  Package,
  Boxes
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Orders = () => {
  function isGroupOrder(order: any): order is GroupOrder {
    return order && typeof order === 'object' && ('_id' in order || 'id' in order);
  }
  function isParticipantObject(p: any): p is { user: string; quantity: number } {
    return p && typeof p === 'object' && 'user' in p && 'quantity' in p;
  }
  
  const { user } = useAuth();
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // State for dialogs
  const [showJoinOrderDialog, setShowJoinOrderDialog] = useState(false);
  const [selectedProductForJoin, setSelectedProductForJoin] = useState<Product | null>(null);
  const [showTrackOrderDialog, setShowTrackOrderDialog] = useState(false);
  const [showModifyOrderDialog, setShowModifyOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GroupOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getGroupOrders();
      const data = (res.data.data as GroupOrder[]) || []; 
      setOrders(data.filter(isGroupOrder));
    } catch (err: any) {
      console.error("Failed to fetch group orders:", err.response?.data?.msg || err.message);
      toast({
        title: "Error fetching orders",
        description: err.response?.data?.msg || "Could not load your orders. Please try again.",
        variant: "destructive"
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const userOrders = orders.filter(order =>
    order.participants?.some(p => {
      if (isParticipantObject(p)) {
        return p.user === user?.id;
      }
      return p === user?.id;
    })
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

  const handleTrackOrderClick = (order: GroupOrder) => {
    setSelectedOrder(order);
    setShowTrackOrderDialog(true);
  };
  const handleModifyOrderClick = (order: GroupOrder) => {
    setSelectedOrder(order);
    setShowModifyOrderDialog(true);
  };
  
  const OrderCard = ({ order }: { order: GroupOrder }) => {
    const progressPercentage = (order.currentQty / order.targetQty) * 100;
    const userParticipation = order.participants?.find(p => {
      if (isParticipantObject(p)) {
        return p.user === user?.id;
      }
      return p === user?.id;
    });
    
    return (
      <Card key={order._id || (order as any).id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">{order.productName}</CardTitle>
            <CardDescription className="text-sm">by {order.supplierName}</CardDescription>
          </div>
          <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">Order Progress</span>
              <span className="font-semibold text-foreground">{order.currentQty}kg / {order.targetQty}kg</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground border-t border-dashed pt-4">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4" />
              <span>Price: <span className="font-semibold text-foreground">{order.pricePerKg}/kg</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Members: <span className="font-semibold text-foreground">{order.participants?.length || 0}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Delivery Date: <span className="font-semibold text-foreground">{order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
          
          {userParticipation && isParticipantObject(userParticipation) && (
            <div className="border border-dashed p-4 rounded-md bg-muted/30">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-primary">
                  <Boxes className="w-4 h-4" />
                  <span className="font-semibold">Your Contribution</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1 font-bold text-lg text-foreground">
                    <span>{userParticipation.quantity}kg</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <IndianRupee className="w-3 h-3" />
                    <span>{(userParticipation.quantity * (order.pricePerKg || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleTrackOrderClick(order)}
            >
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
            {order.status === 'open' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleModifyOrderClick(order)}
              >
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
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your group orders</p>
        </div>

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
                  <OrderCard key={order._id || (order as any).id} order={order} />
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
                  <OrderCard key={order._id || (order as any).id} order={order} />
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
                  <OrderCard key={order._id || (order as any).id} order={order} />
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

      <JoinOrderDialog
        product={selectedProductForJoin}
        isOpen={showJoinOrderDialog}
        onClose={() => setShowJoinOrderDialog(false)}
        onOrderUpdated={fetchOrders}
      />
      <OrderTrackingDialog
        isOpen={showTrackOrderDialog}
        onClose={() => setShowTrackOrderDialog(false)}
        groupOrderId={selectedOrder?._id || ''}
      />
      <ModifyOrderDialog
        isOpen={showModifyOrderDialog}
        onClose={() => setShowModifyOrderDialog(false)}
        order={selectedOrder}
        onOrderUpdated={fetchOrders}
      />
    </div>
  );
};

export default Orders;