import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { OrdersPage } from "./components/orders-page";
import { OrderDetailPage } from "./components/order-detail-page";
import { DashboardPage } from "./components/dashboard-page";
import { CustomersPage } from "./components/customers-page";
import { ReportsPage } from "./components/reports-page";
import { SettingsPage } from "./components/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "orders", Component: OrdersPage },
      { path: "orders/:orderId", Component: OrderDetailPage },
      { path: "customers", Component: CustomersPage },
      { path: "reports", Component: ReportsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
