import { useState } from "react";
import { User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/components/profile/user-profile";

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileUpdate = (userData: any) => {
    console.log("Profile updated:", userData);
    // Here you would typically update the user data in your state management
  };

  return (
    <>
      <header className="bg-gradient-glass backdrop-blur-sm border-b border-border/50 px-4 py-3 shadow-glass">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/098b217e-5db1-435e-8480-2c548188482a.png" 
              alt="MACL - Michael Adjei Company Limited" 
              className="h-10 w-auto"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-primary/10 transition-smooth">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || "Role"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    <UserProfile
      user={{
        ...user,
        email: user?.name?.toLowerCase().replace(/\s+/g, '.') + "@macl.com",
        phone: "+233 24 123 4567",
        location: "Accra, Ghana",
        joinDate: "January 2024"
      }}
      isOpen={isProfileOpen}
      onClose={() => setIsProfileOpen(false)}
      onUpdate={handleProfileUpdate}
    />
    </>
  );
}