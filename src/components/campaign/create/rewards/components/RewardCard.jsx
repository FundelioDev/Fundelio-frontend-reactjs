import { Edit2, Trash2, Copy } from 'lucide-react';
import Button from '@/components/common/Button';

/**
 * RewardCard component - Reusable card for rewards, addons, and items
 * Layout: Grid with 4 columns - Pledge Amount | Details | Includes | Image
 * @param {Object} props
 * @param {Object} props.data - The item/reward/addon data
 * @param {Array} props.items - List of items (for displaying included items)
 * @param {Array} props.rewards - List of rewards (for addons)
 * @param {'reward' | 'addon' | 'item'} props.type - Type of card
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onDuplicate - Duplicate callback (optional, for rewards only)
 */
export default function RewardCard({
  data,
  items = [],
  rewards = [],
  type = 'reward',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const getIncludedItems = () => {
    if (!data.items) return [];
    return data.items
      .map((item) => ({
        ...item,
        title: items.find((i) => i.id === item.itemId)?.title,
      }))
      .filter((item) => item.title);
  };

  const getApplicableRewards = () => {
    if (!data.offeredWithRewardIds) return [];
    return data.offeredWithRewardIds
      .map((rewardId) => rewards.find((r) => r.id === rewardId)?.title)
      .filter(Boolean);
  };

  const includedItems = getIncludedItems();
  const applicableRewards = getApplicableRewards();

  // Format delivery date
  const deliveryText = data.delivery 
    ? `Tháng ${data.delivery.month} ${data.delivery.year}`
    : '';

  // Determine grid columns based on type (item = 3 cols, reward/addon = 4 cols)
  const gridCols = type === 'item' ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <div className="rounded-sm border border-border bg-white dark:bg-darker-2 overflow-hidden hover:shadow-md transition-shadow">
      {/* Content Grid - 3-4 columns on desktop, stack on mobile */}
      <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-6 p-4 md:p-6`}>
        {/* Column 1: Pledge Amount / Component Name */}
        <div className="flex flex-col justify-start">
          {type === 'item' ? (
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {data.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {data.rewardRefs?.length || 0} phần thưởng
              </p>
            </div>
          ) : (
            <div className="text-2xl font-bold text-foreground">
             {data.price || 0} VND
            </div>
          )}
        </div>

        {/* Column 2: Details */}
        <div className="flex flex-col justify-start space-y-1">
          {type !== 'item' && (
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {data.title}
            </h3>
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
          {type === 'item' && applicableRewards.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Áp dụng cho:</p>
              <ul className="space-y-1">
                {applicableRewards.map((rewardTitle, idx) => (
                  <li key={idx} className="text-sm text-foreground">
                    • {rewardTitle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Column 3: Includes - Hidden for item (component) */}
        {type !== 'item' && (
          <div className="flex flex-col justify-start">
            {includedItems.length > 0 && (
              <ul className="space-y-1">
                {includedItems.map((item) => (
                  <li key={item.itemId} className="text-sm text-foreground">
                    • {item.title}
                  </li>
                ))}
              </ul>
            )}

            {applicableRewards.length > 0 && (
              <ul className="space-y-1">
                {applicableRewards.map((rewardTitle, idx) => (
                  <li key={idx} className="text-sm text-foreground">
                    • {rewardTitle}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Column 4 (or 3 for addon): Image */}
        <div className="flex flex-col items-stretch justify-start">
          {data.image ? (
            <img
              src={data.image}
              alt={data.title}
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
          {type === 'reward' && (
            <button
              onClick={() => {}}
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Feature
            </button>
          )}
          
          <button
            onClick={() => onEdit(data)}
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            Sửa
          </button>

          {type !== 'item' && onDuplicate && (
            <button
              onClick={() => onDuplicate(data.id)}
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Nhân bản
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn xóa?')) {
                onDelete(data.id);
              }
            }}
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
