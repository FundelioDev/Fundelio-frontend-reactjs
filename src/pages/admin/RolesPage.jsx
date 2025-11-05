import { useState } from 'react';
import { mockRoles } from '@/data/mockAdminData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  Users,
  Edit,
  Trash2,
  Plus,
  Key,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [openModules, setOpenModules] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewRoleDetail = (role) => {
    setSelectedRole(role);
    setShowDetailDialog(true);
  };

  const editRole = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions || []);
    // Mở tất cả modules khi edit
    const allModules = Object.keys(groupPermissionsByModule(role.permissions));
    const initialOpenState = {};
    allModules.forEach((module) => {
      initialOpenState[module] = true;
    });
    setOpenModules(initialOpenState);
    setShowEditDialog(true);
  };

  const deleteRole = (role) => {
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setRoles(roles.filter((r) => r.id !== selectedRole.id));
    setShowDeleteDialog(false);
    setSelectedRole(null);
  };

  const getPermissionBadge = (permission) => {
    const permissionLabels = {
      read: 'Xem',
      write: 'Ghi',
      delete: 'Xóa',
      manage_users: 'Quản lý User',
      manage_campaigns: 'Quản lý Campaign',
      manage_roles: 'Quản lý Role',
      create_campaign: 'Tạo Campaign',
      pledge: 'Ủng hộ',
    };

    return (
      <Badge variant='outline' className='text-xs mr-1 mb-1'>
        {permissionLabels[permission] || permission}
      </Badge>
    );
  };

  // Nhóm permissions theo module
  const groupPermissionsByModule = (permissions) => {
    const grouped = {};

    permissions.forEach((permission) => {
      let module = 'Chung';
      let name = permission;
      let apiPath = '';
      let httpMethod = 'GET';

      if (permission.includes('manage_users')) {
        module = 'Quản lý Người dùng';
        name = 'Quản lý User';
        apiPath = '/api/users';
        httpMethod = 'ALL';
      } else if (permission.includes('manage_campaigns')) {
        module = 'Quản lý Chiến dịch';
        name = 'Quản lý Campaign';
        apiPath = '/api/campaigns';
        httpMethod = 'ALL';
      } else if (permission.includes('manage_roles')) {
        module = 'Quản lý Vai trò';
        name = 'Quản lý Role';
        apiPath = '/api/roles';
        httpMethod = 'ALL';
      } else if (permission.includes('create_campaign')) {
        module = 'Chiến dịch';
        name = 'Tạo Campaign';
        apiPath = '/api/campaigns';
        httpMethod = 'POST';
      } else if (permission.includes('pledge')) {
        module = 'Chiến dịch';
        name = 'Ủng hộ';
        apiPath = '/api/pledges';
        httpMethod = 'POST';
      } else if (permission === 'read') {
        module = 'Quyền cơ bản';
        name = 'Xem';
        apiPath = '/api/*';
        httpMethod = 'GET';
      } else if (permission === 'write') {
        module = 'Quyền cơ bản';
        name = 'Ghi';
        apiPath = '/api/*';
        httpMethod = 'POST';
      } else if (permission === 'delete') {
        module = 'Quyền cơ bản';
        name = 'Xóa';
        apiPath = '/api/*';
        httpMethod = 'DELETE';
      }

      if (!grouped[module]) {
        grouped[module] = [];
      }

      grouped[module].push({
        id: permission,
        name: name,
        apiPath: apiPath,
        httpMethod: httpMethod,
      });
    });

    return grouped;
  };

  const toggleModule = (module) => {
    setOpenModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const isModuleChecked = (modulePermissions) => {
    return modulePermissions.every((p) => selectedPermissions.includes(p.id));
  };

  const handleModulePermissionChange = (module, checked, modulePermissions) => {
    if (checked) {
      const newPermissions = [
        ...selectedPermissions,
        ...modulePermissions
          .map((p) => p.id)
          .filter((id) => !selectedPermissions.includes(id)),
      ];
      setSelectedPermissions(newPermissions);
    } else {
      const moduleIds = modulePermissions.map((p) => p.id);
      setSelectedPermissions(
        selectedPermissions.filter((id) => !moduleIds.includes(id))
      );
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            Quản lý vai trò
          </h2>
          <p className='text-sm text-gray-600 dark:text-text-white mt-1'>
            Tổng {filteredRoles.length} vai trò
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className='gap-2'
            >
              <LayoutGrid className='w-4 h-4' />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('table')}
              className='gap-2 text-gray-900 dark:text-gray-100'
            >
              <List className='w-4 h-4' />
              Bảng
            </Button>
          </div>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Thêm vai trò
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            placeholder='Tìm kiếm vai trò...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredRoles.map((role) => (
            <Card
              key={role.id}
              className='p-6 hover:shadow-lg transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center space-x-3'>
                  <div className='p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                    <Shield className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
                      {role.name}
                    </h3>
                    <div className='flex items-center text-sm text-gray-600 dark:text-text-white mt-1'>
                      <Users className='w-4 h-4 mr-1' />
                      {role.userCount} người dùng
                    </div>
                  </div>
                </div>
              </div>

              <p className='text-sm text-gray-600 dark:text-text-white mb-4 line-clamp-2'>
                {role.description}
              </p>

              <div className='mb-4'>
                <div className='flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2'>
                  <Key className='w-4 h-4 mr-1' />
                  Quyền hạn ({role.permissions.length})
                </div>
                <div className='flex flex-wrap gap-2'>
                  {role.permissions.slice(0, 3).map((permission) => (
                    <span key={permission}>
                      {getPermissionBadge(permission)}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant='secondary' className='text-xs'>
                      +{role.permissions.length - 3} khác
                    </Badge>
                  )}
                </div>
              </div>

              <div className='flex items-center space-x-2 pt-4 border-t'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={() => viewRoleDetail(role)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => editRole(role)}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => deleteRole(role)}
                >
                  <Trash2 className='w-4 h-4 text-red-600' />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 dark:bg-gray-800'>
                <TableHead className='w-[50px]'>#</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className='text-center'>Người dùng</TableHead>
                <TableHead>Quyền hạn</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role, index) => (
                <TableRow
                  key={role.id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                  onClick={() => viewRoleDetail(role)}
                >
                  <TableCell className='font-medium text-gray-500 dark:text-text-white'>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                        <Shield className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900 dark:text-gray-100'>
                          {role.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-text-white'>
                          ID: #{role.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className='text-sm text-gray-600 dark:text-text-white max-w-xs line-clamp-2'>
                      {role.description}
                    </p>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full'>
                      <Users className='w-4 h-4 text-gray-600 dark:text-text-white' />
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {role.userCount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap items-center gap-1 max-w-xs'>
                      {role.permissions.slice(0, 2).map((permission) => (
                        <span key={permission}>
                          {getPermissionBadge(permission)}
                        </span>
                      ))}
                      {role.permissions.length > 2 && (
                        <Badge
                          variant='secondary'
                          className='text-xs bg-gray-200 dark:bg-gray-700'
                        >
                          +{role.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-gray-600 dark:text-text-white'>
                      {role.createdAt}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className='flex items-center justify-end space-x-2'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => editRole(role)}
                        title='Chỉnh sửa'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => deleteRole(role)}
                        title='Xóa'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRoles.length === 0 && (
            <div className='text-center py-12'>
              <Shield className='w-12 h-12 text-gray-300 dark:text-text-white mx-auto mb-4' />
              <p className='text-gray-500 dark:text-text-white'>
                Không tìm thấy vai trò nào
              </p>
            </div>
          )}
        </div>
      )}

      {/* Role Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-gray-900 dark:text-gray-100'>
              Chi tiết vai trò
            </DialogTitle>
            <DialogDescription className='text-gray-600 dark:text-text-white'>
              Thông tin chi tiết về vai trò và quyền hạn
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <div className='p-4 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                  <Shield className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                    {selectedRole.name}
                  </h3>
                  <p className='text-gray-600 dark:text-text-white'>
                    {selectedRole.description}
                  </p>
                  <div className='flex items-center text-sm text-gray-600 dark:text-text-white mt-2'>
                    <Users className='w-4 h-4 mr-1' />
                    {selectedRole.userCount} người dùng
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t dark:border-gray-700'>
                <h4 className='font-semibold mb-3 text-gray-900 dark:text-gray-100'>
                  Quyền hạn
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {selectedRole.permissions.map((permission) => (
                    <span key={permission}>
                      {getPermissionBadge(permission)}
                    </span>
                  ))}
                </div>
              </div>

              <div className='pt-4 border-t dark:border-gray-700'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-text-white'>
                      Ngày tạo
                    </p>
                    <p className='font-medium text-gray-900 dark:text-gray-100'>
                      {selectedRole.createdAt}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-text-white'>
                      ID vai trò
                    </p>
                    <p className='font-medium text-gray-900 dark:text-gray-100'>
                      #{selectedRole.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDetailDialog(false)}
            >
              Đóng
            </Button>
            <Button onClick={() => editRole(selectedRole)}>Chỉnh sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-gray-900 dark:text-gray-100'>
              Chỉnh sửa vai trò
            </DialogTitle>
            <DialogDescription className='text-gray-600 dark:text-text-white'>
              Cập nhật thông tin vai trò
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className='space-y-4'>
              <div>
                <Label
                  htmlFor='roleName'
                  className='text-gray-900 dark:text-gray-100'
                >
                  Tên vai trò
                </Label>
                <Input
                  id='roleName'
                  defaultValue={selectedRole.name}
                  className='mt-1'
                />
              </div>
              <div>
                <Label
                  htmlFor='roleDescription'
                  className='text-gray-900 dark:text-gray-100'
                >
                  Mô tả
                </Label>
                <Textarea
                  id='roleDescription'
                  defaultValue={selectedRole.description}
                  className='mt-1'
                  rows={3}
                />
              </div>
              <div>
                <Label className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                  Quyền hạn
                </Label>
                <div className='mt-3 space-y-2 max-h-[400px] overflow-y-auto'>
                  {Object.entries(
                    groupPermissionsByModule(selectedRole.permissions)
                  ).map(([module, modulePermissions]) => (
                    <Collapsible
                      key={module}
                      open={openModules[module]}
                      onOpenChange={() => toggleModule(module)}
                    >
                      <div className='w-full rounded-t-lg border bg-white dark:bg-darker-2 border-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors px-4 py-3'>
                        <div className='flex items-center justify-between w-full'>
                          <CollapsibleTrigger className='flex items-center gap-3 flex-1'>
                            <ChevronRight
                              className={cn(
                                'h-4 w-4 shrink-0 transition-transform duration-200 text-slate-600 dark:text-slate-300',
                                openModules[module] && 'rotate-90'
                              )}
                            />
                            <span className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                              {module}
                            </span>
                          </CollapsibleTrigger>
                          <Switch
                            checked={isModuleChecked(modulePermissions)}
                            onCheckedChange={(checked) =>
                              handleModulePermissionChange(
                                module,
                                checked,
                                modulePermissions
                              )
                            }
                            className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700'
                          />
                        </div>
                      </div>
                      <CollapsibleContent className='divide-y divide-slate-100 dark:divide-slate-700 border-x border-b rounded-b-lg bg-white dark:bg-darker-2/50 border-border'>
                        {modulePermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className='flex items-center justify-between px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
                          >
                            <div className='flex flex-col gap-1'>
                              <span className='text-sm font-medium text-slate-700 dark:text-slate-100'>
                                {permission.name}
                              </span>
                              <span className='text-xs text-slate-500 dark:text-slate-400'>
                                {permission.apiPath} ({permission.httpMethod})
                              </span>
                            </div>
                            <Switch
                              checked={selectedPermissions.includes(
                                permission.id
                              )}
                              onCheckedChange={(checked) => {
                                handlePermissionChange(permission.id, checked);
                              }}
                              className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700'
                            />
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-gray-900 dark:text-gray-100'>
              Xác nhận xóa vai trò
            </DialogTitle>
            <DialogDescription className='text-gray-600 dark:text-text-white'>
              Bạn có chắc chắn muốn xóa vai trò "{selectedRole?.name}"? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Xóa vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
