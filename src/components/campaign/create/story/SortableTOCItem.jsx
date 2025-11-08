import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

/**
 * SortableTOCItem - Individual draggable TOC item with grip handle
 * @param {Object} props
 * @param {Object} props.blank - Blank data object
 * @param {number} props.index - Index in the list (for display)
 * @param {Function} props.onNavigate - Callback when clicking the item
 * @param {Function} props.onDelete - Callback when deleting the item
 * @param {boolean} props.canDelete - Whether the item can be deleted
 */
export default function SortableTOCItem({ blank, index, onNavigate, onDelete, canDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: blank.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (canDelete && onDelete) {
            onDelete(blank.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-full min-w-0 flex items-start gap-2 px-3 py-2.5 border rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-0.5 -ml-1"
                aria-label="Drag to reorder"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            {/* Item Content (clickable for navigation) */}
            <button
                onClick={() => onNavigate(blank.id)}
                className="flex-1 min-w-0 flex items-start gap-3 text-left"
            >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-medium flex items-center justify-center text-gray-600 dark:text-text-white group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                </span>
                <span className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors break-words">
                    {blank.titleText || 'Untitled'}
                </span>
            </button>

            {/* Delete Button */}
            {canDelete && (
                <button
                    onClick={handleDelete}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-all p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Delete blank"
                    title="Xóa blank"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}
