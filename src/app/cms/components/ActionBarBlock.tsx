import { Filter, Download, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Loader2 } from "lucide-react";

export function ActionBarBlock({ config, context }: { config: any, context?: any }) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-3">
                {config.filters && config.filters.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Filter className="size-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Filters:</span>
                    </div>
                )}

                {/* 动态渲染过滤器 (假定一个是下拉框，一个是输入框) */}
                {config.filters?.map((filter: any, idx: number) => {
                    if (filter.type === "select") {
                        const options = Array.isArray(filter.options) ? filter.options : [];
                        return (
                            <Select key={idx} defaultValue="all">
                                <SelectTrigger className="w-[180px] h-9 border-gray-300">
                                    <SelectValue placeholder={filter.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((opt: any) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                    }
                    if (filter.type === "input") {
                        return (
                            <Input
                                key={idx}
                                placeholder={filter.placeholder}
                                className="w-[250px] h-9 border-gray-300"
                            />
                        )
                    }
                    return null;
                })}

                {/* 动态渲染右侧 Action 按钮 */}
                {config.actions && (
                    <div className="ml-auto flex items-center gap-2">
                        {config.actions.map((act: any, idx: number) => {
                            const isLoading = act.loadingBinding && context?.[act.loadingBinding];
                            return (
                                <Button
                                    key={idx}
                                    variant={act.type === "primary" ? "default" : "outline"}
                                    size="sm"
                                    className={`h-9 ${act.type === "primary" ? "bg-[#0070f2] hover:bg-[#005ecb]" : "border-gray-300"}`}
                                    onClick={() => {
                                        if (act.actionId && context?.actions?.[act.actionId]) {
                                            context.actions[act.actionId]();
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                    ) : (
                                        <>
                                            {act.icon === "RefreshCw" && <RefreshCw className="size-4 mr-2" />}
                                            {act.icon === "Download" && <Download className="size-4 mr-2" />}
                                        </>
                                    )}
                                    {isLoading ? "Processing..." : act.label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
