import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProducts, categories } from '@/data/mockData';
import { Search, ShoppingCart, Package, IndianRupee } from 'lucide-react';
import JoinOrderDialog from '@/components/JoinOrderDialog';
import { Product } from '@/types';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Products</h1>
          <p className="text-muted-foreground">Find quality raw materials from verified suppliers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      by {product.supplierName}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {product.description && (
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleJoinOrder(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Join Group Order
                  </Button>
                  <Button variant="outline" size="icon">
                    <Package className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Join Order Dialog */}
        <JoinOrderDialog
          product={selectedProduct}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default Products;