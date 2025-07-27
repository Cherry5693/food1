// src/components/ui/ModifyOrderDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GroupOrder } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { modifyGroupOrder } from '@/services/orderService';

interface ModifyOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: GroupOrder | null;
    onOrderUpdated: () => void;
}

const ModifyOrderDialog: React.FC<ModifyOrderDialogProps> = ({ isOpen, onClose, order, onOrderUpdated }) => {
    const { user } = useAuth();
    const currentUserQuantity = order?.participants_details?.find(p => p.vendorId === user?.id)?.quantity || 0;
    const [newQuantity, setNewQuantity] = useState(currentUserQuantity);
    const [isLoading, setIsLoading] = useState(false);

    const handleModify = async () => {
        if (!order || !user || newQuantity === currentUserQuantity) {
            onClose();
            return;
        }

        setIsLoading(true);
        try {
            await modifyGroupOrder(order._id, newQuantity);
            toast({
                title: "Order Modified",
                description: `Your quantity for ${order.productName} has been updated to ${newQuantity}kg.`,
            });
            onOrderUpdated();
            onClose();
        } catch (error: any) {
            console.error('Failed to modify order:', error.response?.data?.msg || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.msg || "Failed to modify order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modify Order</DialogTitle>
                    <DialogDescription>
                        Update your quantity for the group order of **{order.productName}**.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-qty" className="text-right">
                            Current Qty
                        </Label>
                        <Input id="current-qty" value={currentUserQuantity} className="col-span-3" disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-qty" className="text-right">
                            New Qty
                        </Label>
                        <Input
                            id="new-qty"
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                            className="col-span-3"
                            min={1}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleModify} disabled={isLoading || newQuantity <= 0 || newQuantity === currentUserQuantity}>
                        {isLoading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModifyOrderDialog;