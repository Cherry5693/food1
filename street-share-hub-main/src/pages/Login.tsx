import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShoppingCart } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'raj@vendor.com', password: 'password', role: 'Vendor (Raj Sharma)' },
    { email: 'priya@supplier.com', password: 'password', role: 'Supplier (Priya Suppliers)' },
    { email: 'amit@vendor.com', password: 'password', role: 'Vendor (Amit Kumar)' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your VendorConnect account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left p-2 h-auto"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
              >
                <div>
                  <div className="text-sm font-medium">{cred.role}</div>
                  <div className="text-xs text-muted-foreground">{cred.email}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;