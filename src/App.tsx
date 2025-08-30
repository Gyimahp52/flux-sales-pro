import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import SalespersonDashboard from "./pages/dashboard/salesperson";
import BranchManagerDashboard from "./pages/dashboard/branch-manager";
import SuperAdminDashboard from "./pages/dashboard/super-admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  username: string;
  name: string;
  role: "Super Admin" | "Branch Manager" | "Salesperson";
  avatar?: string;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Demo authentication logic
    const mockUsers: Record<string, User> = {
      "admin": { 
        username: "admin", 
        name: "Admin User", 
        role: "Super Admin",
        avatar: "/api/placeholder/40/40"
      },
      "manager": { 
        username: "manager", 
        name: "Branch Manager", 
        role: "Branch Manager",
        avatar: "/api/placeholder/40/40"
      },
      "sales": { 
        username: "sales", 
        name: "Sales Rep", 
        role: "Salesperson",
        avatar: "/api/placeholder/40/40"
      }
    };

    const authenticatedUser = mockUsers[credentials.username];
    if (authenticatedUser) {
      setUser(authenticatedUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                user.role === "Super Admin" ? (
                  <SuperAdminDashboard user={user} onLogout={handleLogout} />
                ) : user.role === "Branch Manager" ? (
                  <BranchManagerDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <SalespersonDashboard user={user} onLogout={handleLogout} />
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
