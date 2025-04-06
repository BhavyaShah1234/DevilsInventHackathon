import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">McPathface</h1>
          <p className="text-lg text-muted-foreground">
            Aerospace Inspection and RPA Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="user" onValueChange={(value) => setRole(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    variant="link"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-sm text-blue-500"
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : `Sign in as ${role === 'admin' ? 'Admin' : 'User'}`}
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 text-blue-500"
                  onClick={() => navigate('/register')}
                  disabled={isLoading}
                >
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 