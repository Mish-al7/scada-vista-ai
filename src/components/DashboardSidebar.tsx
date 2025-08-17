import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  AlertTriangle, 
  Wrench, 
  Activity, 
  Leaf,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Alarm Manager",
    url: "/alarms",
    icon: AlertTriangle,
    description: "Monitor system alarms and alerts"
  },
  {
    title: "Predictive Maintenance",
    url: "/maintenance", 
    icon: Wrench,
    description: "Track equipment health and RUL"
  },
  {
    title: "Pipeline Anomaly Detection",
    url: "/pipeline",
    icon: Activity,
    description: "Real-time pipeline monitoring"
  },
  {
    title: "Sustainability",
    url: "/sustainability",
    icon: Leaf,
    description: "Energy forecasting and efficiency"
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"} collapsible="icon">
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          {!collapsed && (
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-primary">SCADA AI</h1>
              <p className="text-sm text-muted-foreground">Industrial Dashboard</p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary/10 text-primary border-l-2 border-primary" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}