import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe,
  Download,
  Plus,
  Settings,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  salespeople: number;
  totalSales: number;
  normalSales: number;
  conditionalSales: number;
  status: "active" | "inactive";
}

interface SuperAdminDashboardProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export default function SuperAdminDashboard({ user, onLogout }: SuperAdminDashboardProps) {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);

  // Mock branches data
  useEffect(() => {
    const mockBranches: Branch[] = [
      {
        id: "1",
        name: "Downtown Branch",
        location: "New York, NY",
        manager: "Sarah Wilson",
        salespeople: 8,
        totalSales: 324,
        normalSales: 278,
        conditionalSales: 46,
        status: "active"
      },
      {
        id: "2", 
        name: "West Side Branch",
        location: "Los Angeles, CA",
        manager: "Mike Rodriguez",
        salespeople: 12,
        totalSales: 456,
        normalSales: 389,
        conditionalSales: 67,
        status: "active"
      },
      {
        id: "3",
        name: "Central Branch",
        location: "Chicago, IL",
        manager: "Emma Thompson",
        salespeople: 6,
        totalSales: 198,
        normalSales: 165,
        conditionalSales: 33,
        status: "active"
      },
      {
        id: "4",
        name: "South Branch",
        location: "Miami, FL", 
        manager: "David Kim",
        salespeople: 4,
        totalSales: 89,
        normalSales: 72,
        conditionalSales: 17,
        status: "inactive"
      }
    ];
    setBranches(mockBranches);
  }, []);

  const handleExportGlobal = () => {
    toast({
      title: "Exporting Global Report",
      description: "Company-wide PDF report will be ready shortly...",
      variant: "default"
    });
  };

  const handleAddBranch = () => {
    toast({
      title: "Add New Branch",
      description: "This feature will be available soon...",
      variant: "default"
    });
  };

  const totalStats = branches.reduce((acc, branch) => ({
    totalBranches: branches.length,
    activeBranches: branches.filter(b => b.status === "active").length,
    totalSalespeople: acc.totalSalespeople + branch.salespeople,
    totalSales: acc.totalSales + branch.totalSales,
    normalSales: acc.normalSales + branch.normalSales,
    conditionalSales: acc.conditionalSales + branch.conditionalSales
  }), { totalBranches: 0, activeBranches: 0, totalSalespeople: 0, totalSales: 0, normalSales: 0, conditionalSales: 0 });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Global Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor all branches and manage the entire sales network
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleExportGlobal}>
              <Download className="mr-2 h-4 w-4" />
              Export Global
            </Button>
            <Button variant="gradient" onClick={handleAddBranch}>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Branches"
            value={`${totalStats.activeBranches}/${totalStats.totalBranches}`}
            icon={Building2}
            change="+1 this month"
            changeType="positive"
          />
          <StatsCard
            title="Total Salespeople"
            value={totalStats.totalSalespeople}
            icon={Users}
            change="+8% this quarter"
            changeType="positive"
          />
          <StatsCard
            title="Global Sales"
            value={totalStats.totalSales}
            icon={Globe}
            change="+15% this month"
            changeType="positive"
          />
          <StatsCard
            title="Success Rate"
            value={`${Math.round((totalStats.normalSales / totalStats.totalSales) * 100)}%`}
            icon={TrendingUp}
            change="+2.3% this week"
            changeType="positive"
          />
        </div>

        {/* Branches Overview */}
        <Card className="p-6 bg-gradient-card border-0 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Branch Performance</span>
            </h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>

          <div className="space-y-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-md transition-smooth"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      branch.status === "active" ? "bg-gradient-success" : "bg-muted"
                    }`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">{branch.name}</h3>
                      <Badge
                        variant={branch.status === "active" ? "default" : "secondary"}
                        className={
                          branch.status === "active" 
                            ? "bg-success-light text-success border-success/20" 
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {branch.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{branch.location}</p>
                    <p className="text-xs text-muted-foreground">Manager: {branch.manager}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{branch.salespeople}</p>
                    <p className="text-xs text-muted-foreground">Team Size</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{branch.totalSales}</p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-success">{branch.normalSales}</p>
                    <p className="text-xs text-muted-foreground">Normal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-warning">{branch.conditionalSales}</p>
                    <p className="text-xs text-muted-foreground">Conditional</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">
                      {Math.round((branch.normalSales / branch.totalSales) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {branches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No branches created yet</p>
              <Button variant="gradient" className="mt-4" onClick={handleAddBranch}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Branch
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}