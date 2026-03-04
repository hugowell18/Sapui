import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { resolvePath } from "../utils";
import { DescriptionGridBlock } from "../components/DescriptionGridBlock";
import { TimelineBlock } from "../components/TimelineBlock";
import { DataTableBlock } from "../components/DataTableBlock";
import { ActionBarBlock } from "../components/ActionBarBlock";
import { CmsPageConfig } from "../schema";

const statusColors: Record<string, string> = {
    "Open": "bg-[#0070f2] text-white",
    "In Progress": "bg-[#e9730c] text-white",
    "Completed": "bg-[#107e3e] text-white",
    "Cancelled": "bg-[#bb0000] text-white",
    "Pending Approval": "bg-[#e9730c] text-white",
};

const priorityColors: Record<string, string> = {
    "High": "bg-[#bb0000] text-white",
    "Medium": "bg-[#e9730c] text-white",
    "Low": "bg-[#107e3e] text-white",
};

export function DetailViewTemplate({ config, context }: { config: CmsPageConfig; context?: any }) {
    const data = context?.data || {};
    const templateConfig = config.templateConfig || {};
    const header = templateConfig.header || {};
    const tabs = Array.isArray(templateConfig.tabs) ? templateConfig.tabs : [];

    // Render sub-blocks based on config type
    const renderBlock = (blockConfig: any) => {
        switch (blockConfig.type) {
            case "DescriptionGridBlock":
                return <DescriptionGridBlock config={blockConfig} context={context} />;
            case "DataTableBlock":
                return <DataTableBlock config={blockConfig} context={context} />;
            case "TimelineBlock":
                return <TimelineBlock config={blockConfig} context={context} />;
            default:
                return <div className="p-4 text-red-500">Unknown block type: {blockConfig.type}</div>;
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#f5f6f7]">
            {/* Dynamic Header */}
            {header && (
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl text-gray-900">
                            {header.titleBinding ? resolvePath(data, header.titleBinding) : header.title}
                        </h1>

                        {header.statusBinding && resolvePath(data, header.statusBinding) && (
                            <Badge className={`${statusColors[resolvePath(data, header.statusBinding)] || "bg-gray-500 text-white"} ml-2`}>
                                {resolvePath(data, header.statusBinding)}
                            </Badge>
                        )}

                        {header.priorityBinding && resolvePath(data, header.priorityBinding) && (
                            <Badge className={`${priorityColors[resolvePath(data, header.priorityBinding)] || "bg-gray-500 text-white"} ml-1`}>
                                {resolvePath(data, header.priorityBinding)} Priority
                            </Badge>
                        )}
                    </div>
                    {header.subtitleBinding && (
                        <p className="text-sm text-gray-600">{resolvePath(data, header.subtitleBinding)}</p>
                    )}
                </div>
            )}

            {/* Action Bar Area */}
            {templateConfig.actionBar && (
                <div className="flex-shrink-0 relative z-10">
                    <ActionBarBlock config={{ actions: templateConfig.actionBar.actions }} context={context} />
                </div>
            )}

            {/* Tabs / Layout Area */}
            <div className="flex-1 overflow-auto p-6">
                {tabs.length > 0 ? (
                    <Tabs defaultValue={tabs[0]?.id} className="w-full">
                        <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
                            {tabs.map((tab: any) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0070f2] data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {tabs.map((tab: any) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-6">
                                {(Array.isArray(tab.blocks) ? tab.blocks : []).map((block: any, idx: number) => (
                                    <div key={idx} className="mb-6">
                                        {renderBlock(block)}
                                    </div>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    <div className="p-4 text-gray-500">No layout configured.</div>
                )}
            </div>
        </div>
    );
}
