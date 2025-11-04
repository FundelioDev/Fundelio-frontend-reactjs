import { motion } from 'framer-motion';
import { RewardDetailCard } from './RewardDetailCard';
import { RewardItem } from './RewardItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusIcon, MinusIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

// interface IncludedItem {
//   id: string;
//   name: string;
//   quantity: number;
//   image?: string;
//   badge?: string;
//   description?: string;
// }

// interface AddOnItem {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   quantity: number;
// }

// interface RewardDetailSectionProps {
//   reward: Reward;
// }

export function RewardDetailSection({ reward }) {
  const [addOns, setAddOns] = useState([
    {
      id: '1',
      name: 'Gói phụ kiện cao cấp',
      price: 15,
      description: 'Nâng cao trải nghiệm của bạn với bộ sưu tập phụ kiện được tuyển chọn.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
    {
      id: '2',
      name: 'Bộ gói cao cấp',
      price: 28,
      description: 'Nhận hai sản phẩm cao cấp với mức giá ưu đãi theo gói.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
    {
      id: '3',
      name: 'Ấn bản giới hạn độc quyền',
      price: 45,
      description: 'Số lượng có hạn – phiên bản sưu tầm với các tính năng độc đáo.',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 0,
    },
  ]);

  const includedItems = [
    {
      id: '1',
      name: 'Quyền truy cập sản phẩm cốt lõi',
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      quantity: 1,
      badge: 'ĐÃ BAO GỒM',
      description: 'Quyền truy cập đầy đủ vào sản phẩm cốt lõi với tất cả tính năng tiêu chuẩn',
    },
    {
      id: '2',
      name: 'Gói nội dung số',
      quantity: 1,
      image: 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
      badge: 'TẶNG KÈM',
      description: 'Nội dung số độc quyền và tài liệu tặng kèm',
    },
  ];

  const updateQuantity = (id, delta) => {
    setAddOns((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAddOnsPrice = addOns.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8">
      {/* Left Column - Reward Card (35%) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RewardDetailCard reward={reward} />
      </motion.div>

      {/* Right Column - Details (65%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-8"
      >
        {/* Description */}
        <Card className="p-6 border border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Tùy chỉnh khoản ủng hộ với tiện ích bổ sung
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {reward.description}
          </p>
        </Card>

        {/* Included Items */}
        <div className="flex items-center justify-between mb-5 mt-12">
          <h3 className="text-lg font-bold text-foreground">
            {includedItems.length} mục đã bao gồm
          </h3>
          <div className="w-8 h-8 rounded-sm gradient-2 flex items-center justify-center">
            <CheckIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-4">
          {includedItems.map((item) => (
            <RewardItem
              key={item.id}
              item={item}
              variant="default"
              rightContent={
                item.badge && (
                  <span
                    className="px-3 py-1 rounded-sm text-xs font-bold text-white bg-primary"

                  >
                    {item.badge}
                  </span>
                )
              }
            />
          ))}
        </div>


        {/* Add-ons */}
        <h3 className="text-lg font-bold text-foreground mb-5 mt-12">
          Tiện ích bổ sung tùy chọn
        </h3>

        <div className="space-y-5">
          {addOns.map((addon, index) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RewardItem
                item={addon}
                variant="addon"
                showQuantity={false}
                rightContent={
                  <div className="flex flex-col gap-3">
                    <div
                      className="px-2 py-1 rounded-sm font-bold text-white bg-primary shadow-md whitespace-nowrap text-center"
                    >
                      {addon.price} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-5 h-5 mb-0.5" />
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-sm"
                        onClick={() => updateQuantity(addon.id, -1)}
                        disabled={addon.quantity === 0}
                      >
                        <MinusIcon className="w-4 h-4 text-text-primary dark:text-white" />
                      </Button>
                      <span className="font-semibold text-foreground min-w-[1.5rem] text-center">
                        {addon.quantity > 0 ? `×${addon.quantity}` : '0'}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-sm"
                        onClick={() => updateQuantity(addon.id, 1)}
                      >
                        <PlusIcon className="w-4 h-4 text-text-primary dark:text-white" />
                      </Button>
                    </div>
                  </div>
                }
              />

              {/* Selected Indicator */}
              {addon.quantity > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-4 py-2 gradient-2 text-white text-sm font-semibold mt-0 rounded-b-sm flex items-center justify-between"
                >
                  <span>Đã thêm: {addon.quantity} ×</span>
                  <span className="flex items-center gap-1">
                    {addon.price} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-4 h-4" />
                    = {addon.quantity * addon.price} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-4 h-4" />
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Total */}
        {totalAddOnsPrice > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 183, 0, 0.1) 0%, rgba(255, 150, 3, 0.1) 100%)',
              border: '2px solid rgba(255, 183, 0, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Tổng tiện ích bổ sung:</span>
              <span className="text-xl font-bold text-accent flex items-center gap-1">
                +{totalAddOnsPrice} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-5 h-5" />
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-accent/20">
              <span className="text-lg font-bold text-foreground">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary flex items-center gap-1">
                {reward.price + totalAddOnsPrice} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-6 h-6" />
              </span>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
