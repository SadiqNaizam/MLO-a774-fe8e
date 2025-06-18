import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  title?: string;
  children: React.ReactNode; // Content for filters (e.g., Checkbox, Slider from shadcn)
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ title = "Filters", children, className }) => {
  console.log("Rendering Sidebar");
  return (
    <aside className={`w-full md:w-72 lg:w-80 p-4 border rounded-lg shadow-sm bg-card ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <Separator className="mb-4" />
      <ScrollArea className="h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
        <div className="space-y-4 pr-3">
          {children ? children : <p className="text-muted-foreground text-sm">Filter controls will appear here.</p>}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;