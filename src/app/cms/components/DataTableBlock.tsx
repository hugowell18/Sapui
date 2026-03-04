import { useNavigate } from "react-router";
import { Badge } from "../../components/ui/badge";
import { mockOrders } from "../../data/mock-orders";
import { resolvePath } from "../utils";

const statusColors: Record<string, string> = {
    "Open": "bg-[#0070f2] text-white",
    "In Progress": "bg-[#e9730c] text-white",
    "Completed": "bg-[#107e3e] text-white",
    "Cancelled": "bg-[#bb0000] text-white",
    "Pending Approval": "bg-[#e9730c] text-white",
};

type DataTableColumnType = "text" | "badge" | "link" | "currency" | "date" | "datetime" | "number";
type DataTableColumn = {
    key: string;
    label: string;
    type?: DataTableColumnType;
    align?: "left" | "right";
};
type DataTableConfig = {
    dataBinding?: string;
    dataSourceEndpoint?: string;
    rowClickAction?: "none" | "navigate";
    columns: DataTableColumn[];
};

export function DataTableBlock({ config, context }: { config: DataTableConfig; context?: { data?: unknown } }) {
    const navigate = useNavigate();

    // 如果配置了 dataBinding，则从外部传入的 context 提取本地数组数据
    // 否则作为 PoC 继续使用全局 mockOrders 模拟拉取全部数据
    const resolveDataSource = () => {
        if (config.dataBinding && context?.data) {
            return resolvePath(context.data, config.dataBinding);
        }
        if (context?.data !== undefined) {
            if (Array.isArray(context.data)) return context.data;
            if (context.data && typeof context.data === "object") return [context.data];
        }
        return mockOrders;
    };

    const resolvedData = resolveDataSource();
    const data = Array.isArray(resolvedData) ? resolvedData : [];
    const hasInvalidBinding = config.dataBinding && resolvedData !== undefined && !Array.isArray(resolvedData);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("en-US").format(value);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f5f6f7] border-b border-gray-200">
                            {config.columns.map((col: any, idx: number) => (
                                <th key={`${col.key}-${idx}`} className={`px-4 py-3 text-xs text-gray-700 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, index: number) => (
                            <tr
                                key={row?.id ?? index}
                                onClick={() => {
                                    if (config.rowClickAction === "navigate" && row?.id) navigate(`/orders/${row.id}`)
                                }}
                                className={`border-b border-gray-200 hover:bg-[#f5f6f7] cursor-pointer transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                                    }`}
                            >
                                {config.columns.map((col: any, colIdx: number) => {
                                    // 使用 resolvePath 来获取值，支持深层对象属性如 a.b.c
                                    const rawValue = resolvePath(row, col.key);
                                    let content: React.ReactNode = rawValue;

                                    if (rawValue !== undefined && rawValue !== null) {
                                        if (col.type === "link") content = <span className="text-[#0070f2]">{rawValue}</span>;
                                        if (col.type === "badge") content = <Badge className={`${statusColors[rawValue]} text-xs px-2 py-0.5`}>{rawValue}</Badge>;
                                        if (col.type === "currency") content = <span className="font-medium">{formatCurrency(rawValue)}</span>;
                                        if (col.type === "date") content = formatDate(rawValue);
                                        if (col.type === "datetime") content = formatDateTime(rawValue);
                                        if (col.type === "number") content = formatNumber(rawValue);
                                    }

                                    return (
                                        <td key={`${col.key}-${colIdx}`} className={`px-4 py-3 text-sm ${col.align === 'right' ? 'text-right' : ''}`}>
                                            {content}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-[#f5f6f7]">
                <p className="text-xs text-gray-600">
                    Showing {data.length} records (Mocked Data Source: {config.dataSourceEndpoint})
                </p>
                {hasInvalidBinding && (
                    <p className="text-xs text-red-500 mt-1">
                        Invalid data binding: expected an array at "{config.dataBinding}".
                    </p>
                )}
            </div>
        </>
    );
}
