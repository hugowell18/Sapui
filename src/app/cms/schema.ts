export type CmsTemplateType = "DataListTemplate" | "DashboardTemplate" | "DetailViewTemplate";

export interface CmsPageHeader {
    title: string;
    subtitle?: string;
}

export interface CmsPageConfig {
    pageId: string;
    templateType: CmsTemplateType;
    pageHeader?: CmsPageHeader;
    templateConfig: any;
    version?: number;
}

const createDataListTemplateConfig = () => ({
    actionBar: {
        filters: [],
        actions: [],
    },
    content: {
        type: "DataTableBlock",
        dataSourceEndpoint: "",
        rowClickAction: "none",
        columns: [],
    },
});

const createDetailViewTemplateConfig = () => ({
    header: {
        title: "",
        titleBinding: "",
        subtitle: "",
        subtitleBinding: "",
        statusBinding: "",
        priorityBinding: "",
    },
    actionBar: {
        actions: [],
    },
    tabs: [],
});

const createDefaultTemplateConfig = (templateType: CmsTemplateType) => {
    switch (templateType) {
        case "DataListTemplate":
            return createDataListTemplateConfig();
        case "DetailViewTemplate":
            return createDetailViewTemplateConfig();
        default:
            return {};
    }
};

const deepMerge = (base: any, incoming: any): any => {
    if (Array.isArray(base)) {
        return Array.isArray(incoming) ? incoming : base;
    }
    if (base && typeof base === "object") {
        const source = incoming && typeof incoming === "object" ? incoming : {};
        const result: Record<string, any> = { ...source };
        Object.keys(base).forEach((key) => {
            result[key] = deepMerge(base[key], source[key]);
        });
        return result;
    }
    return incoming === undefined ? base : incoming;
};

export function normalizeCmsConfig(rawConfig: any): CmsPageConfig {
    const templateType: CmsTemplateType = rawConfig?.templateType || "DataListTemplate";
    const defaults = createDefaultTemplateConfig(templateType);
    const legacyTemplateConfig = rawConfig?.templateConfig ?? rawConfig?.content ?? {};
    const mergedTemplateConfig = deepMerge(defaults, legacyTemplateConfig);

    return {
        pageId: rawConfig?.pageId || "untitled-page",
        templateType,
        pageHeader: rawConfig?.pageHeader,
        templateConfig: mergedTemplateConfig,
        version: rawConfig?.version || 1,
    };
}

