import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleData {
  itemName: string;
  quantity: number;
  type: "Normal" | "Conditional";
  timestamp: Date;
}

interface SalesCaptureFormProps {
  onSaleCapture?: (sale: SaleData) => void;
}

export function SalesCaptureForm({ onSaleCapture }: SalesCaptureFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    type: "Normal" as "Normal" | "Conditional"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName.trim() || !formData.quantity || Number(formData.quantity) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields with valid values",
        variant: "destructive"
      });
      return;
    }

    const saleData: SaleData = {
      itemName: formData.itemName.trim(),
      quantity: Number(formData.quantity),
      type: formData.type,
      timestamp: new Date()
    };

    onSaleCapture?.(saleData);
    
    // Reset form
    setFormData({
      itemName: "",
      quantity: "",
      type: "Normal"
    });

    toast({
      title: "Sale Captured",
      description: `Successfully recorded ${saleData.quantity}x ${saleData.itemName}`,
      variant: "default"
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Capture New Sale</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="itemName" className="text-sm font-medium">
            Item Name
          </Label>
          <Select
            value={formData.itemName}
            onValueChange={(value) => setFormData(prev => ({ ...prev, itemName: value }))}
          >
            <SelectTrigger className="transition-smooth focus:shadow-primary">
              <SelectValue placeholder="Select product or service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kivo gari">Kivo gari</SelectItem>
              <SelectItem value="kivo pepper">kivo pepper</SelectItem>
              <SelectItem value="peacock 5.5kg">peacock 5.5kg</SelectItem>
              <SelectItem value="pomo 1.1">pomo 1.1</SelectItem>
              <SelectItem value="pomo 2.0">pomo 2.0</SelectItem>
              <SelectItem value="rice">rice</SelectItem>
              
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            placeholder="Enter quantity"
            className="transition-smooth focus:shadow-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Sale Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value: "Normal" | "Conditional") => 
              setFormData(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className="transition-smooth focus:shadow-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Normal Sale</span>
                </div>
              </SelectItem>
              <SelectItem value="Conditional">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Conditional Sale</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Capture Sale
        </Button>
      </form>
    </Card>
  );
}