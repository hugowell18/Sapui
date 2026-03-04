import { Separator } from "../../components/ui/separator";
import { resolvePath } from "../utils";

export function DescriptionGridBlock({ config, context }: { config: any; context?: any }) {
    const data = context?.data || {};

    const formatCurrency = (amount: number) => {
        if (typeof amount !== 'number') return amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // Simplified for demo
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatNumber = (value: number) => {
        if (typeof value !== "number") return value;
        return new Intl.NumberFormat("en-US").format(value);
    };

    const getGridColsClass = (cols?: number) => {
        switch (cols) {
            case 1: return "grid-cols-1";
            case 3: return "grid-cols-3";
            case 4: return "grid-cols-4";
            case 2:
            default: return "grid-cols-2";
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            {config.title && <h3 className="text-sm text-gray-700 mb-4">{config.title}</h3>}
            {config.title && <Separator className="mb-4" />}

            <div className={`grid ${getGridColsClass(config.columns)} gap-x-8 gap-y-4`}>
                {config.fields.map((field: any, idx: number) => {
                    const rawValue = resolvePath(data, field.key);
                    let displayValue: any = rawValue;

                    if (displayValue !== undefined && displayValue !== null && displayValue !== "-") {
                        if (field.type === "currency") displayValue = formatCurrency(rawValue);
                        if (field.type === "date") displayValue = formatDate(rawValue);
                        if (field.type === "datetime") displayValue = formatDateTime(rawValue);
                        if (field.type === "number") displayValue = formatNumber(rawValue);
                    }

                    return (
                        <div key={`${field.key}-${idx}`} className={field.fullWidth ? "col-span-2" : ""}>
                            <label className="text-xs text-gray-600 block mb-1">{field.label}</label>
                            <p className="text-sm text-gray-900">{displayValue || "-"}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
