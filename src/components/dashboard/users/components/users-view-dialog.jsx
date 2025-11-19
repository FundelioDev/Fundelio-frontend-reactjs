import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Collapse,
  CollapseContent,
  CollapseTrigger,
} from '@/components/ui/collapse';
import {
  IconCalendar,
  IconCheck,
  IconFlag,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShield,
  IconUser,
  IconUserCircle,
  IconX,
  IconFileText,
  IconClock,
  IconUserPlus,
} from '@tabler/icons-react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

export function UsersViewDialog({ currentRow, open, onOpenChange }) {
  const [openModules, setOpenModules] = useState({});

  if (!currentRow) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const toggleModule = (roleId, module) => {
    setOpenModules((prev) => ({
      ...prev,
      [`${roleId}-${module}`]: !prev[`${roleId}-${module}`],
    }));
  };

  // Group permissions by module for each role
  const getRolePermissionsByModule = (permissions) => {
    if (!permissions || permissions.length === 0) return {};
    
    return permissions.reduce((acc, permission) => {
      const module = permission.module ?? 'Other';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {});
  };

  const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className='mt-1'>
        <Icon className='h-4 w-4 text-slate-500' />
      </div>
      <div className='flex-1'>
        <p className='text-xs text-slate-500 mb-1'>{label}</p>
        <p className='text-sm text-slate-900 dark:text-slate-100'>
          {value || 'Chưa có thông tin'}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[900px] p-0 gap-0 overflow-hidden dark:bg-zinc-700 dark:border-zinc-800 border-slate-200 shadow-lg'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className='w-full'
        >
          <DialogHeader className='p-6 pb-4 border-b bg-slate-50 dark:bg-zinc-800'>
            <div className='flex items-start gap-4'>
              <Avatar className='h-16 w-16 rounded-lg border-2 border-slate-200'>
                <AvatarImage
                  src={
                    currentRow.avatarUrl ||
                    currentRow.avatar ||
                    `https://ui-avatars.com/api/?name=${currentRow.firstName}+${currentRow.lastName}&size=64&background=random`
                  }
                  alt={`${currentRow.firstName} ${currentRow.lastName}`}
                />
                <AvatarFallback className='rounded-lg bg-slate-100 dark:bg-slate-600'>
                  <IconUserCircle className='h-8 w-8 text-slate-400' />
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <DialogTitle className='text-xl'>
                  {currentRow.firstName} {currentRow.lastName}
                  {currentRow.nickname && (
                    <span className='text-slate-500 ml-2'>
                      (@{currentRow.nickname})
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className='text-slate-500 mt-1'>
                  {currentRow.email}
                </DialogDescription>
                <div className='flex gap-2 mt-2'>
                  {currentRow.isVerified ? (
                    <Badge
                      variant='outline'
                      className='text-green-600 border-green-600'
                    >
                      <IconCheck className='h-3 w-3 mr-1' />
                      Đã xác minh
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-red-600 border-red-600'
                    >
                      <IconX className='h-3 w-3 mr-1' />
                      Chưa xác minh
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className='h-[65vh] px-6 py-4'>
            <div className='space-y-6'>
              {/* Thông tin liên hệ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className='bg-white dark:bg-zinc-800 p-5 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm'
              >
                <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
                  <IconUser className='h-5 w-5' />
                  Thông tin liên hệ
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InfoItem
                    icon={IconMail}
                    label='Email'
                    value={currentRow.email}
                  />
                  <InfoItem
                    icon={IconPhone}
                    label='Số điện thoại'
                    value={currentRow.phoneNumber}
                  />
                  <InfoItem
                    icon={IconFlag}
                    label='Quốc tịch'
                    value={currentRow.nationality}
                  />
                  <InfoItem
                    icon={IconMapPin}
                    label='Thành phố'
                    value={currentRow.city}
                  />
                </div>
              </motion.div>

              {/* Tiểu sử */}
              {currentRow.biography && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className='bg-white dark:bg-zinc-800 p-5 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm'
                >
                  <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
                    <IconFileText className='h-5 w-5' />
                    Tiểu sử
                  </h3>
                  <p className='text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap'>
                    {currentRow.biography}
                  </p>
                </motion.div>
              )}

              {/* Vai trò và quyền */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className='bg-white dark:bg-zinc-800 p-5 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm'
              >
                <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
                  <IconShield className='h-5 w-5' />
                  Vai trò và quyền
                </h3>
                {currentRow.roles && currentRow.roles.length > 0 ? (
                  <div className='space-y-4'>
                    {currentRow.roles.map((role, index) => (
                      <div
                        key={role.roleId || index}
                        className='border border-slate-200 dark:border-zinc-700 rounded-md p-4'
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div>
                            <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                              {role.name}
                            </h4>
                            {role.description && (
                              <p className='text-xs text-slate-500 mt-1'>
                                {role.description}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={role.active ? 'default' : 'secondary'}
                          >
                            {role.active ? 'Đang hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </div>
                        {role.permissions && role.permissions.length > 0 && (
                          <>
                            <Separator className='my-3' />
                            <div>
                              <p className='text-xs font-medium text-slate-700 dark:text-slate-300 mb-3'>
                                Quyền hạn ({role.permissions.length})
                              </p>
                              <div className='space-y-2'>
                                {Object.entries(getRolePermissionsByModule(role.permissions)).map(
                                  ([module, modulePermissions]) => (
                                    <Collapse
                                      key={`${role.roleId}-${module}`}
                                      open={openModules[`${role.roleId}-${module}`]}
                                      onOpenChange={() => toggleModule(role.roleId, module)}
                                    >
                                      <div className='w-full rounded-t-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 transition-colors px-4 py-2.5'>
                                        <CollapseTrigger className='flex items-center gap-3 w-full'>
                                          <ChevronRight
                                            className={cn(
                                              'h-4 w-4 shrink-0 transition-transform duration-200 text-slate-700 dark:text-slate-300',
                                              openModules[`${role.roleId}-${module}`] && 'rotate-90'
                                            )}
                                          />
                                          <span className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                            {module}
                                          </span>
                                          <Badge variant='secondary' className='ml-auto'>
                                            {modulePermissions.length}
                                          </Badge>
                                        </CollapseTrigger>
                                      </div>
                                      <CollapseContent className='divide-y divide-slate-200 dark:divide-slate-600 border-x border-b border-slate-300 dark:border-slate-600 rounded-b-lg bg-white dark:bg-zinc-800'>
                                        {modulePermissions.map((permission) => (
                                          <div
                                            key={permission.permissionId}
                                            className='flex items-start justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors'
                                          >
                                            <div className='flex flex-col gap-1 flex-1'>
                                              <span className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                                {permission.name}
                                              </span>
                                              <span className='text-xs text-slate-500 dark:text-slate-400'>
                                                {permission.apiPath}
                                              </span>
                                            </div>
                                            <Badge
                                              variant='outline'
                                              className='ml-3 shrink-0'
                                            >
                                              {permission.httpMethod}
                                            </Badge>
                                          </div>
                                        ))}
                                      </CollapseContent>
                                    </Collapse>
                                  )
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-slate-500'>
                    Chưa được gán vai trò nào
                  </p>
                )}
              </motion.div>

              {/* Thông tin hệ thống */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className='bg-white dark:bg-zinc-800 p-5 rounded-md border border-slate-200 dark:border-zinc-700 shadow-sm'
              >
                <h3 className='text-md font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
                  <IconClock className='h-5 w-5' />
                  Thông tin hệ thống
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InfoItem
                    icon={IconCalendar}
                    label='Ngày tạo'
                    value={formatDate(currentRow.createdAt)}
                  />
                  <InfoItem
                    icon={IconCalendar}
                    label='Ngày cập nhật'
                    value={formatDate(currentRow.updatedAt)}
                  />
                  <InfoItem
                    icon={IconUserPlus}
                    label='Người tạo'
                    value={currentRow.createdBy}
                  />
                  <InfoItem
                    icon={IconUser}
                    label='ID người dùng'
                    value={currentRow.userId}
                    className='md:col-span-2'
                  />
                </div>
              </motion.div>
            </div>
          </ScrollArea>

          <DialogFooter className='p-6 border-t flex gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900'
            >
              Đóng
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

