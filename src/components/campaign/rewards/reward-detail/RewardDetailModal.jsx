import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/Button';
import { Plus, Minus, X, Users, Truck, Info } from 'lucide-react';
import { RewardItem } from './RewardItem';

export function RewardDetailModal({ isOpen, onClose, reward, items = [], addOns = [], onSelectReward }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    // Get included items from reward.items array
    const includedItems = (reward.items || []).map((selectedItem) => {
        const item = items.find((i) => i.id === selectedItem.itemId);
        return {
            id: selectedItem.itemId,
            name: item?.title || 'Unknown Item',
            image: item?.image || 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
            quantity: selectedItem.qty,
            description: item?.description || '',
        };
    });

    // Filter add-ons that are allowed for this reward
    const filteredAddOns = addOns.filter((addon) => {
        if (addon.offeredWithRewardIds && Array.isArray(addon.offeredWithRewardIds)) {
            return addon.offeredWithRewardIds.includes(reward.id || reward.reward_id);
        }
        return true;
    });

    const updateQuantity = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const toggleAddOn = (addonId) => {
        setSelectedAddOns((prev) => {
            const exists = prev.find((a) => a.id === addonId);
            if (exists) {
                return prev.filter((a) => a.id !== addonId);
            } else {
                const addon = filteredAddOns.find((a) => a.id === addonId);
                return [...prev, { ...addon, quantity: 1 }];
            }
        });
    };

    const updateAddOnQuantity = (addonId, delta) => {
        setSelectedAddOns((prev) =>
            prev.map((addon) =>
                addon.id === addonId
                    ? { ...addon, quantity: Math.max(1, addon.quantity + delta) }
                    : addon
            )
        );
    };

    const removeAddOn = (addonId) => {
        setSelectedAddOns((prev) => prev.filter((a) => a.id !== addonId));
    };

    const calculateTotal = () => {
        const rewardTotal = (reward.minPledgeAmount || reward.min_pledge_amount || 0) * quantity;
        const addOnsTotal = selectedAddOns.reduce(
            (sum, addon) => sum + (addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0) * addon.quantity,
            0
        );
        return rewardTotal + addOnsTotal;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleSubmit = () => {
        if (onSelectReward) {
            onSelectReward({
                reward,
                quantity,
                addOns: selectedAddOns,
                total: calculateTotal(),
            });
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 scrollbar-primary">
                {/* Top Section - Flexbox: Image Left, Info Right */}
                <div className="flex flex-col md:flex-row">
                    {/* Left - Image */}
                    <div className="relative md:w-2/5 flex-shrink-0">
                        <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[300px] overflow-hidden bg-gray-100 dark:bg-darker">
                            <img
                                src={reward.imageUrl || reward.image}
                                alt={reward.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right - Reward Info */}
                    <div className="flex-1 p-6 md:p-8">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-foreground" />
                        </button>

                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-bold pr-10">{reward.title}</DialogTitle>
                        </DialogHeader>

                        {/* Price and delivery info */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(reward.minPledgeAmount)} <span className="text-base">VND</span>
                                </span>
                                {reward.originalPrice && reward.originalPrice > reward.minPledgeAmount && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        {formatPrice(reward.originalPrice)} VND
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Giá thấp nhất trong 30 ngày qua: {formatPrice(reward.minPledgeAmount)} VND
                            </p>

                            {/* Perk name */}
                            {reward.perkName && (
                                <p className="text-base font-semibold text-foreground mb-4">
                                    {reward.perkName}
                                </p>
                            )}

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{reward.backers || 0} lượt ủng hộ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    <span>
                                        {reward.estimated_delivery
                                            ? new Date(reward.estimated_delivery).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                                            : 'Chưa xác định'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {reward.description && (
                            <p className="text-muted-foreground leading-relaxed">
                                {reward.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Section - Grid of Included Items */}
                <div className="p-6 md:p-8 border-t border-border/50">
                    <h3 className="text-xl font-bold text-foreground mb-6">Sản phẩm bao gồm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {includedItems.map((item) => (
                            <RewardItem
                                key={item.id}
                                item={item}
                                variant="default"
                                showQuantity={true}
                            />
                        ))}
                    </div>

                    {/* Add-ons section */}
                    {filteredAddOns.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-foreground mb-4">
                                {selectedAddOns.length > 0 ? 'Tiện ích bổ sung của bạn' : 'Chưa chọn tiện ích bổ sung'}
                            </h3>

                            {selectedAddOns.length > 0 ? (
                                <div className="space-y-3 mb-4">
                                    {selectedAddOns.map((addon) => (
                                        <RewardItem
                                            key={addon.id}
                                            item={{
                                                id: addon.id,
                                                name: addon.title,
                                                image: addon.image,
                                                quantity: addon.quantity,
                                            }}
                                            variant="addon"
                                            showQuantity={false}
                                            rightContent={
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => removeAddOn(addon.id)}
                                                        className="text-destructive hover:text-destructive/80"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-7 w-7"
                                                            onClick={() => updateAddOnQuantity(addon.id, -1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="font-semibold min-w-[2rem] text-center">
                                                            {addon.quantity}
                                                        </span>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-7 w-7"
                                                            onClick={() => updateAddOnQuantity(addon.id, 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground mb-4 text-center py-4">Chưa chọn tiện ích bổ sung</p>
                            )}

                            <Button
                                variant="outline"
                                className="w-full font-semibold"
                                onClick={() => {
                                    // Toggle add-ons picker
                                    const firstAddon = filteredAddOns[0];
                                    if (firstAddon && selectedAddOns.length === 0) {
                                        toggleAddOn(firstAddon.id);
                                    }
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                CHỌN TIỆN ÍCH BỔ SUNG
                            </Button>
                        </div>
                    )}

                    {/* Quantity selector and total */}
                    <div className="border-t border-border/50 pt-6 mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-muted-foreground">SỐ LƯỢNG ỦNG HỘ</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        onClick={() => updateQuantity(-1)}
                                        disabled={quantity === 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="font-bold text-lg min-w-[2rem] text-center text-muted-foreground">{quantity}</span>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        onClick={() => updateQuantity(1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">
                                    {formatPrice(calculateTotal())} <span className="text-base">VND</span>
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full font-bold text-white bg-primary hover:bg-primary/90 h-14 text-base"
                            onClick={handleSubmit}
                        >
                            XÁC NHẬN ỦNG HỘ
                        </Button>

                        <button
                            className="w-full text-primary font-semibold mt-4 hover:underline"
                            onClick={onClose}
                        >
                            quản lý khoản ủng hộ
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
