import { motion } from 'framer-motion';

export function RewardItem({
  item,
  rightContent,
  showQuantity = true,
  variant = 'default'
}) {
  const isAddon = variant === 'addon';

  return (
    <motion.div
      className={`bg-white dark:bg-darker-2 flex items-center justify-between px-3 py-2 rounded-sm ${isAddon ? 'hover:border-primary/30 shadow-[0px_1px_11px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)]' : 'shadow-[0px_1px_11px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)]'
        } `}
      whileHover={{ scale: isAddon ? 1 : 1.01 }}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Image */}
        {(item.image || item.imageUrl) && (
          <div className={`${isAddon ? 'w-20 h-20' : 'w-16 h-16'} rounded-sm overflow-hidden flex-shrink-0`}>
            <img
              src={item.image || item.imageUrl}
              alt={item.name || item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base">{item.name || item.title}</p>

          {/* Description (optional)
          {item.description && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {item.description}
            </p>
          )} */}

          {/* Quantity */}
          {showQuantity && (
            <p className="text-sm text-muted-foreground mt-2">
              Số lượng: {item.quantity || item.qty || 1}
            </p>
          )}
        </div>
      </div>

      {/* Right Content (badge, price, controls, etc.) */}
      {rightContent && (
        <div className="flex-shrink-0 ml-4">
          {rightContent}
        </div>
      )}
    </motion.div>
  );
}
