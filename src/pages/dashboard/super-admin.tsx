import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe,
  Download,
  Plus,
  Settings,
  BarChart3,
  User,
  Bell,
  Shield,
  FileText,
  Eye
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
  successRate: number;
  salesTarget: number;
  status: "Active" | "Inactive";
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
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchManager, setNewBranchManager] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isBranchDetailsOpen, setIsBranchDetailsOpen] = useState(false);

  // Mock branches data with Ghana locations
  useEffect(() => {
    const mockBranches: Branch[] = [
      {
        id: "1",
        name: "Sunyani Branch",
        location: "Sunyani, Bono Region",
        manager: "Joe",
        salespeople: 8,
        totalSales: 324,
        normalSales: 278,
        conditionalSales: 46,
        successRate: 86,
        salesTarget: 400,
        status: "Active"
      },
      {
        id: "2", 
        name: "Goaso Branch",
        location: "Goaso, Ahafo Region",
        manager: "Ken",
        salespeople: 6,
        totalSales: 256,
        normalSales: 210,
        conditionalSales: 46,
        successRate: 82,
        salesTarget: 300,
        status: "Active"
      },
      {
        id: "3",
        name: "Techiman Branch",
        location: "Techiman, Bono East Region",
        manager: "Yaw ",
        salespeople: 10,
        totalSales: 412,
        normalSales: 350,
        conditionalSales: 62,
        successRate: 85,
        salesTarget: 450,
        status: "Active"
      },
      {
        id: "4",
        name: "Sefwi Branch",
        location: "Sefwi Wiawso, Western North Region", 
        manager: "Danny",
        salespeople: 5,
        totalSales: 189,
        normalSales: 155,
        conditionalSales: 34,
        successRate: 82,
        salesTarget: 250,
        status: "Active"
      }
    ];
    setBranches(mockBranches);
  }, []);

  const handleExportGlobal = () => {
    // Create a mock CSV export
    const csvContent = generateGlobalCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `global-sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Global Report Exported",
      description: "Company-wide CSV report has been downloaded successfully.",
      variant: "default"
    });
  };

  const generateGlobalCSV = () => {
    let csv = "Branch,Manager,Salespeople,Total Sales,Normal Sales,Conditional Sales,Success Rate\n";
    branches.forEach(branch => {
      const successRate = Math.round((branch.normalSales / branch.totalSales) * 100);
      csv += `${branch.name},${branch.manager},${branch.salespeople},${branch.totalSales},${branch.normalSales},${branch.conditionalSales},${successRate}%\n`;
    });
    return csv;
  };

  const handleAddBranch = () => {
    if (!newBranchName.trim() || !newBranchManager.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all branch details.",
        variant: "destructive"
      });
      return;
    }

    const newBranch: Branch = {
      id: Date.now().toString(),
      name: newBranchName,
      location: getLocationForBranch(newBranchName),
      manager: newBranchManager,
      salespeople: 0,
      totalSales: 0,
      normalSales: 0,
      conditionalSales: 0,
      successRate: 0,
      salesTarget: 300,
      status: "Active"
    };

    setBranches(prev => [...prev, newBranch]);
    setNewBranchName("");
    setNewBranchManager("");
    setShowAddBranchDialog(false);

    toast({
      title: "Branch Added",
      description: `${newBranchName} branch has been created successfully.`,
      variant: "default"
    });
  };

  const getLocationForBranch = (branchName: string) => {
    const locations: { [key: string]: string } = {
      "Sunyani": "Sunyani, Bono Region",
      "Goaso": "Goaso, Ahafo Region", 
      "Techiman": "Techiman, Bono East Region",
      "Sefwi": "Sefwi Wiawso, Western North Region"
    };
    return locations[branchName] || `${branchName}, Ghana`;
  };

  const handleSettings = () => {
    setShowSettingsDialog(true);
  };

  const totalStats = branches.reduce((acc, branch) => ({
    totalBranches: branches.length,
    activeBranches: branches.filter(b => b.status === "Active").length,
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
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>System Settings</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">User Management</p>
                        <p className="text-sm text-muted-foreground">Manage branch managers and permissions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">Configure system alerts and reports</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Security</p>
                        <p className="text-sm text-muted-foreground">Password policies and access controls</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Export Settings</p>
                        <p className="text-sm text-muted-foreground">Configure report formats and schedules</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleExportGlobal}>
              <Download className="mr-2 h-4 w-4" />
              Export Global
            </Button>

            <Dialog open={showAddBranchDialog} onOpenChange={setShowAddBranchDialog}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Add New Branch</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch-name">Branch Location</Label>
                    <Select onValueChange={setNewBranchName}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunyani">Sunyani</SelectItem>
                        <SelectItem value="Goaso">Goaso</SelectItem>
                        <SelectItem value="Techiman">Techiman</SelectItem>
                        <SelectItem value="Sefwi">Sefwi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager-name">Branch Manager Name</Label>
                    <Input
                      id="manager-name"
                      placeholder="Enter manager's full name"
                      value={newBranchManager}
                      onChange={(e) => setNewBranchManager(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddBranchDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="gradient" onClick={handleAddBranch}>
                      Create Branch
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                      branch.status === "Active" ? "bg-gradient-success" : "bg-muted"
                    }`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">{branch.name}</h3>
                      <Badge
                        variant={branch.status === "Active" ? "default" : "secondary"}
                        className={
                          branch.status === "Active" 
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
              <Dialog open={showAddBranchDialog} onOpenChange={setShowAddBranchDialog}>
                <DialogTrigger asChild>
                  <Button variant="gradient" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Branch
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </Card>
      </main>

      {/* Branch Performance Details Dialog */}
      <Dialog open={isBranchDetailsOpen} onOpenChange={setIsBranchDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{selectedBranch?.name} Performance Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBranch && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{selectedBranch.salespeople}</p>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">₵{selectedBranch.totalSales.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-success">₵{selectedBranch.normalSales.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Normal Sales</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-warning">₵{selectedBranch.conditionalSales.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Conditional Sales</p>
                </div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <p className="text-3xl font-bold text-primary">{selectedBranch.successRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
                <div className="w-full bg-muted/50 rounded-full h-2 mt-3">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedBranch.successRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Branch Manager</h4>
                  <p className="text-muted-foreground">{selectedBranch.manager}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedBranch.status === 'Active' ? 'bg-success' : 'bg-destructive'
                    }`}></div>
                    <span className="text-sm">{selectedBranch.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}