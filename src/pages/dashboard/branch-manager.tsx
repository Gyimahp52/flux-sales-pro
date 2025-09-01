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
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Salesperson {
  id: string;
  name: string;
  username: string;
  totalSales: number;
  normalSales: number;
  conditionalSales: number;
  lastActive: Date;
  joinDate: Date;
  status: 'active' | 'inactive';
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
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });

  // Mock salespeople data
  useEffect(() => {
    const mockSalespeople: Salesperson[] = [
      {
        id: "1",
        name: "Alice Johnson",
        username: "alice.j",
        totalSales: 45,
        normalSales: 38,
        conditionalSales: 7,
        lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        joinDate: new Date('2024-01-15'),
        status: 'active'
      },
      {
        id: "2", 
        name: "Bob Chen",
        username: "bob.chen",
        totalSales: 32,
        normalSales: 28,
        conditionalSales: 4,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
        joinDate: new Date('2024-02-01'),
        status: 'active'
      },
      {
        id: "3",
        name: "Carol Davis",
        username: "carol.d",
        totalSales: 28,
        normalSales: 22,
        conditionalSales: 6,
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        joinDate: new Date('2024-01-20'),
        status: 'active'
      }
    ];
    setSalespeople(mockSalespeople);
  }, []);

  const handleExportBranch = () => {
    const csvContent = [
      ['Name', 'Username', 'Total Sales', 'Normal Sales', 'Conditional Sales', 'Success Rate', 'Last Active', 'Status'],
      ...salespeople.map(person => [
        person.name,
        person.username,
        person.totalSales.toString(),
        person.normalSales.toString(),
        person.conditionalSales.toString(),
        `${Math.round((person.normalSales / person.totalSales) * 100)}%`,
        person.lastActive.toLocaleDateString(),
        person.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `branch-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Branch report has been downloaded successfully.",
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
        lastActive: new Date(),
        joinDate: new Date(),
        status: 'active'
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
                      {person.totalSales > 0 ? Math.round((person.normalSales / person.totalSales) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(person)}>
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
                        <Badge variant={selectedSalesperson.status === 'active' ? 'default' : 'secondary'} className="ml-2">
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
                      <p><span className="text-muted-foreground">Last Active:</span> {formatTime(selectedSalesperson.lastActive)}</p>
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
                        {selectedSalesperson.totalSales > 0 ? Math.round((selectedSalesperson.normalSales / selectedSalesperson.totalSales) * 100) : 0}%
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
                            {person.totalSales > 0 ? Math.round((person.normalSales / person.totalSales) * 100) : 0}%
                          </TableCell>
                          <TableCell>
                            <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
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
      </main>
    </div>
  );
}