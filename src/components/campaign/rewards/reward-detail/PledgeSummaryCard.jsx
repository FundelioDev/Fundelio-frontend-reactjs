import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Plus, Info } from 'lucide-react';

export function PledgeSummaryCard({ selectedRewards = [], selectedAddOns = [], onRemoveItem, onPickAddOns, onSubmit, isPreview = false, isOwnerViewing = false }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const calculateTotal = () => {
        let total = 0;

        // Calculate rewards total
        if (selectedRewards && selectedRewards.length > 0) {
            total += selectedRewards.reduce((sum, selectedReward) => {
                const rewardTotal = (selectedReward.reward.minPledgeAmount || selectedReward.reward.min_pledge_amount || 0) * (selectedReward.quantity || 1);
                const addOnsTotal = (selectedReward.addOns || []).reduce(
                    (addonSum, addon) => addonSum + (addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0) * addon.quantity,
                    0
                );
                return sum + rewardTotal + addOnsTotal;
            }, 0);
        }

        // Calculate standalone add-ons total
        if (selectedAddOns && selectedAddOns.length > 0) {
            total += selectedAddOns.reduce(
                (sum, addon) => sum + (addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0) * addon.quantity,
                0
            );
        }

        return total;
    };

    const hasItems = (selectedRewards && selectedRewards.length > 0) || (selectedAddOns && selectedAddOns.length > 0);

    if (!hasItems) {
        return (
            <Card className="sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto p-4 bg-white dark:bg-darker-2 border border-border/50">
                <h3 className="text-xs font-semibold text-muted-foreground mb-3">SẢN PHẨM CỦA BẠN</h3>
                <p className="text-sm text-muted-foreground text-center py-8">
                    Chưa có sản phẩm nào được chọn
                </p>
            </Card>
        );
    }

    return (
        <Card className="sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto p-4 bg-white dark:bg-darker-2 border border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">SẢN PHẨM CỦA BẠN</h3>

            {/* Selected Rewards */}
            {selectedRewards && selectedRewards.length > 0 && (
                <div className="space-y-2 mb-3">
                    {selectedRewards.map((selectedReward, index) => (
                        <div key={index}>
                            {/* Reward Item */}
                            <div className="p-3 border border-border rounded-sm bg-background dark:bg-darker relative">
                                <button
                                    onClick={() => onRemoveItem('reward', index)}
                                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <p className="font-bold text-foreground pr-6 text-sm">
                                    {selectedReward.quantity}x {selectedReward.reward.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatPrice((selectedReward.reward.minPledgeAmount || selectedReward.reward.min_pledge_amount || 0) * selectedReward.quantity)} VND
                                </p>
                            </div>

                            {/* Add-ons for this reward */}
                            {selectedReward.addOns && selectedReward.addOns.length > 0 && (
                                <div className="ml-4 mt-2 space-y-2">
                                    {selectedReward.addOns.map((addon, addonIndex) => (
                                        <div
                                            key={addonIndex}
                                            className="p-2 border border-border/50 rounded-sm bg-background/50 dark:bg-darker/50 relative"
                                        >
                                            <button
                                                onClick={() => onRemoveItem('addon', index, addonIndex)}
                                                className="absolute top-1 right-1 text-destructive hover:text-destructive/80"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            <p className="font-semibold text-foreground pr-5 text-xs">
                                                {addon.quantity}x {addon.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatPrice((addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0) * addon.quantity)} VND
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Standalone Add-ons */}
            {selectedAddOns && selectedAddOns.length > 0 && (
                <div className="space-y-2 mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">TIỆN ÍCH BỔ SUNG</h4>
                    {selectedAddOns.map((addon, index) => (
                        <div
                            key={index}
                            className="p-3 border border-primary/30 rounded-sm bg-primary/5 dark:bg-primary/10 relative"
                        >
                            <button
                                onClick={() => onRemoveItem('addon', undefined, index)}
                                className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <p className="font-bold text-foreground pr-6 text-sm">
                                {addon.quantity}x {addon.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatPrice((addon.price || addon.minPledgeAmount || addon.min_pledge_amount || 0) * addon.quantity)} VND
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pick Add-ons Button */}
            <Button
                variant="outline"
                className="w-full mb-4 font-semibold text-sm h-9"
                onClick={onPickAddOns}
                disabled={isPreview || isOwnerViewing}
            >
                <Plus className="w-3 h-3 mr-1" />
                {isPreview
                    ? 'Không khả dụng'
                    : isOwnerViewing
                        ? 'Nhà sáng tạo không thể ủng hộ'
                        : 'CHỌN TIỆN ÍCH BỔ SUNG'}
            </Button>

            {/* Total */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">TỔNG ỦNG HỘ</span>
                    <div className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                    {formatPrice(calculateTotal())} <span className="text-xs">VND</span>
                </p>
            </div>

            {/* Submit Button */}
            <Button
                className="w-full font-bold text-white bg-primary hover:bg-primary/90 h-10 text-sm mb-2 disabled:cursor-not-allowed"
                onClick={onSubmit}
                disabled={isPreview || isOwnerViewing}
            >
                {isPreview
                    ? 'XEM TRƯỚC'
                    : isOwnerViewing
                        ? 'Nhà sáng tạo không thể ủng hộ'
                        : 'XÁC NHẬN ỦNG HỘ'}
            </Button>

            {/* Manage pledge link */}
            <button
                className="w-full text-primary font-semibold hover:underline text-xs"
                onClick={() => {
                    // Handle manage pledge
                }}
            >
                quản lý khoản ủng hộ
            </button>
        </Card>
    );
}
