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
  activities?: Array<{
    id: string;
    salesperson: string;
    item: string;
    quantity: number;
    type: "Normal" | "Conditional";
    date: string;
    value: number;
  }>;
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
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);

  // Mock branches data with Ghana locations and activities
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
        status: "Active",
        activities: [
          { id: "1", salesperson: "Alice Johnson", item: "Kivo gari", quantity: 15, type: "Normal", date: "2024-01-08", value: 2250 },
          { id: "2", salesperson: "Bob Smith", item: "rice", quantity: 8, type: "Conditional", date: "2024-01-08", value: 1200 },
          { id: "3", salesperson: "Carol Brown", item: "pomo 2.0", quantity: 12, type: "Normal", date: "2024-01-07", value: 1800 },
          { id: "4", salesperson: "David Wilson", item: "peacock 5.5kg", quantity: 6, type: "Conditional", date: "2024-01-07", value: 900 }
        ]
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
        status: "Active",
        activities: [
          { id: "5", salesperson: "Eve Davis", item: "kivo pepper", quantity: 10, type: "Normal", date: "2024-01-08", value: 1500 },
          { id: "6", salesperson: "Frank Miller", item: "pomo 1.1", quantity: 5, type: "Conditional", date: "2024-01-08", value: 750 },
          { id: "7", salesperson: "Grace Lee", item: "Kivo gari", quantity: 20, type: "Normal", date: "2024-01-07", value: 3000 }
        ]
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
        status: "Active",
        activities: [
          { id: "8", salesperson: "Henry Brown", item: "peacock 5.5kg", quantity: 25, type: "Normal", date: "2024-01-08", value: 3750 },
          { id: "9", salesperson: "Ivy Clark", item: "rice", quantity: 12, type: "Conditional", date: "2024-01-08", value: 1800 },
          { id: "10", salesperson: "Jack Adams", item: "pomo 2.0", quantity: 18, type: "Normal", date: "2024-01-07", value: 2700 }
        ]
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
        status: "Active",
        activities: [
          { id: "11", salesperson: "Karen White", item: "kivo pepper", quantity: 8, type: "Normal", date: "2024-01-08", value: 1200 },
          { id: "12", salesperson: "Leo Green", item: "pomo 1.1", quantity: 4, type: "Conditional", date: "2024-01-08", value: 600 }
        ]
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
    let csv = "Branch,Manager,Salespeople,Total Sales,Normal Sales,Conditional Sales,Success Rate,Item Details\n";
    branches.forEach(branch => {
      const successRate = Math.round((branch.normalSales / branch.totalSales) * 100);
      const itemDetails = branch.activities ? 
        branch.activities.map(activity => `${activity.item}(${activity.quantity}x${activity.type})`).join(';') : 
        'No items recorded';
      csv += `${branch.name},${branch.manager},${branch.salespeople},${branch.totalSales},${branch.normalSales},${branch.conditionalSales},${successRate}%,"${itemDetails}"\n`;
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

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsBranchDetailsOpen(true);
  };

  const handleUserManagementClick = () => {
    setShowSettingsDialog(false);
    setShowUserManagement(true);
  };

  const handleNotificationsClick = () => {
    setShowSettingsDialog(false);
    setShowNotifications(true);
  };

  const handleSecurityClick = () => {
    setShowSettingsDialog(false);
    setShowSecurity(true);
  };

  const handleExportSettingsClick = () => {
    setShowSettingsDialog(false);
    setShowExportSettings(true);
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
                    <button 
                      onClick={handleUserManagementClick}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors w-full text-left"
                    >
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">User Management</p>
                        <p className="text-sm text-muted-foreground">Manage branch managers and permissions</p>
                      </div>
                    </button>
                    <button 
                      onClick={handleNotificationsClick}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors w-full text-left"
                    >
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">Configure system alerts and reports</p>
                      </div>
                    </button>
                    <button 
                      onClick={handleSecurityClick}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors w-full text-left"
                    >
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Security</p>
                        <p className="text-sm text-muted-foreground">Password policies and access controls</p>
                      </div>
                    </button>
                    <button 
                      onClick={handleExportSettingsClick}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors w-full text-left"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Export Settings</p>
                        <p className="text-sm text-muted-foreground">Configure report formats and schedules</p>
                      </div>
                    </button>
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
              <button
                key={branch.id}
                onClick={() => handleBranchClick(branch)}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-md hover:bg-muted/30 transition-smooth cursor-pointer w-full text-left"
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
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                  <p className="text-2xl font-bold text-foreground">{selectedBranch.totalSales}</p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-success">{selectedBranch.normalSales}</p>
                  <p className="text-sm text-muted-foreground">Normal Sales</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-warning">{selectedBranch.conditionalSales}</p>
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

              {/* Detailed Activities */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Recent Sales Activities</span>
                </h4>
                <div className="space-y-2">
                  {selectedBranch.activities?.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'Normal' ? 'bg-success' : 'bg-warning'
                        }`}></div>
                        <div>
                          <p className="font-medium">{activity.salesperson}</p>
                          <p className="text-sm text-muted-foreground">{activity.item} × {activity.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₵{activity.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                        <Badge variant={activity.type === 'Normal' ? 'default' : 'secondary'} className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-center">No activities recorded</p>}
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

      {/* User Management Dialog */}
      <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>User Management</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Manage branch managers, salespeople, and user permissions.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Branch Managers</p>
                  <p className="text-sm text-muted-foreground">4 active managers</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Salespeople</p>
                  <p className="text-sm text-muted-foreground">29 active salespeople</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Configure system alerts and reporting schedules.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Daily Reports</p>
                  <p className="text-sm text-muted-foreground">Automated daily sales summaries</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Low Performance Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when branches underperform</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Dialog */}
      <Dialog open={showSecurity} onOpenChange={setShowSecurity}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Manage password policies and access controls.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Password Policy</p>
                  <p className="text-sm text-muted-foreground">Minimum 8 characters, mixed case</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enhanced security for admin accounts</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Settings Dialog */}
      <Dialog open={showExportSettings} onOpenChange={setShowExportSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Export Settings</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Configure report formats and automatic export schedules.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Report Format</p>
                  <p className="text-sm text-muted-foreground">CSV, Excel, PDF options</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Scheduled Reports</p>
                  <p className="text-sm text-muted-foreground">Automated weekly/monthly exports</p>
                </div>
                <Button size="sm" variant="outline">Set Schedule</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}