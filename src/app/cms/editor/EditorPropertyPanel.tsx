import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { mockOrders } from "../../data/mock-orders";
import { SortableList } from "./components/SortableList";
import { SortableItem } from "./components/SortableItem";

type FieldOption = { value: string; label: string; depth: number };
const NONE_VALUE = "__none__";
const formatOptions = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "currency", label: "Currency" },
    { value: "date", label: "Date" },
    { value: "datetime", label: "DateTime" },
    { value: "badge", label: "Badge" },
    { value: "link", label: "Link" },
];

const extractFieldOptions = (obj: any, prefix = "", depth = 0): FieldOption[] => {
    if (!obj || typeof obj !== "object") return [];
    return Object.keys(obj).reduce((acc: FieldOption[], key) => {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (Array.isArray(value)) {
            acc.push({ value: path, label: path, depth });
            if (value[0] && typeof value[0] === "object") acc.push(...extractFieldOptions(value[0], path, depth + 1));
            return acc;
        }
        if (value !== null && typeof value === "object") {
            acc.push(...extractFieldOptions(value, path, depth + 1));
            return acc;
        }
        acc.push({ value: path, label: path, depth });
        return acc;
    }, []);
};

const extractArrayPaths = (obj: any, prefix = ""): string[] => {
    if (!obj || typeof obj !== "object") return [];
    return Object.keys(obj).reduce((acc: string[], key) => {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (Array.isArray(value)) {
            acc.push(path);
            if (value[0] && typeof value[0] === "object") acc.push(...extractArrayPaths(value[0], path));
            return acc;
        }
        if (value !== null && typeof value === "object") acc.push(...extractArrayPaths(value, path));
        return acc;
    }, []);
};

const mergeDataShape = (primary: any, fallback: any): any => {
    if (Array.isArray(primary) || Array.isArray(fallback)) {
        const p = Array.isArray(primary) ? primary : [];
        const f = Array.isArray(fallback) ? fallback : [];
        const pFirst = p.length > 0 ? p[0] : undefined;
        const fFirst = f.length > 0 ? f[0] : undefined;
        if (pFirst === undefined && fFirst === undefined) return [];
        return [mergeDataShape(pFirst, fFirst)];
    }
    const isObjP = primary && typeof primary === "object";
    const isObjF = fallback && typeof fallback === "object";
    if (isObjP || isObjF) {
        const pObj = isObjP ? primary : {};
        const fObj = isObjF ? fallback : {};
        const keys = new Set([...Object.keys(pObj), ...Object.keys(fObj)]);
        const out: Record<string, any> = {};
        keys.forEach((k) => {
            out[k] = mergeDataShape(pObj[k], fObj[k]);
        });
        return out;
    }
    return primary !== undefined ? primary : fallback;
};

const getValueByPath = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
};

