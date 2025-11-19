import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const useColumns = () => {
  return [
    {
      id: 'avatar',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Ảnh đại diện"
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'User';
        
        // Ưu tiên lấy avatarUrl từ API, sau đó mới dùng API tự động tạo
        const avatarUrl =
          user.avatarUrl || 
          user.avatar || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName
          )}&size=40&background=random&color=fff`;

        return (
          <div className="flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer hover:scale-110 transition-transform ring-offset-background border-2 border-transparent hover:border-slate-300">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback>
                      {fullName
                        .split(' ')
                        .map((name) => name[0] || '')
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-slate-800 text-white max-w-[200px]"
                >
                  <p className="truncate">{fullName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Email"
        />
      ),
      cell: ({ row }) => {
        const email = row.getValue('email') || 'N/A';
        return (
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="bg-blue-50 dark:bg-zinc-700 dark:text-slate-100 text-blue-700 hover:bg-blue-100 font-normal max-w-full overflow-hidden"
              title={email}
            >
              <span className="truncate block max-w-[180px]">{email}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tên"
        />
      ),
      cell: ({ row }) => {
        const firstName = row.getValue('firstName') || 'N/A';
        return (
          <Badge
            variant="outline"
            className="font-normal bg-slate-50 dark:bg-slate-600 dark:text-slate-200 text-slate-700 hover:bg-slate-100 transition-colors hover:scale-105 max-w-full"
            title={firstName}
          >
            <span className="truncate block max-w-[130px]">{firstName}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Họ"
        />
      ),
      cell: ({ row }) => {
        const lastName = row.getValue('lastName') || 'N/A';
        return (
          <Badge
            variant="outline"
            className="font-normal bg-slate-50 dark:bg-slate-600 dark:text-slate-200 text-slate-700 hover:bg-slate-100 transition-colors hover:scale-105 max-w-full"
            title={lastName}
          >
            <span className="truncate block max-w-[130px]">{lastName}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isVerified',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Trạng thái"
        />
      ),
      cell: ({ row }) => {
        let isVerified = false;
        try {
          isVerified = Boolean(row.getValue('isVerified'));
        } catch (error) {
          console.error('Error reading verification status:', error);
        }

        return (
          <Badge
            variant={isVerified ? 'default' : 'secondary'}
            className={cn(
              'hover:scale-105 transition-transform cursor-default truncate',
              isVerified
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            )}
          >
            {isVerified
              ? 'Đã xác minh'
              : 'Chưa xác minh'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Vai trò"
        />
      ),
      cell: ({ row }) => {
        let roles = [];
        try {
          const rolesValue = row.getValue('roles');
          roles = Array.isArray(rolesValue) ? rolesValue : [];
        } catch (error) {
          console.error('Lỗi khi đọc vai trò:', error);
        }

        if (!roles || roles.length === 0) {
          return <span className="text-muted-foreground italic">Không có</span>;
        }

        const maxVisibleRoles = 2;
        const visibleRoles = roles.slice(0, maxVisibleRoles);
        const remainingCount = roles.length - maxVisibleRoles;

        const getRoleColor = (roleName = '') => {
          const roleColors = {
            ADMIN: {
              bg: 'bg-purple-100',
              text: 'text-purple-700',
              hover: 'hover:bg-purple-200',
            },
            USER: {
              bg: 'bg-blue-100',
              text: 'text-blue-700',
              hover: 'hover:bg-blue-200',
            },
            EDITOR: {
              bg: 'bg-indigo-100',
              text: 'text-indigo-700',
              hover: 'hover:bg-indigo-200',
            },
            VIEWER: {
              bg: 'bg-teal-100',
              text: 'text-teal-700',
              hover: 'hover:bg-teal-200',
            },
            MANAGER: {
              bg: 'bg-pink-100',
              text: 'text-pink-700',
              hover: 'hover:bg-pink-200',
            },
          };

          return (
            roleColors[roleName] || {
              bg: 'bg-gray-100',
              text: 'text-gray-700',
              hover: 'hover:bg-gray-200',
            }
          );
        };
        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {visibleRoles.map((role) => {
              if (
                !role ||
                typeof role !== 'object' ||
                !role.roleId ||
                !role.name
              ) {
                console.log('Invalid role:', role);
                return null;
              }

              const { bg, text, hover } = getRoleColor(role.name);
              return (
                <Badge
                  key={role.id}
                  variant="outline"
                  className={cn(
                    'hover:scale-105 transition-all cursor-default border-transparent whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]',
                    bg,
                    text,
                    hover
                  )}
                  title={role.name}
                >
                  <span className="truncate block w-full">{role.name}</span>
                </Badge>
              );
            })}
            {remainingCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="cursor-help bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105 transition-all"
                    >
                      +{remainingCount}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="p-2 bg-slate-800 text-white max-w-[200px]"
                  >
                    <div className="flex flex-col gap-1">
                      {roles.slice(maxVisibleRoles).map((role) =>
                        role && role.id && role.name ? (
                          <span key={role.id} className="truncate">
                            {role.name}
                          </span>
                        ) : null
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Ngày tạo"
        />
      ),
      cell: ({ row }) => {
        let formattedDate = 'N/A';

        try {
          const dateString = row.getValue('createdAt');
          if (!dateString) throw new Error('Ngày tạo không hợp lệ');

          let date;

          if (dateString.includes(' ')) {
            const [datePart, timePart] = dateString.split(' ');
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const adjustedHour =
              period === 'PM' && hour !== 12
                ? hour + 12
                : period === 'AM' && hour === 12
                ? 0
                : hour;
            const formattedTime = `${adjustedHour
              .toString()
              .padStart(2, '0')}:${minutes}`;
            const isoString = `${datePart}T${formattedTime}`;
            date = new Date(isoString);
          } else if (dateString.includes('T')) {
            date = new Date(dateString);
          } else {
            date = new Date(parseInt(dateString));
          }

          if (isNaN(date.getTime())) throw new Error('Ngày không hợp lệ');

          formattedDate = date
            .toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour12: false,
              timeZone: 'Asia/Ho_Chi_Minh',
            })
            .replace('lúc ', '');
        } catch (error) {
          console.error('Lỗi khi định dạng ngày:', error);
        }

        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-900 transition-colors font-normal px-2 max-w-[160px]"
            title={formattedDate}
          >
            <span className="truncate block">{formattedDate}</span>
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
};

