export interface Order {
  id: string;
  customer: string;
  customerCode: string;
  status: "Open" | "In Progress" | "Completed" | "Cancelled" | "Pending Approval";
  amount: number;
  currency: string;
  createdDate: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  deliveryDate: string;
  billingAddress: string;
  shippingAddress: string;
  paymentTerms: string;
  notes: string;
  items: OrderItem[];
  history: HistoryEntry[];
  shippingInfo?: {
    destination: string;
    method: string;
  };
}

export interface OrderItem {
  id: string;
  material: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export const mockOrders: Order[] = [
  {
    id: "SO-2026-0001",
    customer: "Acme Corporation",
    customerCode: "CUST-1001",
    status: "Open",
    amount: 125400.50,
    currency: "USD",
    createdDate: "2026-03-01",
    owner: "Sarah Mitchell",
    priority: "High",
    deliveryDate: "2026-03-15",
    billingAddress: "123 Business Park, New York, NY 10001",
    shippingAddress: "123 Business Park, New York, NY 10001",
    paymentTerms: "Net 30",
    notes: "Rush order - customer requested expedited delivery",
    items: [
      {
        id: "1",
        material: "MAT-1001",
        description: "Industrial Control Unit - Model X200",
        quantity: 50,
        unit: "EA",
        unitPrice: 1250.50,
        totalPrice: 62525.00,
        deliveryDate: "2026-03-15"
      },
      {
        id: "2",
        material: "MAT-1002",
        description: "Sensor Array - High Precision",
        quantity: 100,
        unit: "EA",
        unitPrice: 315.75,
        totalPrice: 31575.00,
        deliveryDate: "2026-03-15"
      },
      {
        id: "3",
        material: "MAT-1003",
        description: "Power Supply Module - 500W",
        quantity: 75,
        unit: "EA",
        unitPrice: 418.67,
        totalPrice: 31400.50,
        deliveryDate: "2026-03-15"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-03-01 09:15:00",
        user: "Sarah Mitchell",
        action: "Created",
        details: "Order created from customer inquiry #INQ-5432"
      },
      {
        id: "2",
        timestamp: "2026-03-01 09:30:00",
        user: "Sarah Mitchell",
        action: "Updated",
        details: "Added delivery instructions"
      }
    ],
    shippingInfo: {
      destination: "New York, NY",
      method: "Next Day Air"
    }
  },
  {
    id: "SO-2026-0002",
    customer: "Global Tech Industries",
    customerCode: "CUST-1002",
    status: "In Progress",
    amount: 89750.00,
    currency: "USD",
    createdDate: "2026-02-28",
    owner: "Michael Chen",
    priority: "Medium",
    deliveryDate: "2026-03-20",
    billingAddress: "456 Tech Boulevard, San Francisco, CA 94105",
    shippingAddress: "789 Distribution Center, Oakland, CA 94607",
    paymentTerms: "Net 45",
    notes: "Standard delivery terms apply",
    items: [
      {
        id: "1",
        material: "MAT-2001",
        description: "Server Rack Unit - 42U",
        quantity: 25,
        unit: "EA",
        unitPrice: 2150.00,
        totalPrice: 53750.00,
        deliveryDate: "2026-03-20"
      },
      {
        id: "2",
        material: "MAT-2002",
        description: "Network Switch - 48 Port",
        quantity: 20,
        unit: "EA",
        unitPrice: 1800.00,
        totalPrice: 36000.00,
        deliveryDate: "2026-03-20"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-02-28 14:20:00",
        user: "Michael Chen",
        action: "Created",
        details: "Order created from contract #CNT-8821"
      },
      {
        id: "2",
        timestamp: "2026-02-28 15:45:00",
        user: "System",
        action: "Approved",
        details: "Credit check completed successfully"
      },
      {
        id: "3",
        timestamp: "2026-03-01 08:00:00",
        user: "Warehouse Team",
        action: "Processing",
        details: "Picking started for all items"
      }
    ],
    shippingInfo: {
      destination: "Oakland, CA",
      method: "Ground Shipping"
    }
  },
  {
    id: "SO-2026-0003",
    customer: "Manufacturing Solutions Ltd",
    customerCode: "CUST-1003",
    status: "Pending Approval",
    amount: 245900.00,
    currency: "USD",
    createdDate: "2026-03-02",
    owner: "Jennifer Roberts",
    priority: "High",
    deliveryDate: "2026-03-25",
    billingAddress: "321 Industrial Way, Chicago, IL 60601",
    shippingAddress: "321 Industrial Way, Chicago, IL 60601",
    paymentTerms: "Net 30",
    notes: "Requires executive approval - amount exceeds $200K threshold",
    items: [
      {
        id: "1",
        material: "MAT-3001",
        description: "CNC Machine Component Set",
        quantity: 10,
        unit: "SET",
        unitPrice: 18500.00,
        totalPrice: 185000.00,
        deliveryDate: "2026-03-25"
      },
      {
        id: "2",
        material: "MAT-3002",
        description: "Hydraulic System - Premium",
        quantity: 5,
        unit: "EA",
        unitPrice: 12180.00,
        totalPrice: 60900.00,
        deliveryDate: "2026-03-25"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-03-02 11:30:00",
        user: "Jennifer Roberts",
        action: "Created",
        details: "Order created from RFQ #RFQ-2134"
      },
      {
        id: "2",
        timestamp: "2026-03-02 11:45:00",
        user: "System",
        action: "Pending Approval",
        details: "Routed to VP Sales for approval"
      }
    ]
  },
  {
    id: "SO-2026-0004",
    customer: "Retail Chain Group",
    customerCode: "CUST-1004",
    status: "Completed",
    amount: 54320.00,
    currency: "USD",
    createdDate: "2026-02-15",
    owner: "David Park",
    priority: "Low",
    deliveryDate: "2026-02-28",
    billingAddress: "555 Retail Plaza, Boston, MA 02108",
    shippingAddress: "777 Warehouse District, Boston, MA 02109",
    paymentTerms: "Net 60",
    notes: "Completed and invoiced",
    items: [
      {
        id: "1",
        material: "MAT-4001",
        description: "Point of Sale Terminal",
        quantity: 80,
        unit: "EA",
        unitPrice: 679.00,
        totalPrice: 54320.00,
        deliveryDate: "2026-02-28"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-02-15 09:00:00",
        user: "David Park",
        action: "Created",
        details: "Order created"
      },
      {
        id: "2",
        timestamp: "2026-02-15 10:30:00",
        user: "System",
        action: "Approved",
        details: "Auto-approved - within credit limit"
      },
      {
        id: "3",
        timestamp: "2026-02-20 13:00:00",
        user: "Warehouse Team",
        action: "Shipped",
        details: "Tracking #: TRK-894563"
      },
      {
        id: "4",
        timestamp: "2026-02-28 16:00:00",
        user: "System",
        action: "Delivered",
        details: "Delivery confirmed by customer"
      },
      {
        id: "5",
        timestamp: "2026-02-28 17:00:00",
        user: "System",
        action: "Completed",
        details: "Invoice #INV-2026-0234 generated"
      }
    ]
  },
  {
    id: "SO-2026-0005",
    customer: "Advanced Systems Corp",
    customerCode: "CUST-1005",
    status: "Open",
    amount: 178650.00,
    currency: "USD",
    createdDate: "2026-03-03",
    owner: "Sarah Mitchell",
    priority: "Medium",
    deliveryDate: "2026-03-30",
    billingAddress: "888 Innovation Drive, Austin, TX 78701",
    shippingAddress: "888 Innovation Drive, Austin, TX 78701",
    paymentTerms: "Net 30",
    notes: "Customer prefers morning delivery",
    items: [
      {
        id: "1",
        material: "MAT-5001",
        description: "Automation Controller - Enterprise",
        quantity: 30,
        unit: "EA",
        unitPrice: 4250.00,
        totalPrice: 127500.00,
        deliveryDate: "2026-03-30"
      },
      {
        id: "2",
        material: "MAT-5002",
        description: "Integration Module - Advanced",
        quantity: 45,
        unit: "EA",
        unitPrice: 1137.00,
        totalPrice: 51150.00,
        deliveryDate: "2026-03-30"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-03-03 08:30:00",
        user: "Sarah Mitchell",
        action: "Created",
        details: "Order created from standing contract"
      }
    ]
  },
  {
    id: "SO-2026-0006",
    customer: "Healthcare Equipment Inc",
    customerCode: "CUST-1006",
    status: "In Progress",
    amount: 312450.00,
    currency: "USD",
    createdDate: "2026-02-25",
    owner: "Michael Chen",
    priority: "High",
    deliveryDate: "2026-03-18",
    billingAddress: "999 Medical Plaza, Seattle, WA 98101",
    shippingAddress: "111 Hospital Way, Seattle, WA 98102",
    paymentTerms: "Net 30",
    notes: "Certified delivery required",
    items: [
      {
        id: "1",
        material: "MAT-6001",
        description: "Medical Grade Monitor - 24 inch",
        quantity: 150,
        unit: "EA",
        unitPrice: 1850.00,
        totalPrice: 277500.00,
        deliveryDate: "2026-03-18"
      },
      {
        id: "2",
        material: "MAT-6002",
        description: "Mounting Bracket System",
        quantity: 150,
        unit: "EA",
        unitPrice: 233.00,
        totalPrice: 34950.00,
        deliveryDate: "2026-03-18"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-02-25 10:00:00",
        user: "Michael Chen",
        action: "Created",
        details: "Order created"
      },
      {
        id: "2",
        timestamp: "2026-02-25 11:15:00",
        user: "Compliance Team",
        action: "Approved",
        details: "Medical certification verified"
      },
      {
        id: "3",
        timestamp: "2026-03-01 09:00:00",
        user: "Warehouse Team",
        action: "Processing",
        details: "Special packaging in progress"
      }
    ]
  },
  {
    id: "SO-2026-0007",
    customer: "Energy Solutions Group",
    customerCode: "CUST-1007",
    status: "Cancelled",
    amount: 95800.00,
    currency: "USD",
    createdDate: "2026-02-20",
    owner: "Jennifer Roberts",
    priority: "Low",
    deliveryDate: "2026-03-10",
    billingAddress: "222 Power Street, Houston, TX 77001",
    shippingAddress: "222 Power Street, Houston, TX 77001",
    paymentTerms: "Net 45",
    notes: "Cancelled by customer - project postponed",
    items: [
      {
        id: "1",
        material: "MAT-7001",
        description: "Solar Panel Controller",
        quantity: 40,
        unit: "EA",
        unitPrice: 2395.00,
        totalPrice: 95800.00,
        deliveryDate: "2026-03-10"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-02-20 14:00:00",
        user: "Jennifer Roberts",
        action: "Created",
        details: "Order created"
      },
      {
        id: "2",
        timestamp: "2026-02-27 16:30:00",
        user: "Jennifer Roberts",
        action: "Cancelled",
        details: "Customer requested cancellation - project delayed"
      }
    ]
  },
  {
    id: "SO-2026-0008",
    customer: "Logistics Partners LLC",
    customerCode: "CUST-1008",
    status: "Open",
    amount: 67890.00,
    currency: "USD",
    createdDate: "2026-03-02",
    owner: "David Park",
    priority: "Medium",
    deliveryDate: "2026-03-22",
    billingAddress: "333 Shipping Lane, Miami, FL 33101",
    shippingAddress: "444 Port Authority, Miami, FL 33102",
    paymentTerms: "Net 30",
    notes: "Requires custom labeling",
    items: [
      {
        id: "1",
        material: "MAT-8001",
        description: "Barcode Scanner - Industrial",
        quantity: 100,
        unit: "EA",
        unitPrice: 445.00,
        totalPrice: 44500.00,
        deliveryDate: "2026-03-22"
      },
      {
        id: "2",
        material: "MAT-8002",
        description: "Handheld Terminal - Ruggedized",
        quantity: 35,
        unit: "EA",
        unitPrice: 668.29,
        totalPrice: 23390.00,
        deliveryDate: "2026-03-22"
      }
    ],
    history: [
      {
        id: "1",
        timestamp: "2026-03-02 13:45:00",
        user: "David Park",
        action: "Created",
        details: "Order created from quote #QT-5678"
      }
    ]
  }
];
