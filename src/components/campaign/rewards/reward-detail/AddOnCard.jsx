import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function AddOnCard({ addon, isSelected, onToggle }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="overflow-hidden ring-0 rounded-md shadow-sm hover:shadow-md transition-all bg-white dark:bg-darker-2">
                {/* Image - Square aspect ratio */}
                <div className="aspect-square w-full rounded-t-md overflow-hidden bg-gray-100 dark:bg-darker">
                    <img
                        src={addon.image || addon.imageUrl}
                        alt={addon.title}
                        className="w-full h-full rounded-t-md object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <h4 className="font-bold text-foreground text-base line-clamp-2 min-h-[3rem]">
                        {addon.title}
                    </h4>

                    {/* Price */}
                    <p className="text-primary font-bold text-lg">
                        +{formatPrice(addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0)} VND
                    </p>
                </div>
                {/* Add Button */}
                <Button
                    size="sm"
                    variant={isSelected ? "default" : "primary"}
                    className={`w-full rounded-none rounded-b-md ${isSelected
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-primary text-white border-primary hover:bg-primary/90"
                        }`}
                    onClick={onToggle}
                >
                    {isSelected ? (
                        <>
                            <Check className="w-4 h-4 mr-1" />
                            <span className="uppercase">Đã thêm</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-1" />
                            <span className="uppercase">Thêm</span>
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
