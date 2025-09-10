import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  TrendingUp, 
  Building2, 
  Download,
  UserPlus,
  Eye,
  BarChart3,
  Edit,
  Trash2,
  Calendar,
  Target,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Salesperson {
  id: string;
  name: string;
  username: string;
  totalSales: number;
  normalSales: number;
  conditionalSales: number;
  successRate: number;
  lastActive: string;
  joinDate: Date;
  status: 'Active' | 'Inactive' | 'On Leave';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState<Salesperson | null>(null);
  const [isPerformanceDetailsOpen, setIsPerformanceDetailsOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Salesperson | null>(null);
  const [isSalesDetailsOpen, setIsSalesDetailsOpen] = useState(false);
  const [salesDetailsType, setSalesDetailsType] = useState<'normal' | 'conditional'>('normal');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });

  // Initialize with empty salespeople data
  useEffect(() => {
    const initialSalespeople: Salesperson[] = [];
    setSalespeople(initialSalespeople);
  }, []);

  // Mock sales activities for detailed view
  const getSalesActivities = (salespersonId: string, type: 'normal' | 'conditional') => {
    const activities = {
      normal: [
        { id: '1', itemName: 'Pomo 1.1', quantity: 3, timestamp: new Date(Date.now() - 1000 * 60 * 30), customer: 'John Doe' },
        { id: '2', itemName: 'Kivo Gari', quantity: 2, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), customer: 'Jane Smith' },
        { id: '3', itemName: 'Peacock', quantity: 1, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), customer: 'Bob Johnson' },
        { id: '4', itemName: 'Titus Fish', quantity: 4, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), customer: 'Alice Brown' },
      ],
      conditional: [
        { id: '5', itemName: 'Mackerel', quantity: 2, timestamp: new Date(Date.now() - 1000 * 60 * 45), customer: 'Mike Wilson', condition: 'Payment pending' },
        { id: '6', itemName: 'Salmon', quantity: 1, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), customer: 'Sarah Davis', condition: 'Delivery tomorrow' },
        { id: '7', itemName: 'Tuna', quantity: 3, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), customer: 'Tom Anderson', condition: 'Quality check needed' },
      ]
    };
    return activities[type] || [];
  };

  const handleExportBranch = () => {
    // Create detailed export including stock items
    let csvContent = 'Name,Username,Total Sales,Normal Sales,Conditional Sales,Success Rate,Last Active,Status,Stock Items Details\n';
    
    salespeople.forEach(person => {
      const normalActivities = getSalesActivities(person.id, 'normal');
      const conditionalActivities = getSalesActivities(person.id, 'conditional');
      
      const stockItemsDetails = [
        ...normalActivities.map(activity => `${activity.itemName}(${activity.quantity})`),
        ...conditionalActivities.map(activity => `${activity.itemName}(${activity.quantity}-${(activity as any).condition || 'Pending'})`)
      ].join('; ');
      
      csvContent += `${person.name},${person.username},${person.totalSales},${person.normalSales},${person.conditionalSales},${person.successRate}%,${person.lastActive},${person.status},"${stockItemsDetails}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `branch-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Branch report with stock items has been downloaded successfully.",
      variant: "default"
    });
  };

  const handleAddSalesperson = () => {
    setIsAddModalOpen(true);
    setFormData({ name: '', username: '', password: '' });
  };

  const handleEditSalesperson = (person: Salesperson) => {
    setSelectedSalesperson(person);
    setFormData({ name: person.name, username: person.username, password: '' });
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (person: Salesperson) => {
    setSelectedSalesperson(person);
    setIsViewModalOpen(true);
  };

  const handleDeleteSalesperson = (personId: string) => {
    setSalespeople(prev => prev.filter(p => p.id !== personId));
    toast({
      title: "Salesperson Deleted",
      description: "The salesperson has been removed from your team.",
      variant: "default"
    });
  };

  const handleFormSubmit = (isEdit: boolean) => {
    if (!formData.name.trim() || !formData.username.trim() || (!isEdit && !formData.password.trim())) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEdit && selectedSalesperson) {
      setSalespeople(prev => prev.map(p => 
        p.id === selectedSalesperson.id 
          ? { ...p, name: formData.name, username: formData.username }
          : p
      ));
      setIsEditModalOpen(false);
      toast({
        title: "Salesperson Updated",
        description: "The salesperson details have been updated successfully.",
        variant: "default"
      });
    } else {
      const newSalesperson: Salesperson = {
        id: Date.now().toString(),
        name: formData.name,
        username: formData.username,
        totalSales: 0,
        normalSales: 0,
        conditionalSales: 0,
        successRate: 0,
        lastActive: "Just now",
        joinDate: new Date(),
        status: 'Active'
      };
      setSalespeople(prev => [...prev, newSalesperson]);
      setIsAddModalOpen(false);
      toast({
        title: "Salesperson Added",
        description: "New salesperson has been added to your team.",
        variant: "default"
      });
    }
    setFormData({ name: '', username: '', password: '' });
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
            />
            <StatsCard
              title="Total Branch Sales"
              value={totalStats.totalSales}
              icon={TrendingUp}
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
            <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View All Details
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
                      Last active: {person.lastActive}
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
                  <div className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-all"
                       onClick={() => {
                         setSelectedPerformance(person);
                         setSalesDetailsType('normal');
                         setIsSalesDetailsOpen(true);
                       }}>
                    <p className="text-lg font-semibold text-success">{person.normalSales}</p>
                    <p className="text-xs text-muted-foreground">Normal</p>
                  </div>
                  <div className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-all"
                       onClick={() => {
                         setSelectedPerformance(person);
                         setSalesDetailsType('conditional');
                         setIsSalesDetailsOpen(true);
                       }}>
                    <p className="text-lg font-semibold text-warning">{person.conditionalSales}</p>
                    <p className="text-xs text-muted-foreground">Conditional</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">
                      {person.successRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPerformance(person);
                        setIsPerformanceDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditSalesperson(person)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteSalesperson(person.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

        {/* Add Salesperson Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Salesperson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={() => handleFormSubmit(false)}>
                  Add Salesperson
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Salesperson Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Salesperson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={() => handleFormSubmit(true)}>
                  Update Salesperson
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSalesperson ? `${selectedSalesperson.name} - Details` : 'Team Details'}
              </DialogTitle>
            </DialogHeader>
            {selectedSalesperson ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">Personal Info</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {selectedSalesperson.name}</p>
                      <p><span className="text-muted-foreground">Username:</span> {selectedSalesperson.username}</p>
                      <p><span className="text-muted-foreground">Status:</span> 
                        <Badge variant={selectedSalesperson.status === 'Active' ? 'default' : 'secondary'} className="ml-2">
                          {selectedSalesperson.status}
                        </Badge>
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Activity</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Joined:</span> {selectedSalesperson.joinDate.toLocaleDateString()}</p>
                      <p><span className="text-muted-foreground">Last Active:</span> {selectedSalesperson.lastActive}</p>
                    </div>
                  </Card>
                </div>
                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium">Sales Performance</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedSalesperson.totalSales}</p>
                      <p className="text-xs text-muted-foreground">Total Sales</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{selectedSalesperson.normalSales}</p>
                      <p className="text-xs text-muted-foreground">Normal Sales</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{selectedSalesperson.conditionalSales}</p>
                      <p className="text-xs text-muted-foreground">Conditional Sales</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedSalesperson.successRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <Card className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salespeople.map((person) => (
                        <TableRow key={person.id}>
                          <TableCell className="font-medium">{person.name}</TableCell>
                          <TableCell>{person.username}</TableCell>
                          <TableCell>{person.totalSales}</TableCell>
                          <TableCell>
                            {person.successRate}%
                          </TableCell>
                          <TableCell>
                            <Badge variant={person.status === 'Active' ? 'default' : 'secondary'}>
                              {person.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Salesperson Performance Details Dialog */}
        <Dialog open={isPerformanceDetailsOpen} onOpenChange={setIsPerformanceDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{selectedPerformance?.name} Performance Details</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedPerformance && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{selectedPerformance.totalSales}</p>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                       onClick={() => {
                         setSalesDetailsType('normal');
                         setIsSalesDetailsOpen(true);
                       }}>
                    <p className="text-2xl font-bold text-success">{selectedPerformance.normalSales}</p>
                    <p className="text-sm text-muted-foreground">Normal Sales (Click to view items)</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                       onClick={() => {
                         setSalesDetailsType('conditional');
                         setIsSalesDetailsOpen(true);
                       }}>
                    <p className="text-2xl font-bold text-warning">{selectedPerformance.conditionalSales}</p>
                    <p className="text-sm text-muted-foreground">Conditional Sales (Click to view items)</p>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                  <p className="text-3xl font-bold text-primary">{selectedPerformance.successRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
                  <div className="w-full bg-muted/50 rounded-full h-2 mt-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedPerformance.successRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Last Active</h4>
                    <p className="text-muted-foreground">{selectedPerformance.lastActive}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedPerformance.status === 'Active' ? 'bg-success' : 
                        selectedPerformance.status === 'Inactive' ? 'bg-destructive' : 'bg-warning'
                      }`}></div>
                      <span className="text-sm">{selectedPerformance.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold mb-3">Performance Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Normal Sales Rate:</span>
                      <span className="font-medium">{selectedPerformance.totalSales > 0 ? ((selectedPerformance.normalSales / selectedPerformance.totalSales) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conditional Sales Rate:</span>
                      <span className="font-medium">{selectedPerformance.totalSales > 0 ? ((selectedPerformance.conditionalSales / selectedPerformance.totalSales) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Target Achievement:</span>
                      <span className="font-medium text-primary">{selectedPerformance.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Sales Details Dialog */}
        <Dialog open={isSalesDetailsOpen} onOpenChange={setIsSalesDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{selectedPerformance?.name} - {salesDetailsType === 'normal' ? 'Normal' : 'Conditional'} Sales Stock Items</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedPerformance && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {getSalesActivities(selectedPerformance.id, salesDetailsType).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{activity.itemName}</h4>
                          <p className="text-sm text-muted-foreground">Customer: {activity.customer}</p>
                          {salesDetailsType === 'conditional' && (activity as any).condition && (
                            <p className="text-xs text-warning">Condition: {(activity as any).condition}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-lg font-semibold text-foreground">
                          Qty: {activity.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(activity.timestamp)}
                        </div>
                        <Badge variant={salesDetailsType === 'normal' ? 'default' : 'secondary'} className="text-xs">
                          {salesDetailsType === 'normal' ? 'Normal Sale' : 'Conditional Sale'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {getSalesActivities(selectedPerformance.id, salesDetailsType).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No {salesDetailsType} sales found for this salesperson</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}