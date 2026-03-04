import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { CmsEditorLayout } from "../cms/editor/CmsEditorLayout";

// 构造详情页完整的 CMS JSON 配置
const detailPageConfig: any = {
  pageId: "order-detail-view",
  templateType: "DetailViewTemplate",
  templateConfig: {
    header: {
      titleBinding: "id",
      statusBinding: "status",
      priorityBinding: "priority",
      subtitleBinding: "customer"
    },
    actionBar: {
      actions: [
        { label: "Approve", type: "primary", actionId: "APPROVE_ORDER", loadingBinding: "isApproving" },
        { label: "Reject", type: "secondary" },
        { label: "Back to Orders", type: "secondary", actionId: "GO_BACK" }
      ]
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "DescriptionGridBlock",
            title: "General Information",
            columns: 2,
            fields: [
              { label: "Order ID", key: "id" },
              { label: "Customer Code", key: "customerCode" },
              { label: "Customer Name", key: "customer" },
              { label: "Owner", key: "owner" },
              { label: "Created Date", key: "createdDate", type: "date" },
              { label: "Delivery Date", key: "deliveryDate", type: "date" },
              { label: "Total Amount", key: "amount", type: "currency" },
              { label: "Payment Terms", key: "paymentTerms" },
              { label: "Notes", key: "notes", fullWidth: true }
            ]
          }
        ]
      },
      {
        id: "items",
        label: "Items",
        blocks: [
          {
            type: "DataTableBlock",
            dataBinding: "items", // 会从 context.data.items 提取数据
            columns: [
              { key: "material", label: "Material", type: "text" },
              { key: "description", label: "Description", type: "text" },
              { key: "quantity", label: "Qty", type: "text", align: "right" },
              { key: "unit", label: "Unit", type: "text" },
              { key: "unitPrice", label: "Unit Price", type: "currency", align: "right" },
              { key: "totalPrice", label: "Total Price", type: "currency", align: "right" },
              { key: "deliveryDate", label: "Delivery Date", type: "date" }
            ]
          }
        ]
      },
      {
        id: "billing",
        label: "Billing",
        blocks: [
          {
            type: "DescriptionGridBlock",
            title: "Billing Information",
            columns: 2,
            fields: [
              { label: "Billing Address", key: "billingAddress" },
              { label: "Payment Terms", key: "paymentTerms" },
              { label: "Total Amount", key: "amount", type: "currency" },
              { label: "Currency", key: "currency" }
            ]
          }
        ]
      },
      {
        id: "delivery",
        label: "Delivery",
        blocks: [
          {
            type: "DescriptionGridBlock",
            title: "Delivery Information",
            columns: 2,
            fields: [
              { label: "Shipping Address", key: "shippingAddress" },
              { label: "Delivery Date", key: "deliveryDate", type: "date" },
              { label: "Delivery Notes", key: "notes", fullWidth: true }
            ]
          }
        ]
      },
      {
        id: "history",
        label: "History",
        blocks: [
          {
            type: "TimelineBlock",
            title: "Order History",
            dataBinding: "history"
          }
        ]
      }
    ]
  }
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

  // 构建传递给 CMS 引擎的运行时上下文
  const engineContext = {
    data: order,
    isLoading,
    isApproving,
    actions: {
      APPROVE_ORDER: handleApproveAction,
      GO_BACK: () => navigate("/orders")
    }
  };

  return (
    <div className="h-full relative">
      <CmsEditorLayout initialConfig={detailPageConfig} context={engineContext} />
    </div>
  );
}
