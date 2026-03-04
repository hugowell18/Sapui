import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Edit, Save, Loader2 } from "lucide-react";
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

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    // 模拟初始加载：加载一个只有空壳/空值的 Order 对象
    const fetchInitialData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const emptyOrder = {
        id: orderId,
        customerCode: "-",
        customer: "-",
        owner: "-",
        status: "Pending Approval",
        priority: "Medium",
        amount: 0,
        paymentTerms: "-",
        createdDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        notes: "Data is empty. Click 'Approve' to simulate API fetch...",
        billingAddress: "-",
        shippingAddress: "-",
        currency: "USD",
        items: [],
        history: []
      };
      setOrder(emptyOrder);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [orderId]);

  const handleApproveAction = async () => {
    if (!order) return;
    setIsApproving(true);

    try {
      // 模拟调用远端 API，期待返回一个包含完整业务数据的 JSON 对象
      const response = await new Promise<any>((resolve) => {
        setTimeout(() => {
          const fakeApiResponse = {
            id: orderId,
            customerCode: "CUST-999-API",
            customer: "Global Tech Enterprise (API Synced)",
            owner: "Admin Manager",
            status: "Completed",
            priority: "High",
            amount: 15600.00,
            paymentTerms: "Net 30 (Updated)",
            createdDate: "2026-03-01T08:00:00Z",
            deliveryDate: "2026-03-25T00:00:00Z",
            notes: "All these details were successfully fetched from the fake API response and dynamically updated the UI components!\n[System]: Approved by Admin.",
            billingAddress: "789 API Boulevard, Tech City",
            shippingAddress: "123 Delivery Port, Warehouse A",
            currency: "USD",
            items: [
              {
                id: "itm-01",
                material: "SRV-HW-100",
                description: "Enterprise Server Blade X",
                quantity: 2,
                unit: "PC",
                unitPrice: 7500.00,
                totalPrice: 15000.00,
                deliveryDate: "2026-03-20T00:00:00Z"
              },
              {
                id: "itm-02",
                material: "LIC-SW-200",
                description: "OS License Key",
                quantity: 2,
                unit: "EA",
                unitPrice: 300.00,
                totalPrice: 600.00,
                deliveryDate: "2026-03-20T00:00:00Z"
              }
            ],
            history: [
              {
                id: "h1",
                action: "Order Created",
                timestamp: "2026-03-01T08:00:00Z",
                user: "System",
                details: "Order registered in system."
              },
              {
                id: "h2",
                action: "Approved & Data Synced",
                timestamp: new Date().toISOString(),
                user: "Current User",
                details: "Order approved. Data backfilled from API response."
              }
            ]
          };
          resolve(fakeApiResponse);
        }, 1200); // 1.2秒延迟模拟网络
      });

      setOrder(response);
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f5f6f7]">
        <Loader2 className="size-8 animate-spin text-[#0070f2]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f5f6f7]">
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
          <Badge className={`${statusColors[order.status as keyof typeof statusColors]} ml-2`}>
            {order.status}
          </Badge>
          <Badge className={`${priorityColors[order.priority as keyof typeof priorityColors]} ml-1`}>
            {order.priority} Priority
          </Badge>
        </div>
        <p className="text-sm text-gray-600 ml-12">{order.customer}</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 bg-[#0070f2] hover:bg-[#005ecb]"
            onClick={handleApproveAction}
            disabled={isApproving}
          >
            {isApproving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <CheckCircle className="size-4 mr-2" />}
            {isApproving ? "Approving..." : "Approve"}
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
                    {order.items.map((item: any, index: number) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
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
                  {order.history.map((entry: any, index: number) => (
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
