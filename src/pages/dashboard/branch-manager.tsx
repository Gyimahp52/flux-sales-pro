import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Building2, 
  Download,
  UserPlus,
  Eye,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Salesperson {
  id: string;
  name: string;
  totalSales: number;
  normalSales: number;
  conditionalSales: number;
  lastActive: Date;
}

interface BranchManagerDashboardProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export default function BranchManagerDashboard({ user, onLogout }: BranchManagerDashboardProps) {
  const { toast } = useToast();
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);

  // Mock salespeople data
  useEffect(() => {
    const mockSalespeople: Salesperson[] = [
      {
        id: "1",
        name: "Alice Johnson",
        totalSales: 45,
        normalSales: 38,
        conditionalSales: 7,
        lastActive: new Date(Date.now() - 1000 * 60 * 15) // 15 mins ago
      },
      {
        id: "2", 
        name: "Bob Chen",
        totalSales: 32,
        normalSales: 28,
        conditionalSales: 4,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
      },
      {
        id: "3",
        name: "Carol Davis",
        totalSales: 28,
        normalSales: 22,
        conditionalSales: 6,
        lastActive: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
      }
    ];
    setSalespeople(mockSalespeople);
  }, []);

  const handleExportBranch = () => {
    toast({
      title: "Exporting Branch Report",
      description: "Branch-wide PDF report will be ready shortly...",
      variant: "default"
    });
  };

  const handleAddSalesperson = () => {
    toast({
      title: "Add New Salesperson",
      description: "This feature will be available soon...",
      variant: "default"
    });
  };

  const totalStats = salespeople.reduce((acc, person) => ({
    totalSales: acc.totalSales + person.totalSales,
    normalSales: acc.normalSales + person.normalSales,
    conditionalSales: acc.conditionalSales + person.conditionalSales
  }), { totalSales: 0, normalSales: 0, conditionalSales: 0 });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Branch Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor your team's performance and manage salespeople
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExportBranch}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="gradient" onClick={handleAddSalesperson}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Salesperson
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Team Members"
            value={salespeople.length}
            icon={Users}
            change="+2 this month"
            changeType="positive"
          />
          <StatsCard
            title="Total Branch Sales"
            value={totalStats.totalSales}
            icon={TrendingUp}
            change="+18% from last week"
            changeType="positive"
          />
          <StatsCard
            title="Normal Sales"
            value={totalStats.normalSales}
            icon={Building2}
            className="border-l-4 border-l-success"
          />
          <StatsCard
            title="Conditional Sales"
            value={totalStats.conditionalSales}
            icon={BarChart3}
            className="border-l-4 border-l-warning"
          />
        </div>

        {/* Team Performance */}
        <Card className="p-6 bg-gradient-card border-0 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Team Performance</span>
            </h2>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>

          <div className="space-y-4">
            {salespeople.map((person, index) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-md transition-smooth"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {person.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last active: {formatTime(person.lastActive)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{person.totalSales}</p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-success">{person.normalSales}</p>
                    <p className="text-xs text-muted-foreground">Normal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-warning">{person.conditionalSales}</p>
                    <p className="text-xs text-muted-foreground">Conditional</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">
                      {Math.round((person.normalSales / person.totalSales) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {salespeople.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No salespeople in your team yet</p>
              <Button variant="gradient" className="mt-4" onClick={handleAddSalesperson}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Salesperson
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}