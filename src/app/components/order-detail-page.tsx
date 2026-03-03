import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Edit, Save } from "lucide-react";
import { mockOrders } from "../data/mock-orders";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

const statusColors = {
  "Open": "bg-[#0070f2] text-white",
  "In Progress": "bg-[#e9730c] text-white",
  "Completed": "bg-[#107e3e] text-white",
  "Cancelled": "bg-[#bb0000] text-white",
  "Pending Approval": "bg-[#e9730c] text-white",
};

const priorityColors = {
  "High": "bg-[#bb0000] text-white",
  "Medium": "bg-[#e9730c] text-white",
  "Low": "bg-[#107e3e] text-white",
};

export function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f6f7]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders")}
            className="h-8 px-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl text-gray-900">{order.id}</h1>
          <Badge className={`${statusColors[order.status]} ml-2`}>
            {order.status}
          </Badge>
          <Badge className={`${priorityColors[order.priority]} ml-1`}>
            {order.priority} Priority
          </Badge>
        </div>
        <p className="text-sm text-gray-600 ml-12">{order.customer}</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 bg-[#0070f2] hover:bg-[#005ecb]">
            <CheckCircle className="size-4 mr-2" />
            Approve
          </Button>
          <Button size="sm" variant="outline" className="h-9 border-gray-300">
            <XCircle className="size-4 mr-2" />
            Reject
          </Button>
          <Button size="sm" variant="outline" className="h-9 border-gray-300">
            <Edit className="size-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="h-9 border-gray-300">
            <Save className="size-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="items" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
            >
              Items
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger 
              value="delivery" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
            >
              Delivery
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
            >
              History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">General Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Order ID</label>
                  <p className="text-sm text-gray-900">{order.id}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Customer Code</label>
                  <p className="text-sm text-gray-900">{order.customerCode}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Customer Name</label>
                  <p className="text-sm text-gray-900">{order.customer}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Owner</label>
                  <p className="text-sm text-gray-900">{order.owner}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Created Date</label>
                  <p className="text-sm text-gray-900">{formatDate(order.createdDate)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Delivery Date</label>
                  <p className="text-sm text-gray-900">{formatDate(order.deliveryDate)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Total Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(order.amount)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Payment Terms</label>
                  <p className="text-sm text-gray-900">{order.paymentTerms}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600 block mb-1">Notes</label>
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm text-gray-700">Line Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5f6f7] border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs text-gray-700">Material</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-700">Description</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-700">Quantity</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-700">Unit</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-700">Unit Price</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-700">Total Price</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-700">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{item.material}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(item.totalPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.deliveryDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#f5f6f7] border-t-2 border-gray-300">
                      <td colSpan={5} className="px-4 py-3 text-sm text-gray-700 text-right">
                        Total Amount:
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(order.amount)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">Billing Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Billing Address</label>
                  <p className="text-sm text-gray-900">{order.billingAddress}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Payment Terms</label>
                  <p className="text-sm text-gray-900">{order.paymentTerms}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Total Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(order.amount)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Currency</label>
                  <p className="text-sm text-gray-900">{order.currency}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">Delivery Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Shipping Address</label>
                  <p className="text-sm text-gray-900">{order.shippingAddress}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Delivery Date</label>
                  <p className="text-sm text-gray-900">{formatDate(order.deliveryDate)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600 block mb-1">Delivery Notes</label>
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm text-gray-700">Order History</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.history.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="size-2 rounded-full bg-[#0070f2]"></div>
                        {index < order.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm text-gray-900">{entry.action}</span>
                          <span className="text-xs text-gray-500">{formatDateTime(entry.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{entry.details}</p>
                        <p className="text-xs text-gray-500">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
