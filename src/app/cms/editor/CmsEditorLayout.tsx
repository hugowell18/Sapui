import { useState } from "react";
import { CmsPageRenderer } from "../CmsPageRenderer";
import { CmsPageConfig, normalizeCmsConfig } from "../schema";
import { EditorPropertyPanel } from "./EditorPropertyPanel";
import { Edit3, Eye } from "lucide-react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../../components/ui/resizable";
export function CmsEditorLayout({
    initialConfig,
    context
}: {
    initialConfig: CmsPageConfig,
    context?: any
}) {
    const normalizedInitialConfig = normalizeCmsConfig(initialConfig);
    const storageKey = `cms_config_${normalizedInitialConfig.pageId}`;

    // 从 LocalStorage 恢复配置，如果没有则使用代码中默认的 initialConfig
    const getInitialState = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) return normalizeCmsConfig(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse saved config", e);
        }
        return normalizedInitialConfig;
    };

    // 核心的“已经保存生效”的配置
    const [persistedConfig, setPersistedConfig] = useState<CmsPageConfig>(getInitialState);
    // 当前正在因为右侧面板操作而“预览/草稿”的配置
    const [draftConfig, setDraftConfig] = useState<CmsPageConfig>(getInitialState);
    const [isEditMode, setIsEditMode] = useState(false);

    // 记录是否有草稿层面的改动（简单做 JSON 字符串对比判断 dirty 状态）
    const hasChanges = JSON.stringify(persistedConfig) !== JSON.stringify(draftConfig);

    const handleEnterEditMode = () => {
        // 每次进入编辑模式时，草稿都从当前已保存的版本 clone 出一份
        setDraftConfig(JSON.parse(JSON.stringify(persistedConfig)));
        setIsEditMode(true);
    };

    return (
        <div className="relative w-full h-full flex overflow-hidden">

            {/* Core Page Render Area (Left/Main) and EditorPropertyPanel (Right) */}
            {isEditMode ? (
                <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                    <ResizablePanel defaultSize={75} minSize={30}>
                        <div
                            className="w-full h-full transition-all duration-300 relative bg-gray-100 p-8 flex flex-col items-center justify-center overflow-auto"
                        >
                            <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl ring-4 ring-[#0070f2]/20 relative">
                                {/* Preview Header */}
                                <div className="absolute top-0 left-0 right-0 bg-[#0070f2] text-white text-[10px] font-bold tracking-widest px-3 py-1 z-50 rounded-t-lg shadow-sm">
                                    LIVE PREVIEW
                                </div>
                                <div className="w-full h-full pt-6 bg-white overflow-y-auto">
                                    <CmsPageRenderer config={draftConfig} context={context} />
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
                        <EditorPropertyPanel
                            config={draftConfig}
                            onChange={setDraftConfig}
                            context={context}
                            onSave={() => {
                                const newConfig = JSON.parse(JSON.stringify(draftConfig));
                                const normalized = normalizeCmsConfig(newConfig);
                                setPersistedConfig(normalized);
                                localStorage.setItem(storageKey, JSON.stringify(normalized));
                                setIsEditMode(false);
                            }}
                            onDiscard={() => {
                                setDraftConfig(JSON.parse(JSON.stringify(persistedConfig)));
                            }}
                            onClose={() => {
                                setIsEditMode(false);
                            }}
                            hasChanges={hasChanges}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            ) : (
                <div className="flex-1 w-full h-full">
                    <CmsPageRenderer config={persistedConfig} context={context} />
                </div>
            )}

            {/* 悬浮的 Edit Mode Toggle 按钮 */}
            {!isEditMode && (
                <button
                    onClick={handleEnterEditMode}
                    className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#0070f2] hover:bg-[#005ecb] text-white px-4 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                    <Edit3 className="size-4" />
                    <span className="text-sm font-medium">Edit Page</span>
                </button>
            )}

            {/* 全局退出按钮（当用户不想点侧栏里面的按钮而是想直接退出预览时） */}
            {isEditMode && !hasChanges && (
                <button
                    onClick={() => setIsEditMode(false)}
                    className="absolute bottom-6 left-6 flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
                >
                    <Eye className="size-4" />
                    <span className="text-sm font-medium">Exit Edit Mode</span>
                </button>
            )}

        </div>
    );
}
