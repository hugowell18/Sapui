import { Outlet, Link, useLocation } from "react-router";
import { Search, Bell, User, LayoutDashboard, ShoppingCart, Users, FileText, Settings } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-[#f5f6f7]">
      {/* Top Header */}
      <header className="h-14 bg-[#354a5f] text-white flex items-center px-4 border-b border-[#2b3e50] shadow-sm">
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="w-8 h-8 bg-[#0070f2] rounded flex items-center justify-center">
            <span className="text-sm">S</span>
          </div>
          <span className="text-sm">Sales Order Management</span>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
            <Input
              placeholder="Search orders, customers..."
              className="pl-10 bg-[#2b3e50] border-[#3f5469] text-white placeholder:text-white/60 h-9"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-[#2b3e50] rounded">
            <Bell className="size-5" />
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-[#d1462f] text-white border-0 text-xs">
              3
            </Badge>
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-[#2b3e50]">
            <Avatar className="size-8">
              <AvatarFallback className="bg-[#0070f2] text-white text-xs">
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">John Smith</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200">
          <nav className="p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded mb-1 text-sm transition-colors ${
                    isActive
                      ? "bg-[#e8f2fd] text-[#0070f2]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="size-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
