import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { SalesCaptureForm } from "@/components/sales/sales-capture-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Download,
  Filter,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  itemName: string;
  quantity: number;
  type: "Normal" | "Conditional";
  timestamp: Date;
}

interface SalespersonDashboardProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export default function SalespersonDashboard({ user, onLogout }: SalespersonDashboardProps) {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filter, setFilter] = useState<"All" | "Normal" | "Conditional">("All");

  // Mock some initial sales data
  useEffect(() => {
    const mockSales: Sale[] = [
      {
        id: "1",
        itemName: "Wireless Headphones",
        quantity: 2,
        type: "Normal",
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
      },
      {
        id: "2", 
        itemName: "Smartphone Case",
        quantity: 1,
        type: "Conditional",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        id: "3",
        itemName: "USB Cable",
        quantity: 5,
        type: "Normal",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
      }
    ];
    setSales(mockSales);
  }, []);

  const handleSaleCapture = (saleData: any) => {
    const newSale: Sale = {
      id: Date.now().toString(),
      ...saleData
    };
    setSales(prev => [newSale, ...prev]);
  };

  const handleExport = () => {
    toast({
      title: "Exporting Sales",
      description: "PDF export will be ready shortly...",
      variant: "default"
    });
  };

  const filteredSales = sales.filter(sale => 
    filter === "All" ? true : sale.type === filter
  );

  const stats = {
    totalSales: sales.length,
    normalSales: sales.filter(s => s.type === "Normal").length,
    conditionalSales: sales.filter(s => s.type === "Conditional").length,
    todaysSales: sales.filter(s => {
      const today = new Date();
      const saleDate = new Date(s.timestamp);
      return saleDate.toDateString() === today.toDateString();
    }).length
  };

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
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Ready to capture some sales today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sales"
            value={stats.totalSales}
            icon={Package}
            change="+12% from yesterday"
            changeType="positive"
          />
          <StatsCard
            title="Normal Sales"
            value={stats.normalSales}
            icon={TrendingUp}
            className="border-l-4 border-l-success"
          />
          <StatsCard
            title="Conditional Sales"
            value={stats.conditionalSales}
            icon={Clock}
            className="border-l-4 border-l-warning"
          />
          <StatsCard
            title="Today's Sales"
            value={stats.todaysSales}
            icon={TrendingUp}
            change="+5 from yesterday"
            changeType="positive"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Capture Form */}
          <div className="lg:col-span-1">
            <SalesCaptureForm onSaleCapture={handleSaleCapture} />
          </div>

          {/* Sales List */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-card border-0 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>Recent Sales</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    {["All", "Normal", "Conditional"].map((filterType) => (
                      <Button
                        key={filterType}
                        variant={filter === filterType ? "default" : "ghost"}
                        size="sm"
                        className="rounded-none"
                        onClick={() => setFilter(filterType as typeof filter)}
                      >
                        {filterType}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredSales.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sales found for the selected filter</p>
                  </div>
                ) : (
                  filteredSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-md transition-smooth"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{sale.itemName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {sale.quantity}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <Badge
                          variant={sale.type === "Normal" ? "default" : "secondary"}
                          className={
                            sale.type === "Normal" 
                              ? "bg-success-light text-success border-success/20" 
                              : "bg-warning-light text-warning border-warning/20"
                          }
                        >
                          {sale.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(sale.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}