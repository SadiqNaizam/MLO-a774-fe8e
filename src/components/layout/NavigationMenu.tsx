import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plane, Briefcase, LogIn } from 'lucide-react'; // Added LayoutDashboard

const NavigationMenu: React.FC = () => {
  console.log("Rendering NavigationMenu");

  // Updated navigation items
  const navItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: '/', label: 'Book Flight', icon: <Plane className="mr-2 h-4 w-4" /> }, // Assuming flight search is on dashboard/homepage
    { href: '/my-trips', label: 'My Trips', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <LayoutDashboard className="h-7 w-7 mr-2 text-primary" /> {/* Changed Icon and color */}
          Flight Dashboard {/* Changed Name */}
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link to={item.href} className="text-sm font-medium flex items-center">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
          <Button variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
          {/* Mobile menu button can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default NavigationMenu;