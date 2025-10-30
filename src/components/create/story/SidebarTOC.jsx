import { Plus, FileText } from 'lucide-react';

/**
 * SidebarTOC component - Table of contents sidebar
 * @param {Object} props
 * @param {Array} props.blanks - Array of blank objects
 * @param {Function} props.onAddBlank - Callback to add new blank
 * @param {Function} props.onNavigate - Callback when clicking on a TOC item
 */
export default function SidebarTOC({ blanks, onAddBlank, onNavigate }) {
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Click để cuộn đến phần
        </p>
      </div>

      {/* TOC List */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {blanks.map((blank, index) => (
          <button
            key={blank.id}
            onClick={() => onNavigate(blank.id)}
            className="w-full flex items-start gap-3 px-3 py-2.5 border rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left group"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-medium flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
              {index + 1}
            </span>
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {blank.titleText || 'Untitled'}
            </span>
          </button>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={onAddBlank}
        className="w-full flex items-center justify-center gap-2 py-2.5 mt-4 border-1 border-dashed border-gray-300 dark:border-gray-700 rounded-sm hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
      >
        <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
          Thêm blank
        </span>
      </button>
    </div>
  );
}
