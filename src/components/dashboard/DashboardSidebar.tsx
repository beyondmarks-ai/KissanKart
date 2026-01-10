import { Package, LayoutDashboard, Settings, LogOut, TrendingUp, Leaf, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const menuItems = [
  { title: 'Overview', tab: '', icon: LayoutDashboard, color: 'from-primary to-primary/80' },
  { title: 'Products', tab: 'products', icon: Package, color: 'from-kisan-orange to-orange-500' },
  { title: 'Analytics', tab: 'analytics', icon: TrendingUp, color: 'from-kisan-leaf to-green-500' },
  { title: 'Settings', tab: 'settings', icon: Settings, color: 'from-purple-500 to-purple-600' },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const currentTab = new URLSearchParams(location.search).get('tab') || '';

  const isActive = (tab: string) => currentTab === tab;

  const handleNavigate = (tab: string) => {
    navigate(tab ? `/dashboard?tab=${tab}` : '/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar className="border-r border-border/50 bg-gradient-to-b from-card to-card/95">
        {/* Header */}
        <SidebarHeader className="border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <Leaf className="h-6 w-6" />
              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-kisan-leaf flex items-center justify-center shadow-sm">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h2 className="font-bold text-foreground tracking-tight">KissanKart</h2>
                <p className="text-xs text-muted-foreground font-medium">Farmer Dashboard</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className="p-3">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 px-3">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.tab);
                  
                  const buttonContent = (
                    <SidebarMenuButton
                      onClick={() => handleNavigate(item.tab)}
                      className={cn(
                        'w-full justify-start gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                        active
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-0.5'
                      )}
                    >
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-all',
                        active 
                          ? 'bg-white/20' 
                          : 'bg-muted/50 group-hover:bg-muted'
                      )}>
                        <item.icon className={cn(
                          'h-4.5 w-4.5 shrink-0',
                          active && 'text-white'
                        )} />
                      </div>
                      {!collapsed && (
                        <span className={cn(active && 'font-semibold')}>
                          {item.title}
                        </span>
                      )}
                    </SidebarMenuButton>
                  );

                  return (
                    <SidebarMenuItem key={item.title} className="group">
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {buttonContent}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        buttonContent
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-border/50 p-4 space-y-3">
          {!collapsed && (
            <div className="rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 p-3 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  {(profile?.full_name || 'F').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {profile?.full_name || 'Farmer'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sign Out</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
