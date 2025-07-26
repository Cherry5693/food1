import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, LogOut, Package, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">VendorConnect</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/products') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Browse Products
              </Link>
              
              {user?.role === 'vendor' && (
                <Link
                  to="/orders"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/orders') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Orders
                </Link>
              )}
              
              {user?.role === 'supplier' && (
                <Link
                  to="/supplier"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/supplier') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Supplier Dashboard
                </Link>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-muted-foreground capitalize">{user?.role}</div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Mobile navigation items */}
                  <div className="md:hidden">
                    <DropdownMenuItem asChild>
                      <Link to="/products" className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Browse Products
                      </Link>
                    </DropdownMenuItem>
                    
                    {user?.role === 'vendor' && (
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {user?.role === 'supplier' && (
                      <DropdownMenuItem asChild>
                        <Link to="/supplier" className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Supplier Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                  </div>

                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;