function FieldPathSelect({
    value,
    options,
    placeholder,
    onChange,
}: {
    value?: string;
    options: FieldOption[];
    placeholder: string;
    onChange: (v: string) => void;
}) {
    return (
        <Select value={value || NONE_VALUE} onValueChange={(v) => onChange(v === NONE_VALUE ? "" : v)}>
            <SelectTrigger className="h-7 text-xs"><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent>
                <SelectItem value={NONE_VALUE} className="text-xs text-gray-400 italic">-- None --</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {`${opt.depth > 0 ? `${"--".repeat(opt.depth)} ` : ""}${opt.label}`}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function EditorPropertyPanel({
    config, onChange, onSave, onDiscard, onClose, hasChanges, context
}: {
    config: any;
    onChange: (newConfig: any) => void;
    onSave: () => void;
    onDiscard: () => void;
    onClose: () => void;
    hasChanges: boolean;
    context?: any;
}) {
    const updateConfig = (path: (string | number)[], value: any) => {
        const next = JSON.parse(JSON.stringify(config));
        let cur = next;
        for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
        cur[path[path.length - 1]] = value;
        onChange(next);
    };

    const sourceData = mergeDataShape(context?.data || {}, mockOrders[0] || {});
    const availableFields = extractFieldOptions(sourceData);
    const arrayPathOptions = extractArrayPaths(sourceData).map((v) => ({
        value: v, label: v, depth: v.split(".").length - 1
    }));
    const getArrayItemFieldOptions = (bindingPath?: string) => {
        if (!bindingPath) return [];
        const arr = getValueByPath(sourceData, bindingPath);
        if (!Array.isArray(arr) || arr.length === 0 || typeof arr[0] !== "object") return [];
        return extractFieldOptions(arr[0]);
    };

    return (
        <div className="w-full min-w-0 border-l border-gray-200 bg-white h-full flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-800">Page Properties</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0"><X className="size-4" /></Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Header</h3>
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-600">Page Title</label>
                        <Input value={config.pageHeader?.title || ""} onChange={(e) => updateConfig(["pageHeader", "title"], e.target.value)} className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-600">Subtitle</label>
                        <Input value={config.pageHeader?.subtitle || ""} onChange={(e) => updateConfig(["pageHeader", "subtitle"], e.target.value)} className="text-sm h-8" />
                    </div>
                </div>

                {config.templateType === "DataListTemplate" && config.templateConfig?.content?.columns && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Table Columns</h3>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-[#0070f2]" onClick={() => {
                                const cols = [...config.templateConfig.content.columns];
                                cols.push({ key: "", label: "New Column", type: "text", align: "left" });
                                updateConfig(["templateConfig", "content", "columns"], cols);
                            }}>
                                <Plus className="size-3 mr-1" /> Add
                            </Button>
                        </div>
                        <SortableList
                            items={config.templateConfig.content.columns}
                            onReorder={(newCols) => updateConfig(["templateConfig", "content", "columns"], newCols)}
                            keyExtractor={(col, idx) => col.key || `col_${idx}`}
                            renderItem={(col: any, idx: number, itemId: string) => (
                                <SortableItem id={itemId} className="bg-gray-50 border p-2 rounded-md space-y-2 relative group pl-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-gray-500">Column {idx + 1}</span>
                                        <button className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                            const cols = [...config.templateConfig.content.columns];
                                            cols.splice(idx, 1);
                                            updateConfig(["templateConfig", "content", "columns"], cols);
                                        }}><Trash2 className="size-3" /></button>
                                    </div>
                                    <Input placeholder="Column Label" value={col.label} onChange={(e) => {
                                        const cols = [...config.templateConfig.content.columns];
                                        cols[idx].label = e.target.value;
                                        updateConfig(["templateConfig", "content", "columns"], cols);
                                    }} className="h-7 text-xs bg-white" />
                                    <FieldPathSelect value={col.key} options={availableFields} placeholder="Select field..." onChange={(v) => {
                                        const cols = [...config.templateConfig.content.columns];
                                        cols[idx].key = v;
                                        updateConfig(["templateConfig", "content", "columns"], cols);
                                    }} />
                                    <div className="flex gap-2">
                                        <Select value={col.type || "text"} onValueChange={(v) => {
                                            const cols = [...config.templateConfig.content.columns];
                                            cols[idx].type = v;
                                            updateConfig(["templateConfig", "content", "columns"], cols);
                                        }}>
                                            <SelectTrigger className="flex-1 h-7 text-xs"><SelectValue placeholder="Display Format" /></SelectTrigger>
                                            <SelectContent>{formatOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Select value={col.align || "left"} onValueChange={(v) => {
                                            const cols = [...config.templateConfig.content.columns];
                                            cols[idx].align = v;
                                            updateConfig(["templateConfig", "content", "columns"], cols);
                                        }}>
                                            <SelectTrigger className="w-[90px] h-7 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="left" className="text-xs">Left</SelectItem>
                                                <SelectItem value="right" className="text-xs">Right</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </SortableItem>
                            )}
                        />
                    </div>
                )}

                {config.templateType === "DetailViewTemplate" && config.templateConfig?.header && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Header Bound Data</h3>
                        </div>
                        <div className="space-y-3">
                            {["titleBinding", "statusBinding", "priorityBinding", "subtitleBinding"].map((keyName) => (
                                <div key={keyName} className="space-y-1.5">
                                    <label className="text-xs text-gray-600 truncate capitalize">{keyName.replace("Binding", " Binding")}</label>
                                    <FieldPathSelect
                                        value={config.templateConfig.header[keyName] || ""}
                                        options={availableFields}
                                        placeholder="Select data field..."
                                        onChange={(v) => updateConfig(["templateConfig", "header", keyName], v)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {config.templateType === "DetailViewTemplate" && config.templateConfig?.tabs && (
                    <div className="space-y-5 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Page Tabs & Blocks</h3>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-[#0070f2]" onClick={() => {
                                const tabs = [...config.templateConfig.tabs];
                                tabs.push({ id: `tab_${tabs.length}`, label: "New Tab", blocks: [] });
                                updateConfig(["templateConfig", "tabs"], tabs);
                            }}><Plus className="size-3 mr-1" /> Add Tab</Button>
                        </div>
                        <SortableList
                            items={config.templateConfig.tabs}
                            onReorder={(newTabs) => updateConfig(["templateConfig", "tabs"], newTabs)}
                            keyExtractor={(tab, idx) => tab.id || `tab_${idx}`}
                            renderItem={(tab: any, tabIndex: number, tabItemId: string) => (
                                <SortableItem id={tabItemId} className="p-3 border rounded-md bg-gray-50/50 space-y-4 pl-8">
                                    <div className="space-y-1.5 pb-2 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-gray-700">Tab: {tab.id}</label>
                                            <button className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                                const tabs = [...config.templateConfig.tabs];
                                                tabs.splice(tabIndex, 1);
                                                updateConfig(["templateConfig", "tabs"], tabs);
                                            }}><Trash2 className="size-3" /></button>
                                        </div>
                                        <Input value={tab.label} onChange={(e) => updateConfig(["templateConfig", "tabs", tabIndex, "label"], e.target.value)} className="h-8 text-sm bg-white" placeholder="Tab Label" />
                                    </div>

                                    <SortableList
                                        items={tab.blocks || []}
                                        onReorder={(newBlocks) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks"], newBlocks)}
                                        keyExtractor={(block, idx) => `${block.type || "block"}_${idx}`}
                                        renderItem={(block: any, blockIndex: number, blockItemId: string) => (
                                            <SortableItem id={blockItemId} className="p-3 border rounded border-gray-200 bg-white space-y-3 relative group pl-8">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="text-[10px] font-bold text-[#0070f2] uppercase tracking-wider">{(block.type || "Block").replace("Block", "")}</div>
                                                    <button className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                                        const blocks = [...config.templateConfig.tabs[tabIndex].blocks];
                                                        blocks.splice(blockIndex, 1);
                                                        updateConfig(["templateConfig", "tabs", tabIndex, "blocks"], blocks);
                                                    }}><Trash2 className="size-3" /></button>
                                                </div>
                                                {block.title !== undefined && (
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs text-gray-600">Block Title</label>
                                                        <Input value={block.title || ""} onChange={(e) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "title"], e.target.value)} className="h-7 text-xs" />
                                                    </div>
                                                )}
                                                {block.dataBinding !== undefined && (
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs text-gray-600">Array Data Binding</label>
                                                        <FieldPathSelect value={block.dataBinding || ""} options={arrayPathOptions} placeholder="Select array path..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "dataBinding"], v)} />
                                                    </div>
                                                )}
                                                {block.type === "DescriptionGridBlock" && (
                                                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] font-medium text-gray-500">Grid Fields</p>
                                                            <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px] text-[#0070f2]" onClick={() => {
                                                                const fields = [...(config.templateConfig.tabs[tabIndex].blocks[blockIndex].fields || [])];
                                                                fields.push({ label: "New Field", key: "", type: "text" });
                                                                updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields"], fields);
                                                            }}><Plus className="size-3" /></Button>
                                                        </div>
                                                        <SortableList
                                                            items={block.fields || []}
                                                            onReorder={(newFields) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields"], newFields)}
                                                            keyExtractor={(field, fieldIdx) => field.key || `field_${fieldIdx}`}
                                                            renderItem={(field: any, fieldIdx: number, fieldItemId: string) => (
                                                                <SortableItem id={fieldItemId} className="flex gap-2 pl-6">
                                                                    <Input value={field.label || ""} placeholder="Label" onChange={(e) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields", fieldIdx, "label"], e.target.value)} className="h-7 text-xs w-[30%]" />
                                                                    <div className="flex-1">
                                                                        <FieldPathSelect value={field.key || ""} options={availableFields} placeholder="Data field..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields", fieldIdx, "key"], v)} />
                                                                    </div>
                                                                    <Select value={field.type || "text"} onValueChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields", fieldIdx, "type"], v)}>
                                                                        <SelectTrigger className="h-7 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                                                                        <SelectContent>{formatOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}</SelectContent>
                                                                    </Select>
                                                                    <button className="text-red-500 hover:text-red-700 px-1" onClick={() => {
                                                                        const fields = [...(config.templateConfig.tabs[tabIndex].blocks[blockIndex].fields || [])];
                                                                        fields.splice(fieldIdx, 1);
                                                                        updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "fields"], fields);
                                                                    }}><Trash2 className="size-3" /></button>
                                                                </SortableItem>
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                                {block.type === "DataTableBlock" && (
                                                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                                                        {(() => {
                                                            const rowFieldOptions = getArrayItemFieldOptions(block.dataBinding);
                                                            return (
                                                                <>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] font-medium text-gray-500">Table Columns</p>
                                                            <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px] text-[#0070f2]" onClick={() => {
                                                                const cols = [...(config.templateConfig.tabs[tabIndex].blocks[blockIndex].columns || [])];
                                                                cols.push({ label: "New Column", key: "", type: "text", align: "left" });
                                                                updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns"], cols);
                                                            }}><Plus className="size-3" /></Button>
                                                        </div>
                                                        <SortableList
                                                            items={block.columns || []}
                                                            onReorder={(newColumns) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns"], newColumns)}
                                                            keyExtractor={(col, colIdx) => col.key || `col_${colIdx}`}
                                                            renderItem={(col: any, colIdx: number, colItemId: string) => (
                                                                <SortableItem id={colItemId} className="flex gap-2 pl-6">
                                                                    <Input value={col.label || ""} placeholder="Label" onChange={(e) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns", colIdx, "label"], e.target.value)} className="h-7 text-xs w-[24%]" />
                                                                    <div className="flex-1">
                                                                        <FieldPathSelect
                                                                            value={col.key || ""}
                                                                            options={rowFieldOptions.length > 0 ? rowFieldOptions : availableFields}
                                                                            placeholder="Row field..."
                                                                            onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns", colIdx, "key"], v)}
                                                                        />
                                                                    </div>
                                                                    <Select value={col.type || "text"} onValueChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns", colIdx, "type"], v)}>
                                                                        <SelectTrigger className="h-7 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                                                                        <SelectContent>{formatOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}</SelectContent>
                                                                    </Select>
                                                                    <button className="text-red-500 hover:text-red-700 px-1" onClick={() => {
                                                                        const cols = [...(config.templateConfig.tabs[tabIndex].blocks[blockIndex].columns || [])];
                                                                        cols.splice(colIdx, 1);
                                                                        updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "columns"], cols);
                                                                    }}><Trash2 className="size-3" /></button>
                                                                </SortableItem>
                                                            )}
                                                        />
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                                {block.type === "TimelineBlock" && (
                                                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                                                        {(() => {
                                                            const timelineFieldOptions = getArrayItemFieldOptions(block.dataBinding);
                                                            const options = timelineFieldOptions.length > 0 ? timelineFieldOptions : availableFields;
                                                            return (
                                                                <>
                                                                    <div className="text-[10px] font-medium text-gray-500">Timeline Field Mapping</div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div className="space-y-1">
                                                                            <label className="text-xs text-gray-600">Title Key</label>
                                                                            <FieldPathSelect value={block.titleKey || ""} options={options} placeholder="Title field..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "titleKey"], v)} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-xs text-gray-600">Time Key</label>
                                                                            <FieldPathSelect value={block.timestampKey || ""} options={options} placeholder="Time field..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "timestampKey"], v)} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-xs text-gray-600">Description Key</label>
                                                                            <FieldPathSelect value={block.descriptionKey || ""} options={options} placeholder="Description field..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "descriptionKey"], v)} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-xs text-gray-600">User Key</label>
                                                                            <FieldPathSelect value={block.userKey || ""} options={options} placeholder="User field..." onChange={(v) => updateConfig(["templateConfig", "tabs", tabIndex, "blocks", blockIndex, "userKey"], v)} />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </SortableItem>
                                        )}
                                    />

                                    <div className="pt-2">
                                        <Select onValueChange={(val) => {
                                            const blocks = [...config.templateConfig.tabs[tabIndex].blocks];
                                            let newBlock: any = { type: val, title: "" };
                                            if (val === "DescriptionGridBlock") newBlock = { ...newBlock, columns: 2, fields: [] };
                                            if (val === "DataTableBlock") newBlock = { ...newBlock, dataBinding: "", columns: [] };
                                            if (val === "TimelineBlock") newBlock = { ...newBlock, dataBinding: "", titleKey: "action", timestampKey: "timestamp", descriptionKey: "details", userKey: "user" };
                                            blocks.push(newBlock);
                                            updateConfig(["templateConfig", "tabs", tabIndex, "blocks"], blocks);
                                        }}>
                                            <SelectTrigger className="w-[120px] h-7 text-xs border-dashed text-[#0070f2]"><Plus className="size-3 mr-1" /> Add Block</SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DescriptionGridBlock" className="text-xs">Description Grid</SelectItem>
                                                <SelectItem value="DataTableBlock" className="text-xs">Data Table</SelectItem>
                                                <SelectItem value="TimelineBlock" className="text-xs">Timeline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </SortableItem>
                            )}
                        />
                    </div>
                )}

                {config.templateConfig?.actionBar?.actions && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-sm font-medium text-gray-900">Action Buttons</h3>
                        </div>
                        <SortableList
                            items={config.templateConfig.actionBar.actions}
                            onReorder={(newActions) => updateConfig(["templateConfig", "actionBar", "actions"], newActions)}
                            keyExtractor={(act, idx) => act.label || `act_${idx}`}
                            renderItem={(act: any, idx: number, actionItemId: string) => (
                                <SortableItem id={actionItemId} className="flex items-center gap-2 pl-6 group/act">
                                    <Input value={act.label} onChange={(e) => {
                                        const acts = [...config.templateConfig.actionBar.actions];
                                        acts[idx].label = e.target.value;
                                        updateConfig(["templateConfig", "actionBar", "actions"], acts);
                                    }} className="h-7 text-xs flex-1" />
                                    <button className="text-red-500 hover:text-red-700 opacity-0 group-hover/act:opacity-100 transition-opacity" onClick={() => {
                                        const acts = [...config.templateConfig.actionBar.actions];
                                        acts.splice(idx, 1);
                                        updateConfig(["templateConfig", "actionBar", "actions"], acts);
                                    }}><Trash2 className="size-4" /></button>
                                </SortableItem>
                            )}
                        />
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 shrink-0">
                <Button variant="outline" className="flex-1" onClick={onDiscard} disabled={!hasChanges}>Discard</Button>
                <Button className="flex-1 bg-[#0070f2] hover:bg-[#005ecb]" onClick={onSave} disabled={!hasChanges}>Save Changes</Button>
            </div>
        </div>
    );
}
