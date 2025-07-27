// components/ui/JoinOrderDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Product, GroupOrder } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { IndianRupee, Users, Calendar, Truck } from 'lucide-react';
import { joinGroupOrder, createGroupOrder, getGroupOrders } from '@/services/orderService';

interface JoinOrderDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
}

const JoinOrderDialog: React.FC<JoinOrderDialogProps> = ({ product, isOpen, onClose, onOrderUpdated }) => {
  const [quantity, setQuantity] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [existingOrders, setExistingOrders] = useState<GroupOrder[]>([]);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!product) return;
    try {
      setIsLoading(true);
      const res = await getGroupOrders();
      const orders = res.data.data || [];
      const productOrders = orders.filter((order: GroupOrder) => order.productId === product.id);
      setExistingOrders(productOrders);
    } catch (error: any) {
      console.error("Failed to fetch group orders:", error.response?.data?.msg || error.message);
      toast({ title: "Error", description: error.response?.data?.msg || "Could not load existing group orders.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchOrders();
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleJoinOrder = async (groupOrderId: string) => {
    if (!user || !groupOrderId) {
      toast({
          title: "Error",
          description: "User or order ID is missing.",
          variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    
    try {
      await joinGroupOrder(groupOrderId, quantity);
      
      toast({
        title: "Order Joined Successfully!",
        description: `You've joined the group order for ${quantity}kg of ${product.name}`,
      });
      onOrderUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to join order:', error.response?.data?.msg || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to join order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewOrder = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const targetQty = 100;
      await createGroupOrder(product.id, targetQty, quantity); 

      toast({
        title: "New Group Order Created!",
        description: `You've started a new group order for ${product.name}`,
      });
      onOrderUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to create new order:', error.response?.data?.msg || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to create new order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return quantity * product.pricePerKg;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join Group Order - {product.name}</DialogTitle>
          <DialogDescription>
            Join an existing group order or start a new one to get bulk pricing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {product.name}
                <Badge variant="secondary">{product.category}</Badge>
              </CardTitle>
              <CardDescription>by {product.supplierName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {product.pricePerKg}
                  </span>
                  <span className="text-muted-foreground">/{product.unit}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Min Order</div>
                  <div className="font-semibold">
                    {product.minOrderQty} {product.unit}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity ({product.unit})</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.minOrderQty, parseInt(e.target.value) || 0))}
              min={product.minOrderQty}
            />
            <p className="text-sm text-muted-foreground">
              Minimum order: {product.minOrderQty} {product.unit}
            </p>
          </div>

          <Card className="bg-secondary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <div className="flex items-center space-x-1">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {quantity} {product.unit} × ₹{product.pricePerKg}
              </p>
            </CardContent>
          </Card>

          {existingOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Join Existing Group Orders</h3>
              {existingOrders.map((order) => {
                const progressPercentage = (order.currentQty / order.targetQty) * 100;
                
                return (
                  <Card key={order._id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            Group Order #{order._id.substring(0, 8)} 
                          </CardTitle>
                          <CardDescription>
                            Target: {order.targetQty}kg
                          </CardDescription>
                        </div>
                        <Badge variant={order.status === 'open' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{order.currentQty}kg / {order.targetQty}kg</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {/* This now correctly uses the length of the participants array from your type */}
                          <span>{order.participants.length} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span>Free delivery</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleJoinOrder(order._id)}
                        disabled={isLoading}
                      >
                        Join This Order
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Start New Group Order</h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find a suitable group order? Start your own and let others join!
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCreateNewOrder}
                  disabled={isLoading}
                >
                  Create New Group Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinOrderDialog;