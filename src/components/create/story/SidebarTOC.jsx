import { Plus, FileText } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableTOCItem from './SortableTOCItem';

/**
 * SidebarTOC component - Table of contents sidebar with drag-and-drop reordering
 * @param {Object} props
 * @param {Array} props.blanks - Array of blank objects (already ordered)
 * @param {Function} props.onAddBlank - Callback to add new blank
 * @param {Function} props.onNavigate - Callback when clicking on a TOC item
 * @param {Function} props.onReorder - Callback when reordering blanks
 * @param {Function} props.onDelete - Callback when deleting a blank
 */
export default function SidebarTOC({ blanks, onAddBlank, onNavigate, onReorder, onDelete }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = blanks.findIndex((blank) => blank.id === active.id);
    const newIndex = blanks.findIndex((blank) => blank.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const blankIds = blanks.map((b) => b.id);
      const newOrder = arrayMove(blankIds, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  // Custom modifier to restrict to vertical axis
  const restrictToVerticalAxis = ({ transform }) => {
    return {
      ...transform,
      x: 0, // Lock horizontal movement
    };
  };
  return (
    <div
      className="flex flex-col bg-white dark:bg-darker-2 p-4
                 lg:sticky lg:top-20 lg:max-h-[80vh] lg:rounded-sm lg:border lg:border-gray-200 dark:lg:border-gray-800"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Mục lục
        </h3>
        <p className="text-xs text-gray-500 dark:text-text-white mt-1">
          Kéo để sắp xếp, click để cuộn
        </p>
      </div>

      {/* TOC List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
        autoScroll={false}
      >
        <SortableContext
          items={blanks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-1 scrollbar-hide">
            {blanks.map((blank, index) => (
              <SortableTOCItem
                key={blank.id}
                blank={blank}
                index={index}
                onNavigate={onNavigate}
                onDelete={onDelete}
                canDelete={blanks.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Button */}
      <button
        onClick={onAddBlank}
        className="w-full flex items-center justify-center gap-2 py-2.5 mt-4 border-1 border-dashed border-gray-300 dark:border-gray-700 rounded-sm hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
      >
        <Plus className="w-4 h-4 text-gray-500 dark:text-text-white group-hover:text-primary transition-colors" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
          Thêm blank
        </span>
      </button>
    </div>
  );
}
