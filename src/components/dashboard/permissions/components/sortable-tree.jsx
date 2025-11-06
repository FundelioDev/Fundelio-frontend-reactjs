import {
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronRight,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DataTableRowActions } from './data-table-row-actions';
import { Button } from '@/components/ui/button';
import { useDroppable } from '@dnd-kit/core';

const animateLayoutChanges = (args) => {
  const { isSorting, isDragging } = args;

  if (isSorting || isDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export function SortableTreeItem({
  id,
  children,
  collapsed,
  onCollapse,
  permission,
  onDelete,
  isModule = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: id,
    data: {
      isModule,
      module: permission.module,
    },
  });

  const setRefs = (el) => {
    setSortableRef(el);
    if (isModule) {
      setDroppableRef(el);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        'flex flex-col rounded-md border transition-colors duration-200',
        isDragging && 'opacity-30 scale-95',
        isModule && 'bg-muted/30',
        isModule && 'hover:bg-muted/50',
        isOver && 'ring-2 ring-primary ring-offset-2 bg-muted/60',
        isModule && isOver && 'scale-[1.02]'
      )}
    >
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          {!isModule && (
            <button
              className="cursor-grab touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {children && (
            <button onClick={onCollapse} className="flex items-center">
              <ChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  !collapsed && 'rotate-90'
                )}
              />
            </button>
          )}

          <div className="flex items-center gap-2">
            {isModule ? (
              <>
                <Badge variant="outline" className="font-semibold">
                  {permission.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({children?.length || 0})
                </span>
              </>
            ) : (
              <>
                <div className="font-medium text-sm">{permission.name}</div>
                <Badge variant="secondary" className="text-xs">
                  {permission.httpMethod}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {permission.apiPath}
                </span>
              </>
            )}
          </div>
        </div>

        {isModule ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-100"
            onClick={() => onDelete(permission)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ) : (
          <DataTableRowActions
            row={{ original: permission }}
            onDelete={onDelete}
          />
        )}
      </div>

      {!collapsed && children && (
        <div className="pl-8 pr-2 pb-2 max-h-[50vh] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

