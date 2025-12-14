import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Shield, Users, Binoculars, Loader2, Building, Trees } from 'lucide-react';
import { toast } from 'sonner';

// Import your apiService
import { apiService } from '../services/apiService';

export function StaffLogin({ onLogin, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [serverUp, setServerUp] = useState(true);
  const [serverMessage, setServerMessage] = useState('');
  const [loginResponse, setLoginResponse] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      console.log('Login response:', response);
      setLoginResponse(response);
      setLoginError(null);
      
      // Store token and user data in localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Verify token works by fetching profile
      try {
        const profile = await apiService.getProfile();
        console.log('Profile fetched after login:', profile);
      } catch (err) {
        console.error('Profile fetch failed after login:', err);
        toast.error('Login succeeded but profile fetch failed. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Determine the role for the frontend (mapping database role to frontend role)
      const frontendRole = response.user.role === 'kruger_staff' ? 'kruger-staff' : response.user.role;
      
      toast.success(`Welcome ${response.user.name || (frontendRole === 'admin' ? 'Administrator' : 'Kruger Staff')}`);
      onLogin(frontendRole);
    } catch (error) {
      console.error('Login error:', error);
        setLoginError(error);
        setLoginResponse(null);
      const message = error?.message || 'Login failed: Invalid email or password';
      if (message.toLowerCase().includes('network')) {
        toast.error('Unable to connect to backend. Please ensure the server is running.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = role === 'admin' 
      ? { email: 'admin@gatewaydiscoveries.com', password: 'admin123' }
      : { email: 'ranger@kruger.co.za', password: 'kruger123' };

    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    
    setIsLoading(true);

    try {
      const response = await apiService.login(demoCredentials);
      console.log('Demo login response:', response);
      setLoginResponse(response);
      setLoginError(null);
      
      // Store token and user data in localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

        // Verify token works by fetching profile
        try {
          const profile = await apiService.getProfile();
          console.log('Profile fetched after demo login:', profile);
        } catch (err) {
          console.error('Profile fetch failed after demo login:', err);
          toast.error('Login succeeded but profile fetch failed. Please try again.');
          setIsLoading(false);
          return;
        }
      
      // Determine the role for the frontend
      const frontendRole = response.user.role === 'kruger_staff' ? 'kruger-staff' : response.user.role;
      
      toast.success(`Welcome ${response.user.name || (frontendRole === 'admin' ? 'Administrator' : 'Kruger Staff')}`);
      onLogin(frontendRole);
    } catch (error) {
      console.error('Demo login error:', error);
        setLoginError(error);
        setLoginResponse(null);
      const message = error?.message || 'Demo login failed. Please try manual login.';
      if (message.toLowerCase().includes('network')) {
        toast.error('Unable to connect to backend. Please ensure the server is running.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update the tab change to clear form
  const handleTabChange = (value) => {
    setActiveTab(value);
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await apiService.health();
        if (!mounted) return;
        setServerUp(true);
        setServerMessage(res.message || 'Backend online');
      } catch (err) {
        if (!mounted) return;
        setServerUp(false);
        setServerMessage(err.message || 'Server unavailable');
        console.error('Backend health check failed:', err);
      }
    };

    checkHealth();

    return () => { mounted = false; };
  }, []);

  // Render the appropriate form based on activeTab
  const renderLoginForm = () => {
    if (activeTab === 'admin') {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Administrator Portal</h3>
            <p className="text-sm text-muted-foreground">System management and analytics</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-email" className="text-sm font-medium">Email Address</Label>
              <Badge variant="outline" className="text-xs bg-blue-50">Administrator</Badge>
            </div>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@gatewaydiscoveries.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full text-sm sm:text-base bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Access Admin Portal'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm sm:text-base border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Use Demo Admin Account'
              )}
            </Button>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-800 text-center">
              <strong>Full system access</strong> • Content management • Analytics dashboard • User management
            </p>
          </div>
        </form>
      );
    } else {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
              <Trees className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Ranger Portal</h3>
            <p className="text-sm text-muted-foreground">Wildlife tracking and park management</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="kruger-email" className="text-sm font-medium">Email Address</Label>
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">Park Ranger</Badge>
            </div>
            <Input
              id="kruger-email"
              type="email"
              placeholder="ranger@kruger.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kruger-password" className="text-sm font-medium">Password</Label>
            <Input
              id="kruger-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full text-sm sm:text-base bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Access Ranger Portal'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm sm:text-base border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => handleDemoLogin('kruger-staff')}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Use Demo Ranger Account'
              )}
            </Button>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-green-800 text-center">
              <strong>Wildlife management</strong> • Animal tracking • Sighting reports • Park operations
            </p>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl">Staff Access Portal</h1>
            <Badge className={`${serverUp ? 'bg-green-600' : 'bg-red-600'} text-white text-xs py-1 px-2 rounded`}>
              {serverUp ? 'Backend Online' : 'Backend Offline'}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Gateway Discoveries - Mpumalanga</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="p-4 sm:p-6 text-center">
            <CardTitle className="text-lg sm:text-xl">Select Access Level</CardTitle>
            <CardDescription className="text-sm">
              Choose your role and sign in to the appropriate portal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Portal Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant={activeTab === 'admin' ? 'default' : 'outline'}
                onClick={() => handleTabChange('admin')}
                className={`text-sm h-12 ${activeTab === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                disabled={isLoading}
              >
                <Building className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
              <Button
                variant={activeTab === 'kruger' ? 'default' : 'outline'}
                onClick={() => handleTabChange('kruger')}
                className={`text-sm h-12 ${activeTab === 'kruger' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={isLoading}
              >
                <Trees className="h-4 w-4 mr-2" />
                Ranger Portal
              </Button>
            </div>

            {/* Dynamic Login Form */}
            <div className="animate-in fade-in duration-300">
              {renderLoginForm()}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground bg-white">Quick Access</span>
              </div>
            </div>

            {/* Quick Demo Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setActiveTab('admin');
                  handleDemoLogin('admin');
                }}
                disabled={isLoading}
              >
                Quick Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  setActiveTab('kruger');
                  handleDemoLogin('kruger-staff');
                }}
                disabled={isLoading}
              >
                Quick Ranger Demo
              </Button>
            </div>

            <div className="mt-6">
              <Button 
                variant="ghost" 
                className="w-full text-sm border" 
                onClick={onCancel}
                disabled={isLoading}
              >
                ← Return to Public Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Debug</h4>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('user');
                  setLoginResponse(null);
                  setLoginError(null);
                  toast('Session cleared');
                }}
              >
                Clear Session
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(s => !s)}
              >
                {showDebug ? 'Hide' : 'Show'} Debug
              </Button>
            </div>
          </div>

          {showDebug && (
            <div className="bg-white/80 rounded-xl p-3 border">
              <p className="text-xs text-muted-foreground mb-2">Backend: <strong>{serverUp ? 'Online' : 'Offline'}</strong> — {serverMessage}</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <div className="font-semibold">Last Login Response</div>
                  <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded mt-1">{loginResponse ? JSON.stringify(loginResponse, null, 2) : '—'}</pre>
                </div>
                <div>
                  <div className="font-semibold">Last Error</div>
                  <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded mt-1">{loginError ? (loginError.message || JSON.stringify(loginError, null, 2)) : '—'}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border">
            <h4 className="text-sm font-semibold text-center mb-3">Demo Credentials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-3 w-3 text-blue-600" />
                  <span className="font-semibold text-blue-800">Admin Portal</span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs bg-white p-1 rounded border">admin@gatewaydiscoveries.com</p>
                  <p className="font-mono text-xs bg-white p-1 rounded border">admin123</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trees className="h-3 w-3 text-green-600" />
                  <span className="font-semibold text-green-800">Ranger Portal</span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs bg-white p-1 rounded border">ranger@kruger.co.za</p>
                  <p className="font-mono text-xs bg-white p-1 rounded border">kruger123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}