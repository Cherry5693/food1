import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    pricePerKg: '',
    category: '',
    unit: 'kg',
    minOrderQty: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const categories = [
    'Vegetables',
    'Grains',
    'Oils',
    'Spices',
    'Dairy',
    'Pulses',
    'Condiments',
    'Other'
  ];

  const units = [
    'kg',
    'litre',
    'piece',
    'packet',
    'box'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Product Added Successfully!",
        description: `${formData.name} has been added to your product catalog`,
      });
      
      // Reset form
      setFormData({
        name: '',
        pricePerKg: '',
        category: '',
        unit: 'kg',
        minOrderQty: '',
        description: ''
      });
      
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      pricePerKg: '',
      category: '',
      unit: 'kg',
      minOrderQty: '',
      description: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your supplier catalog
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              type="text"
              placeholder="e.g., Fresh Onions"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per {formData.unit} (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.pricePerKg}
                onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrder">Min Order Qty *</Label>
              <Input
                id="minOrder"
                type="number"
                placeholder="10"
                value={formData.minOrderQty}
                onChange={(e) => handleInputChange('minOrderQty', e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your product..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;