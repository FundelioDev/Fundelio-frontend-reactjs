import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export const CampaignsFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  return (
    <Card className='p-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Tìm kiếm chiến dịch...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue placeholder='Lọc theo trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value='pending'>Chờ duyệt</SelectItem>
            <SelectItem value='approved'>Đã duyệt</SelectItem>
            <SelectItem value='rejected'>Từ chối</SelectItem>
            <SelectItem value='active'>Đang gây quỹ</SelectItem>
            <SelectItem value='successful'>Thành công</SelectItem>
            <SelectItem value='failed'>Thất bại</SelectItem>
            <SelectItem value='paused'>Tạm dừng</SelectItem>
            <SelectItem value='ended'>Kết thúc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
