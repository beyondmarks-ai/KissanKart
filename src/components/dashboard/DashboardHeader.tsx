import { Menu, Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onAddProduct?: () => void;
  showAddButton?: boolean;
}

export function DashboardHeader({ title, subtitle, onAddProduct, showAddButton = true }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden hover:bg-muted rounded-lg p-2 transition-colors">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="w-64 pl-9 bg-muted/50 border-border/50 focus:bg-background transition-colors"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative hover:bg-muted rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </Button>
        
        {showAddButton && onAddProduct && (
          <Button onClick={onAddProduct} className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        )}
      </div>
    </header>
  );
}
