import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function SortableItem({ id, children, className = "" }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`relative group ${className} ${isDragging ? "ring-2 ring-[#0070f2] shadow-lg rounded z-50 bg-white" : "hover:bg-gray-50/80"} cursor-grab active:cursor-grabbing transition-colors`}
        >
            {/* Optional visible grip (now the whole row is draggable) */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-full flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="size-3" />
            </div>

            {/* Content Slot */}
            <div className={`w-full ${isDragging ? "pointer-events-none" : ""}`}>
                {children}
            </div>
        </div>
    );
}
