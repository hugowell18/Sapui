import { useState } from "react";
import { useNavigate } from "react-router";
import { Filter, Download, RefreshCw } from "lucide-react";
import { mockOrders } from "../data/mock-orders";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

const statusColors = {
  "Open": "bg-[#0070f2] text-white",
  "In Progress": "bg-[#e9730c] text-white",
  "Completed": "bg-[#107e3e] text-white",
  "Cancelled": "bg-[#bb0000] text-white",
  "Pending Approval": "bg-[#e9730c] text-white",
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f6f7]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl text-gray-900">Sales Orders</h1>
        <p className="text-sm text-gray-600 mt-0.5">Manage and track all sales orders</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filters:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-9 border-gray-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Order ID or Customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] h-9 border-gray-300"
          />

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-gray-300">
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-9 border-gray-300">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f6f7] border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs text-gray-700">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-700">Customer</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-700">Status</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-700">Amount</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-700">Created Date</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-700">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className={`border-b border-gray-200 hover:bg-[#f5f6f7] cursor-pointer transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-[#0070f2]">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-4 py-3">
                      <Badge className={`${statusColors[order.status]} text-xs px-2 py-0.5`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(order.createdDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-gray-200 px-4 py-3 bg-[#f5f6f7]">
            <p className="text-xs text-gray-600">
              Showing {filteredOrders.length} of {mockOrders.length} orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
