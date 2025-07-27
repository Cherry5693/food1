// src/components/OrderTrackingDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getOrderTracking } from '@/services/orderService';
import { OrderTracking } from '@/types';
import { Calendar, CheckCircle, Clock, Package, Truck, Phone, Loader2, CircleDot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OrderTrackingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    groupOrderId: string;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'open':
        case 'pending':
            return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'closed':
        case 'confirmed':
            return <CheckCircle className="w-5 h-5 text-blue-500" />;
        case 'in_transit':
            return <Truck className="w-5 h-5 text-indigo-500" />;
        case 'delivered':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        default:
            return <CircleDot className="w-5 h-5 text-gray-500" />;
    }
};

const OrderTrackingDialog: React.FC<OrderTrackingDialogProps> = ({ isOpen, onClose, groupOrderId }) => {
    const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            if (!groupOrderId || !isOpen) return;

            setLoading(true);
            setError(null);
            try {
                const res = await getOrderTracking(groupOrderId);
                // The backend response is res.data.data
                setTrackingData(res.data.data);
            } catch (err: any) {
                const errorMsg = err.response?.data?.msg || "Failed to fetch tracking data. Please try again.";
                setError(errorMsg);
                toast({
                    title: "Tracking Error",
                    description: errorMsg,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchTrackingData();
    }, [groupOrderId, isOpen]);

    // Calculate progress based on status (simplified logic)
    const getProgress = (status: string) => {
      switch (status) {
        case 'open':
        case 'pending':
          return 25;
        case 'closed':
        case 'confirmed':
          return 50;
        case 'in_transit':
          return 75;
        case 'delivered':
          return 100;
        default:
          return 0;
      }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Track Order</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-4">
                        <p>{error}</p>
                    </div>
                ) : trackingData ? (
                    <Card className="mt-4 border-none shadow-none">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                {/* FIXED: Use the groupOrderId prop directly */}
                                <CardTitle>Order #{groupOrderId.substring(0, 8)}</CardTitle>
                                <Badge variant="secondary" className="flex items-center space-x-1 capitalize">
                                    {getStatusIcon(trackingData.status)}
                                    <span>{trackingData.status.replace(/_/g, ' ')}</span>
                                </Badge>
                            </div>
                            {/* FIXED: added null check for updatedAt */}
                            <CardDescription>
                                Last updated: {trackingData.updatedAt ? new Date(trackingData.updatedAt).toLocaleString() : 'N/A'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Order Progress</p>
                                <Progress value={getProgress(trackingData.status)} className="h-2" />
                            </div>
                            {/* FIXED: added null check for deliveryDate */}
                            {trackingData.estimatedDelivery && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Estimated Delivery: {new Date(trackingData.estimatedDelivery).toDateString()}
                                    </span>
                                </div>
                            )}
                            {/* ... other content ... */}
                            <div className="space-y-4">
                                <h4 className="font-semibold">Tracking History</h4>
                                <div className="relative pl-6">
                                    <div className="absolute left-1 top-0 bottom-0 w-px bg-border" />
                                    {/* Use optional chaining to safely map over events */}
                                    {trackingData.events?.map((event, index) => (
                                        <div key={index} className="mb-4 relative">
                                            <div className="absolute -left-5 top-0 flex items-center justify-center">
                                                {getStatusIcon(event.status)}
                                            </div>
                                            <div className="pl-6">
                                                <p className="font-medium">{event.status}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                        No tracking information available.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderTrackingDialog;