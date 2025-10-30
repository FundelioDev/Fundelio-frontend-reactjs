import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const PermissionsFilters = ({
  searchTerm,
  onSearchChange,
  categories,
  filterCategory,
  onFilterChange,
}) => {
  return (
    <Card className='p-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Tìm kiếm quyền hạn...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='flex gap-2'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              size='sm'
              onClick={() => onFilterChange(category)}
            >
              {category === 'all' ? 'Tất cả' : category}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
