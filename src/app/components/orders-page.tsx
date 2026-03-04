import { CmsPageConfig } from "../cms/schema";
import { CmsEditorLayout } from "../cms/editor/CmsEditorLayout";

// 这是一个模拟从后端 CMS API 返回的 JSON 配置
const ordersPageCmsConfig: CmsPageConfig = {
  pageId: "sales-orders",
  templateType: "DataListTemplate",
  pageHeader: {
    title: "Sales Orders",
    subtitle: "Manage and track all sales orders (CMS Powered)"
  },
  templateConfig: {
    actionBar: {
      filters: [
        {
          type: "select",
          placeholder: "Status",
          options: [
            { label: "All Statuses", value: "all" },
            { label: "Open", value: "Open" },
            { label: "In Progress", value: "In Progress" },
            { label: "Pending Approval", value: "Pending Approval" },
            { label: "Completed", value: "Completed" },
            { label: "Cancelled", value: "Cancelled" }
          ]
        },
        {
          type: "input",
          placeholder: "Order ID or Customer"
        }
      ],
      actions: [
        { type: "button", label: "Refresh", icon: "RefreshCw", actionId: "RELOAD_DATA" },
        { type: "button", label: "Export", icon: "Download", actionId: "EXPORT_CSV" }
      ]
    },
    content: {
      type: "DataTableBlock",
      dataSourceEndpoint: "/api/v1/orders",
      rowClickAction: "navigate", // 点击行跳转到详情页
      columns: [
        { key: "id", label: "Order ID", type: "link" },
        { key: "customer", label: "Customer", type: "text" },
        { key: "status", label: "Status", type: "badge" },
        { key: "amount", label: "Amount", type: "currency", align: "right" },
        { key: "createdDate", label: "Created Date", type: "date" },
        { key: "owner", label: "Owner", type: "text" }
      ]
    }
  }
};

export function OrdersPage() {
  // 通过 CmsEditorLayout 包装器接管渲染，它内部维护了编辑状态和预览功能
  return <CmsEditorLayout initialConfig={ordersPageCmsConfig} />;
}
