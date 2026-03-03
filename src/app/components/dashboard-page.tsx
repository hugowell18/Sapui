import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="h-full bg-[#f5f6f7]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-0.5">Overview of sales performance</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* KPI Cards */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl text-gray-900">245</p>
                <p className="text-xs text-[#107e3e] mt-2">↑ 12% vs last month</p>
              </div>
              <div className="size-10 bg-[#e8f2fd] rounded flex items-center justify-center">
                <ShoppingCart className="size-5 text-[#0070f2]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl text-gray-900">$1.2M</p>
                <p className="text-xs text-[#107e3e] mt-2">↑ 8% vs last month</p>
              </div>
              <div className="size-10 bg-[#e8f2fd] rounded flex items-center justify-center">
                <DollarSign className="size-5 text-[#0070f2]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Active Customers</p>
                <p className="text-2xl text-gray-900">89</p>
                <p className="text-xs text-[#107e3e] mt-2">↑ 5% vs last month</p>
              </div>
              <div className="size-10 bg-[#e8f2fd] rounded flex items-center justify-center">
                <Users className="size-5 text-[#0070f2]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl text-gray-900">$4.9K</p>
                <p className="text-xs text-[#bb0000] mt-2">↓ 3% vs last month</p>
              </div>
              <div className="size-10 bg-[#e8f2fd] rounded flex items-center justify-center">
                <TrendingUp className="size-5 text-[#0070f2]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm text-gray-700">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <div className="size-2 rounded-full bg-[#0070f2]"></div>
                <p className="text-sm text-gray-700">New order <span className="text-[#0070f2]">SO-2026-0008</span> created by David Park</p>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="size-2 rounded-full bg-[#107e3e]"></div>
                <p className="text-sm text-gray-700">Order <span className="text-[#0070f2]">SO-2026-0004</span> completed and invoiced</p>
                <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="size-2 rounded-full bg-[#e9730c]"></div>
                <p className="text-sm text-gray-700">Order <span className="text-[#0070f2]">SO-2026-0003</span> pending approval</p>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
