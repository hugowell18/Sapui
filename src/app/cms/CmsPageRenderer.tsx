import { DataListTemplate } from "./templates/DataListTemplate";
import { DetailViewTemplate } from "./templates/DetailViewTemplate";
import { CmsPageConfig } from "./schema";

export function CmsPageRenderer({ config, context }: { config: CmsPageConfig; context?: any }) {
    switch (config.templateType) {
        case "DataListTemplate":
            return <DataListTemplate config={config} />;
        case "DetailViewTemplate":
            return <DetailViewTemplate config={config} context={context} />;
        default:
            return (
                <div className="p-6 text-red-500">
                    Unknown Template Type: {config.templateType}
                </div>
            );
    }
}

