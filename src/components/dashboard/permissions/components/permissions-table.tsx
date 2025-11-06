import React, { useState, useEffect } from 'react';
import { usePermissions } from '../context/permissions-context';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { DataTableRowActions } from './data-table-row-actions';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { CreateModuleDialog } from './create-module-dialog';
import { PermissionsDeleteDialog } from './permissions-delete-dialog';
import { createColumns } from './permissions-columns';
import { PermissionsFormDialog } from './permissions-form-dialog';
import { Permission } from '../data/schema';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@tabler/icons-react';
import { SortableTreeItem } from './sortable-tree';
import { toast } from 'react-toastify';
import { permissionsApi } from '@/api-client';
import Loading from '@/components/common/loading';
import { useLanguage } from '@/contexts/language-context';
import { Input } from '@/components/ui/input';
import { PermissionsPrimaryButtons } from './permissions-primary-buttons';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';

// Component cho mỗi permission item có thể kéo thả
function SortablePermissionItem({
  permission,
  onDelete,
}: {
  permission: Permission;
  onDelete: (permission: Permission) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: permission.permissionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-md border px-4 py-2"
    >
      <div className="flex items-center gap-4">
        <button
          className="cursor-grab touch-none"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="space-y-1">
          <div className="font-medium">{permission.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{permission.httpMethod}</Badge>
            <span>{permission.apiPath}</span>
          </div>
        </div>
      </div>
      <DataTableRowActions
        row={{ original: permission } as any}
        onDelete={onDelete}
      />
    </div>
  );
}

function DroppableArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'other-permissions',
  });
  const { t } = useLanguage();

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'space-y-2 p-4 rounded-lg border-2 border-dashed transition-colors duration-200',
        isOver && 'border-primary bg-muted/60 scale-[1.02]',
        !children &&
          'min-h-[100px] flex items-center justify-center text-muted-foreground'
      )}
    >
      <h3 className="text-lg font-medium">{t('otherPermissions')}</h3>
      {children || <p>{t('dragPermissionHere')}</p>}
    </div>
  );
}

export function PermissionsTable() {
  const { modules, permissions, isLoading, setOpen, setCurrentRow, refetch } =
    usePermissions();
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [openCreateModule, setOpenCreateModule] = useState(false);
  const [deleteData, setDeleteData] = useState<{
    type: 'module' | 'permission';
    data: { permissionId?: string; name: string; module?: string };
  } | null>(null);
  const [openCreatePermission, setOpenCreatePermission] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const [collapsedModules, setCollapsedModules] = useState<
    Record<string, boolean>
  >(() => {
    // Khởi tạo state với tất cả modules đều đóng
    return modules.reduce((acc, moduleName) => {
      acc[moduleName] = true; // true = collapsed
      return acc;
    }, {} as Record<string, boolean>);
  });
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  // Cập nhật collapsedModules khi modules thay đổi
  useEffect(() => {
    setCollapsedModules((prev) => {
      const newState = { ...prev };
      modules.forEach((moduleName) => {
        if (!(moduleName in newState)) {
          newState[moduleName] = true; // Mặc định đóng cho module mới
        }
      });
      return newState;
    });
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleDelete = (permission: Permission) => {
    setDeleteData({
      type: 'permission',
      data: {
        permissionId: permission.permissionId,
        name: permission.name,
        module: permission.module,
      },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveId(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedPermission = permissions.find(
      (p) => p.permissionId === active.id
    );
    if (!draggedPermission) return;

    try {
      let newModule: string | null = null;

      if (modules.includes(over.id as string)) {
        newModule = over.id as string;
      } else {
        newModule = null;
      }

      if (newModule !== draggedPermission.module) {
        const response = await permissionsApi.updatePermission(
          draggedPermission.permissionId,
          {
            module: newModule || undefined,
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message || t('updateModuleError'));
          return;
        }

        await refetch();
        toast.success(response.data.message || t('updateModuleSuccess'));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('errorOccurred');
      toast.error(message);
    }
  };

  const columns = createColumns(expandedModules, handleDelete, t);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">{t('moduleList')}</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setOpenCreatePermission(true)}>
              <IconPlus className="mr-2 h-3 w-3" />
              {t('createPermission')}
            </Button>
            <Button size="sm" onClick={() => setOpenCreateModule(true)}>
              <IconPlus className="mr-2 h-3 w-3" />
              {t('createModule')}
            </Button>
          </div>
        </div>

        {/* Modules và Permissions */}
        <div className="grid gap-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          {modules.map((moduleName) => {
            const modulePermissions = permissions.filter(
              (p) => p.module === moduleName
            );

            return (
              <SortableContext
                key={moduleName}
                items={modulePermissions.map((p) => p.permissionId)}
              >
                <SortableTreeItem
                  id={moduleName}
                  collapsed={collapsedModules[moduleName]}
                  onCollapse={() => toggleCollapse(moduleName)}
                  permission={{
                    permissionId: moduleName,
                    name: moduleName,
                    httpMethod: 'GET',
                    apiPath: '',
                    module: moduleName,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: 'system',
                  }}
                  onDelete={(permission) =>
                    setDeleteData({
                      type: 'module',
                      data: {
                        name: permission.name,
                        module: permission.module,
                      },
                    })
                  }
                  isModule
                >
                  {modulePermissions.map((permission) => (
                    <SortableTreeItem
                      key={permission.permissionId}
                      id={permission.permissionId}
                      permission={permission}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableTreeItem>
              </SortableContext>
            );
          })}
        </div>

        {/* Khu vực Permissions khác */}
        {(isDragging || permissions.some((p) => !p.module)) && (
          <DroppableArea>
            <SortableContext
              items={permissions
                .filter((p) => !p.module)
                .map((p) => p.permissionId)}
            >
              <div className="grid gap-2">
                {permissions
                  .filter((p) => !p.module)
                  .map((permission) => (
                    <SortableTreeItem
                      key={permission.permissionId}
                      id={permission.permissionId}
                      permission={permission}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </SortableContext>
          </DroppableArea>
        )}

        <CreateModuleDialog
          open={openCreateModule}
          onOpenChange={setOpenCreateModule}
        />

        <PermissionsFormDialog
          open={openCreatePermission}
          onOpenChange={setOpenCreatePermission}
        />

        {deleteData && (
          <PermissionsDeleteDialog
            open={!!deleteData}
            onOpenChange={(open) => !open && setDeleteData(null)}
            type={deleteData.type}
            data={deleteData.data}
          />
        )}

        {/* Hiển thị overlay khi kéo */}
        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId ? (
            <div className="rounded-md border bg-background px-4 py-2 shadow-lg scale-105">
              {permissions.find((p) => p.permissionId === activeId)?.name}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
