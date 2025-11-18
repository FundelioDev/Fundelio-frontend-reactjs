import { Edit2, Trash2, Copy, Image } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';

/**
 * RewardCard component - Reusable card for rewards, addons, and items
 * Layout: Grid with 4 columns - Pledge Amount | Details | Includes | Image
 * @param {Object} props
 * @param {Object} props.data - The item/reward/addon data
 * @param {Array} props.items - List of items (for displaying included items)
 * @param {Array} props.rewards - List of rewards (for addons)
 * @param {Array} props.linkedRewards - List of rewards linked to this item (for items only)
 * @param {'reward' | 'addon' | 'item'} props.type - Type of card
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onDuplicate - Duplicate callback (optional, for rewards only)
 */
export default function RewardCard({
  data,
  items = [],
  rewards = [],
  linkedRewards = [],
  type = 'reward',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Format delivery date
  const deliveryText = data.delivery
    ? `Tháng ${data.delivery.month} ${data.delivery.year}`
    : '';

  // Determine grid columns based on type (item = 3 cols, reward/addon = 4 cols)
  const gridCols = type === 'item' ? 'md:grid-cols-3' : 'md:grid-cols-4';

  // Get display values based on type
  const displayTitle = type === 'item' ? (data.name || data.title) : data.title;
  const displayImage = data.imageUrl || data.image;

  const handleEdit = () => {
    onEdit(data)
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    let itemId
    if (type === 'item') {
      itemId = data.catalogItemId
    } else {
      itemId = data.rewardId || data.id
    }
    onDelete(itemId)
    setIsDeleteModalOpen(false)
  }

  console.log("All props in RewardCard:", { data, items, rewards, linkedRewards, type, onEdit, onDelete, onDuplicate });


  return (
    <div className="rounded-sm border border-border bg-white dark:bg-darker-2 overflow-hidden hover:shadow-md transition-shadow">
      {/* Content Grid - 3-4 columns on desktop, stack on mobile */}
      <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-6 p-4 md:p-6`}>
        {/* Column 1: Pledge Amount / Component Name */}
        <div className="flex flex-col justify-start">
          {type === 'item' ? (
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {displayTitle}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {linkedRewards.length} phần thưởng liên kết
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-foreground mb-2">
                {data.minPledgedAmount || 0} VND
              </div>
              {/* Reward Status Badge */}
              {data.rewardStatus && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${data.rewardStatus === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {data.rewardStatus === 'AVAILABLE' ? 'Đang mở bán' : 'Đã hết hàng'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Column 2: Details */}
        <div className="flex flex-col justify-start space-y-1">
          {type !== 'item' && (
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {displayTitle}
            </h3>
          )}

          {/* Show description for items */}
          {type === 'item' && data.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.description}
            </p>
          )}

          {/* Show price for items */}
          {type === 'item' && (
            <p className="text-sm text-foreground font-semibold mt-2">
              Giá: {data.price || 0} VND
            </p>
          )}

          {deliveryText && (
            <p className="text-sm text-foreground">
              Giao dự kiến: {deliveryText}
            </p>
          )}

          {data.shipping === 'anywhere' && (
            <p className="text-sm text-foreground">
              Ship toàn cầu
            </p>
          )}

          {data.limitTotal && (
            <p className="text-sm text-muted-foreground">
              Giới hạn: {data.limitTotal} suất
            </p>
          )}

          {/* Show applicable rewards for item in column 2 */}
          {type === 'item' && linkedRewards.length > 0 && data?.items?.included?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Được sử dụng trong:</p>
              <ul className="space-y-1">
                {data.items.included.map((item) => (
                  <li key={item.catalogItemId} className="text-sm text-foreground flex items-center gap-2">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-6 h-6 object-cover rounded" />
                    ) : (
                      <Image className="w-6 h-6 text-muted-foreground" />
                    )}
                    <p>{item.name} x {item.quantity || 1}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Column 3: Includes - Hidden for item (component) */}
        {type !== 'item' && (
          <div className="flex flex-col justify-start">
            <div>
              {/* <h4 className="text-md font-semibold text-foreground mb-4">Bao gồm</h4> */}
              {data?.items?.included && data.items.included.length > 0 && (
                <ul className="space-y-1">
                  {data.items.included.map((item) => (
                    <li key={item.catalogItemId} className="text-sm text-foreground flex items-center gap-2">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-6 h-6 object-cover rounded" />
                      ) : (
                        <Image className="w-5 h-5 text-muted-foreground" />
                      )}
                      <p>{item.name} x {item.quantity || 1}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {data?.items?.addOn && data.items.addOn.length > 0 && (
              <>
                <h4 className="text-md font-semibold text-foreground my-4">Phụ</h4>
                <ul className="space-y-1">
                  {data.items?.addOn?.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      {item?.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-6 h-6 object-cover rounded" />
                      ) : (
                        <Image className="w-5 h-5 text-muted-foreground" />
                      )}
                      <p>{item.name}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Column 4 (or 3 for addon): Image */}
        <div className="flex flex-col items-stretch justify-start">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayTitle}
              className="w-full h-32 md:h-40 object-cover rounded-sm"
            />
          ) : (
            <div className="w-full h-32 md:h-40 rounded-sm bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Không có ảnh</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Actions */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          0 backers
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
            title="Sửa"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Sửa</span>
          </button>

          {type !== 'item' && onDuplicate && (
            <button
              onClick={() => onDuplicate(data)}
              className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
              title="Nhân bản"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Nhân bản</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa thành phần"
        titleKeyword={displayTitle}
        description="Bạn có chắc chắn muốn xóa thành phần này? Hành động này không thể hoàn tác."
        confirmKeyword="delete"
        confirmButtonText="Tiếp tục"
        cancelButtonText="Hủy"
        type="danger"
      />
    </div>
  );
}
