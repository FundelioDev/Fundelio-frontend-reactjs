import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, UserPlus } from 'lucide-react';

export const UsersTableHeader = ({
  totalUsers,
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterChange,
  onAddUser,
}) => {
  return (
    <>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            Quản lý người dùng
          </h2>
          <p className='text-sm text-gray-600 dark:text-text-white mt-1'>
            Tổng {totalUsers} người dùng
          </p>
        </div>
        <Button onClick={onAddUser}>
          <UserPlus className='w-4 h-4 mr-2' />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <Card className='p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm theo tên hoặc email...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select value={filterRole} onValueChange={onFilterChange}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Lọc theo vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả vai trò</SelectItem>
              <SelectItem value='Admin'>Admin</SelectItem>
              <SelectItem value='Moderator'>Moderator</SelectItem>
              <SelectItem value='Creator'>Creator</SelectItem>
              <SelectItem value='User'>User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </>
  );
};
