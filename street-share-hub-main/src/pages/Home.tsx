import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Users, TrendingUp, Shield, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Group Orders",
      description: "Join with other vendors to get better bulk pricing on raw materials"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Suppliers",
      description: "All suppliers are verified for quality and reliability"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Delivery",
      description: "Fast and reliable delivery to your location"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Local Network",
      description: "Connect with suppliers and vendors in your area"
    }
  ];

  const stats = [
    { label: "Active Vendors", value: "1,200+" },
    { label: "Verified Suppliers", value: "350+" },
    { label: "Successful Orders", value: "15,000+" },
    { label: "Cities Covered", value: "50+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Connect. Order. <span className="text-primary">Grow.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The digital platform that connects street food vendors with trusted suppliers 
              for bulk raw material orders across India.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow">
                  <Link to="/products">Browse Products</Link>
                </Button>
                {user?.role === 'vendor' && (
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/orders">My Orders</Link>
                  </Button>
                )}
                {user?.role === 'supplier' && (
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/supplier">Supplier Dashboard</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose VendorConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy for street food vendors to source quality ingredients at competitive prices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-muted-foreground">
                Browse quality raw materials from verified suppliers in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Group Orders</h3>
              <p className="text-muted-foreground">
                Join existing group orders or start new ones to get bulk pricing benefits
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Delivered</h3>
              <p className="text-muted-foreground">
                Track your order and receive fresh ingredients at your location
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of vendors and suppliers already using VendorConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Join as Vendor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/register">Join as Supplier</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;