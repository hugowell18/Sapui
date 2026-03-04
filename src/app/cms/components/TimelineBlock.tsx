import { resolvePath } from "../utils";

export function TimelineBlock({ config, context }: { config: any; context?: any }) {
    const data = context?.data || {};
    // expect an array at dataBinding path
    const timelineData = resolvePath(data, config.dataBinding) || [];

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!Array.isArray(timelineData)) {
        return <div className="p-4 text-red-500">Timeline dataBinding must point to an array.</div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            {config.title && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-sm text-gray-700">{config.title}</h3>
                </div>
            )}

            <div className="p-6">
                <div className="space-y-4">
                    {timelineData.map((entry: any, index: number) => (
                        <div key={entry.id || index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="size-2 rounded-full bg-[#0070f2]"></div>
                                {index < timelineData.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                )}
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-sm text-gray-900">
                                        {resolvePath(entry, config.titleKey || "action")}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDateTime(resolvePath(entry, config.timestampKey || "timestamp"))}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                    {resolvePath(entry, config.descriptionKey || "details")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    by {resolvePath(entry, config.userKey || "user")}
                                </p>
                            </div>
                        </div>
                    ))}

                    {timelineData.length === 0 && (
                        <p className="text-sm text-gray-500">No history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
