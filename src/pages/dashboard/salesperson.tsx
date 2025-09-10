import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { SalesCaptureForm } from "@/components/sales/sales-capture-form";
import { DateRangePicker } from "@/components/export/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Download,
  Filter,
  Eye,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportRange, setExportRange] = useState<{ from: Date; to: Date } | null>(null);

  // Initialize with empty sales data
  useEffect(() => {
    const initialSales: Sale[] = [];
    setSales(initialSales);
  }, []);

  const handleSaleCapture = (saleData: any) => {
    const newSale: Sale = {
      id: Date.now().toString(),
      ...saleData
    };
    setSales(prev => [newSale, ...prev]);
  };

  const handleExport = () => {
    if (!exportRange) {
      toast({
        title: "Select Date Range",
        description: "Please select a date range for export",
        variant: "destructive"
      });
      return;
    }

    const filteredData = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= exportRange.from && saleDate <= exportRange.to;
    });

    // Group by sale type
    const normalSales = filteredData.filter(s => s.type === "Normal");
    const conditionalSales = filteredData.filter(s => s.type === "Conditional");

    // Create CSV content
    const csvContent = [
      "Sale Type,Item Name,Quantity,Date",
      ...normalSales.map(sale => `Normal,"${sale.itemName}",${sale.quantity},"${sale.timestamp.toLocaleDateString()}"`),
      ...conditionalSales.map(sale => `Conditional,"${sale.itemName}",${sale.quantity},"${sale.timestamp.toLocaleDateString()}"`),
      "",
      "Summary",
      `Total Sales,${filteredData.length}`,
      `Normal Sales,${normalSales.length}`,
      `Conditional Sales,${conditionalSales.length}`
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-export-${exportRange.from.toISOString().split('T')[0]}-to-${exportRange.to.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsExportOpen(false);
    toast({
      title: "Export Complete",
      description: "Sales data has been exported successfully",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-8 relative">
          <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-3xl opacity-30"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to capture some sales today?
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Sales"
            value={stats.totalSales}
            icon={Package}
            className="bg-gradient-glass border-0 shadow-glass hover:shadow-primary/20 transition-smooth"
          />
          <StatsCard
            title="Normal Sales"
            value={stats.normalSales}
            icon={TrendingUp}
            className="bg-gradient-success/10 border-l-4 border-l-success shadow-success/20 hover:shadow-success/30 transition-smooth"
          />
          <StatsCard
            title="Conditional Sales"
            value={stats.conditionalSales}
            icon={Clock}
            className="bg-warning-light/20 border-l-4 border-l-warning shadow-glass hover:shadow-lg transition-smooth"
          />
          <StatsCard
            title="Today's Sales"
            value={stats.todaysSales}
            icon={TrendingUp}
            className="bg-gradient-primary/10 border-l-4 border-l-primary shadow-primary/20 hover:shadow-primary/30 transition-smooth"
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
                        className={cn(
                          "rounded-none transition-smooth",
                          filter === filterType && "bg-gradient-primary shadow-primary/20"
                        )}
                        onClick={() => setFilter(filterType as typeof filter)}
                      >
                        {filterType}
                      </Button>
                    ))}
                  </div>
                  <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="shadow-md hover:shadow-primary/20 transition-smooth">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-gradient-glass backdrop-blur-xl border-0 shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Export Sales Data</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <DateRangePicker onRangeSelect={setExportRange} />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleExport} className="bg-gradient-primary shadow-primary">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      className="flex items-center justify-between p-4 bg-gradient-glass rounded-lg border border-border/50 hover:shadow-primary/10 transition-smooth"
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
                              ? "bg-gradient-success text-success-foreground border-success/20 shadow-success/20" 
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