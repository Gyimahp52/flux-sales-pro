import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin?: (credentials: { username: string; password: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      onLogin?.(formData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/098b217e-5db1-435e-8480-2c548188482a.png" 
              alt="MACL - Michael Adjei Company Limited" 
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MACL Sales
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8 bg-gradient-card border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
                className="transition-smooth focus:shadow-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pr-10 transition-smooth focus:shadow-primary"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              <Button type="button" variant="ghost" className="w-full text-sm">
                Forgot your password?
              </Button>
            </div>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-4 bg-muted border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs">
            <p><span className="font-medium">Super Admin:</span> admin / admin123</p>
            <p><span className="font-medium">Branch Manager:</span> manager / manager123</p>
            <p><span className="font-medium">Salesperson:</span> sales / sales123</p>
          </div>
        </Card>
      </div>
    </div>
  );
}