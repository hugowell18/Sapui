import { CmsPageConfig } from "../schema";
import { DataTableBlock } from "../components/DataTableBlock";
import { ActionBarBlock } from "../components/ActionBarBlock";

// 该模板的特殊 Schema 结构
export interface DataListTemplateConfig {
    actionBar?: {
        filters: any[];
        actions: any[];
    };
    content: {
        type: "DataTableBlock";
        dataSourceEndpoint: string;
        columns: any[];
    };
}

export function DataListTemplate({ config }: { config: CmsPageConfig }) {
    const { pageHeader, templateConfig } = config;
    const tConfig = templateConfig as DataListTemplateConfig;

    return (
        <div className="h-full flex flex-col bg-[#f5f6f7]">
            {/* 统一化的 Page Header 渲染区 */}
            {pageHeader && (
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl text-gray-900">{pageHeader.title}</h1>
                    {pageHeader.subtitle && (
                        <p className="text-sm text-gray-600 mt-0.5">{pageHeader.subtitle}</p>
                    )}
                </div>
            )}

            {/* Action / Filter Bar 渲染区 */}
            {tConfig.actionBar && (
                <ActionBarBlock config={tConfig.actionBar} />
            )}

            {/* Main Content (一般是个 Table) */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                    {/* Component Registry 模式：根据 type 匹配块 */}
                    {tConfig.content.type === "DataTableBlock" && (
                        <DataTableBlock config={tConfig.content} />
                    )}
                </div>
            </div>
        </div>
    );
}
