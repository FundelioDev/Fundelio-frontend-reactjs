import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/Button';
import { Plus, Minus, X, Users, Truck, Info, Trash2 } from 'lucide-react';
import { RewardItem } from './RewardItem';

export function RewardDetailModal({ isOpen, onClose, reward, items = [], addOns = [], onSelectReward, campaignId }) {
    const navigate = useNavigate();
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const includedItems = reward.items?.included || [];
    const filteredAddOns = reward.items?.addOn || [];

    const toggleAddOn = (addonCatalogId) => {
        setSelectedAddOns((prev) => {
            const exists = prev.find((a) => String(a.catalogItemId) === String(addonCatalogId));
            if (exists) {
                return prev.filter((a) => String(a.catalogItemId) !== String(addonCatalogId));
            } else {
                const addon = filteredAddOns.find((a) => String(a.catalogItemId) === String(addonCatalogId));
                if (addon) {
                    console.log('Adding add-on with rewardItemId:', addon.rewardItemId || addon.catalogItemId);
                    return [...prev, {
                        ...addon,
                        quantity: 1,
                    }];
                }
                return prev;
            }
        });
    };

    const updateAddOnQuantity = (addonCatalogId, delta) => {
        setSelectedAddOns((prev) =>
            prev.map((addon) =>
                String(addon.catalogItemId) === String(addonCatalogId)
                    ? { ...addon, quantity: Math.max(1, Math.min(10, (addon.quantity || 1) + delta)) } // Max 10
                    : addon
            )
        );
    };

    const removeAddOn = (addonCatalogId) => {
        setSelectedAddOns((prev) => prev.filter((a) => String(a.catalogItemId) !== String(addonCatalogId)));
    };

    const calculateTotal = () => {
        // Single reward - no quantity multiplier
        const rewardTotal = reward.minPledgedAmount || 0;
        const addOnsTotal = selectedAddOns.reduce(
            (sum, addon) => sum + (addon.price || 0) * addon.quantity,
            0
        );
        return rewardTotal + addOnsTotal;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleSubmit = () => {
        const pledgeData = {
            reward,
            quantity: 1, 
            addOns: selectedAddOns,
            total: calculateTotal(),
            campaignId,
        };

        navigate(`/campaigns/${campaignId}/pledge`, {
            state: { pledgeData }
        });

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
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-bold pr-10">{reward.title}</DialogTitle>
                        </DialogHeader>

                        {/* Price and delivery info */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(reward.minPledgedAmount || 0)} <span className="text-base">VND</span>
                                </span>
                                {/* API không có originalPrice, comment lại */}
                                {/* {reward.originalPrice && reward.originalPrice > reward.minPledgedAmount && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        {formatPrice(reward.originalPrice)} VND
                                    </span>
                                )} */}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Giá thấp nhất trong 30 ngày qua: {formatPrice(reward.minPledgedAmount || 0)} VND
                            </p>

                            {/* API không có perkName, comment lại */}
                            {/* {reward.perkName && (
                                <p className="text-base font-semibold text-foreground mb-4">
                                    {reward.perkName}
                                </p>
                            )} */}

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{reward.backersCount || 0} lượt ủng hộ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    <span>
                                        {reward.estimatedDelivery
                                            ? new Date(reward.estimatedDelivery).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
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
                                key={item.catalogItemId || item.id}
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
                                            key={addon.catalogItemId || addon.id}
                                            item={addon}
                                            variant="addon"
                                            showQuantity={false}
                                            rightContent={
                                                <div className="flex flex-1 items-center justify-end gap-3">
                                                    {/* Quantity controls - Improved UI */}
                                                    <div className="flex items-center border border-border dark:border-gray-600 rounded-lg bg-background dark:bg-darker overflow-hidden shadow-sm">
                                                        <button
                                                            onClick={() => updateAddOnQuantity(addon.catalogItemId || addon.id, -1)}
                                                            disabled={(addon.quantity || 1) === 1}
                                                            className="h-9 w-9 flex items-center justify-center hover:bg-muted dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="w-4 h-4 text-foreground" />
                                                        </button>

                                                        <div className="w-10 h-9 flex items-center justify-center text-sm font-semibold border-x border-border dark:border-gray-600 text-foreground dark:text-white bg-muted/30 dark:bg-gray-800/50">
                                                            {addon.quantity || 1}
                                                        </div>

                                                        <button
                                                            onClick={() => updateAddOnQuantity(addon.catalogItemId || addon.id, 1)}
                                                            disabled={(addon.quantity || 1) === 10}
                                                            className="h-9 w-9 flex items-center justify-center hover:bg-muted dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Plus className="w-4 h-4 text-foreground" />
                                                        </button>
                                                    </div>

                                                    {/* Remove button - Better styling */}
                                                    <button
                                                        onClick={() => removeAddOn(addon.catalogItemId || addon.id)}
                                                        className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shadow-sm border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                                        title="Xóa tiện ích này"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground mb-4 text-center py-4">Chưa chọn tiện ích bổ sung</p>
                            )}

                            {/* Improved Add-on Button */}
                            <button
                                onClick={() => {
                                    // Toggle add-ons picker
                                    const firstAddon = filteredAddOns[0];
                                    if (firstAddon && selectedAddOns.length === 0) {
                                        toggleAddOn(firstAddon.catalogItemId || firstAddon.id);
                                    }
                                }}
                                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/50 dark:hover:border-primary/60 transition-all group"
                            >
                                <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                                    <Plus className="w-4 h-4 text-primary dark:text-primary-light" />
                                </div>
                                <span className="font-semibold text-sm text-primary dark:text-primary-light tracking-wide">
                                    CHỌN TIỆN ÍCH BỔ SUNG
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Quantity selector and total */}
                    <div className="border-t border-border/50 pt-6 mt-6">
                        {/* <div className="flex items-center justify-between mb-6">
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
                        </div> */}

                        <Button
                            className="w-full font-bold text-white bg-primary hover:bg-primary/90 h-14 text-base flex items-center justify-center gap-3"
                            onClick={handleSubmit}
                        >
                            <span>XÁC NHẬN ỦNG HỘ</span>
                            <span className="text-lg">•</span>
                            <span className="font-bold">{formatPrice(calculateTotal())} VND</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
