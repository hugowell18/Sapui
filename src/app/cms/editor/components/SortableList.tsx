import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface SortableListProps<T> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (item: T, index: number, itemId: string) => React.ReactNode;
    keyExtractor: (item: T, index: number) => string;
}

export function SortableList<T>({ items, onReorder, renderItem, keyExtractor }: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px of movement before drag activates (allows clicking)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item, idx) => `${keyExtractor(item, idx)}__${idx}` === active.id);
            const newIndex = items.findIndex((item, idx) => `${keyExtractor(item, idx)}__${idx}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                onReorder(arrayMove(items, oldIndex, newIndex));
            }
        }
    };

    // Extract all string keys to pass to SortableContext
    const itemsIds = items.map((item, index) => `${keyExtractor(item, index)}__${index}`);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext items={itemsIds} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                    {items.map((item, index) => {
                        const itemId = `${keyExtractor(item, index)}__${index}`;
                        return (
                            <div key={itemId}>
                                {renderItem(item, index, itemId)}
                            </div>
                        );
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
