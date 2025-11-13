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
      className={`bg-white dark:bg-darker-2 flex items-start justify-between p-5 rounded-sm ${isAddon ? 'hover:border-primary/30 shadow-sm' : 'shadow-md'
        } `}
      whileHover={{ scale: isAddon ? 1 : 1.01 }}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Image */}
        {item.image && (
          <div className={`${isAddon ? 'w-20 h-20' : 'w-16 h-16'} rounded-sm overflow-hidden flex-shrink-0`}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base">{item.name}</p>

          {/* Description (optional)
          {item.description && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {item.description}
            </p>
          )} */}

          {/* Quantity */}
          {showQuantity && (
            <p className="text-sm text-muted-foreground mt-2">
              Số lượng: {item.quantity}
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
