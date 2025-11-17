import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/common/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { RewardItem } from '@/components/campaign/rewards/reward-detail/RewardItem';
import { Card } from '@/components/campaign/rewards/ui/Card';
import { usePledgeEvents } from '@/websocket/hooks';
import { createPledge, webSocketClient } from '@/websocket';
import toast from 'react-hot-toast';

export default function PledgeSummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const [showProducts, setShowProducts] = useState(false);
    const [bonusAmount, setBonusAmount] = useState(0);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timeoutRef = useRef(null);

    // Get pledge data from navigation state
    const pledgeData = location.state?.pledgeData;

    // Subscribe to pledge events
    const handlePledgeSuccess = useCallback((data) => {
        console.log('✅ Pledge successful:', data);

        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsSubmitting(false);
        toast.success('Ủng hộ thành công!');

        // Navigate to success page or campaign page
        setTimeout(() => {
            navigate(`/campaigns/${campaignId}`, {
                state: { pledgeSuccess: true, pledgeData: data }
            });
        }, 1000);
    }, [navigate, campaignId]);

    const handlePledgeError = useCallback((error) => {
        console.error('❌ Pledge failed:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));

        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsSubmitting(false);

        // Show detailed error
        const errorMsg = error?.message || error?.error || error?.code || 'Ủng hộ thất bại. Vui lòng thử lại.';
        toast.error(errorMsg);
    }, []);

    usePledgeEvents(handlePledgeSuccess, handlePledgeError);

    useEffect(() => {
        if (!pledgeData) {
            // Redirect back if no pledge data
            navigate(`/campaigns/${campaignId}`);
        } else {
            // Log pledge data để kiểm tra cấu trúc
            console.log('📋 Pledge Data:', pledgeData);
            console.log('🎁 Reward:', pledgeData.reward);
            console.log('➕ Add-ons:', pledgeData.addOns);
        }
    }, [pledgeData, campaignId, navigate]);

    if (!pledgeData) {
        return null;
    }

    const { reward, addOns = [], quantity = 1 } = pledgeData;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Calculate amounts
    const rewardAmount = reward?.minPledgedAmount || 0;
    const addOnsAmount = addOns.reduce(
        (sum, addon) => sum + (addon.price || 0) * (addon.quantity || 1),
        0
    );
    const amount = rewardAmount + addOnsAmount;
    const totalAmount = amount + (bonusAmount || 0);

    // Get included items
    const includedItems = (reward?.items?.included || []).map((item) => ({
        id: item.catalogItemId,
        name: item.name || 'Unknown Item',
        image: item.imageUrl || 'https://c.animaapp.com/mh96kubogMaabT/img/ai_1.png',
        quantity: item.quantity || 1,
        description: item.description || '',
    }));

    const handlePledge = async () => {
        if (!agreeToTerms) {
            toast.error('Vui lòng đồng ý với điều khoản');
            return;
        }

        // Kiểm tra WebSocket connection
        if (!webSocketClient.isConnected()) {
            toast.error('WebSocket chưa kết nối. Vui lòng thử lại sau.');
            console.error('❌ WebSocket not connected');
            return;
        }

        setIsSubmitting(true);

        try {
            const pledgePayload = {
                campaignId: campaignId,
                rewardId: reward.rewardId,
                amount: amount,
                bonusAmount: bonusAmount || 0,
                totalAmount: totalAmount,
                addOns: addOns.map(addon => ({
                    rewardItemId: addon.id,
                    quantity: addon.quantity || 1
                }))
            };

            console.log('📤 Sending pledge:', pledgePayload);
            console.log('📊 Breakdown:', {
                'Campaign ID': campaignId,
                'Reward ID': reward.rewardId,
                'Reward Amount': amount,
                'Bonus Amount': bonusAmount,
                'Total Amount': totalAmount,
                'Add-ons Count': addOns.length
            });

            // Gửi pledge qua WebSocket
            await createPledge(pledgePayload);

            toast.success('Đang xử lý ủng hộ...');

            // Response sẽ được nhận qua usePledgeEvents hook
        } catch (error) {
            console.error('❌ Error creating pledge:', error);
            setIsSubmitting(false);
            toast.error(error.message || 'Không thể gửi yêu cầu ủng hộ');
        }
    };

    // Cleanup timeout khi unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-background-light-2 dark:bg-darker py-8">
            <div className="container mx-auto max-w-4xl px-4">
                <h1 className="text-3xl font-bold text-foreground mb-8">Xác nhận ủng hộ</h1>

                <div className="space-y-6">
                    {/* Section 1: Reward and Add-ons Display */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-foreground mb-4">Sản phẩm ủng hộ</h2>

                        {/* Reward */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                {reward.imageUrl && (
                                    <div className="w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                                        <img
                                            src={reward.imageUrl}
                                            alt={reward.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-foreground">{reward.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                        {reward.description}
                                    </p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        {formatPrice(reward.minPledgedAmount || 0)} VND
                                    </p>
                                </div>
                            </div>

                            {/* Add-ons */}
                            {addOns.length > 0 && (
                                <>
                                    <hr className="border-border/50" />
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-foreground">Tiện ích bổ sung</h3>
                                        {addOns.map((addon) => (
                                            <div key={addon.id}>
                                                <hr className="border-border/50 mb-4" />
                                                <div className="flex items-start gap-4">
                                                    {addon.image && (
                                                        <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={addon.image}
                                                                alt={addon.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-foreground">{addon.title}</h4>
                                                        {addon.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {addon.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <p className="text-sm text-muted-foreground">Số lượng: {addon.quantity}</p>
                                                            <p className="font-semibold text-primary">
                                                                {formatPrice((addon.price || 0) * addon.quantity)} VND
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Section 2: Included Products Toggle */}
                    {includedItems.length > 0 && (
                        <Card className="p-6">
                            <button
                                onClick={() => setShowProducts(!showProducts)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h2 className="text-lg font-bold text-foreground">
                                    Sản phẩm bao gồm ({includedItems.length})
                                </h2>
                                {showProducts ? (
                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>

                            {showProducts && (
                                <div className="mt-4 space-y-3">
                                    {includedItems.map((item) => (
                                        <RewardItem
                                            key={item.id}
                                            item={item}
                                            variant="default"
                                            showQuantity={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Section 3: Order Summary */}
                    <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                        <h2 className="text-xl font-bold text-foreground mb-6">Tổng kết đơn hàng</h2>

                        <div className="space-y-4">
                            {/* Base Amount */}
                            <div className="flex items-center justify-between">
                                <span className="text-foreground">Số tiền ủng hộ</span>
                                <span className="font-semibold text-foreground">{formatPrice(amount)} VND</span>
                            </div>

                            {/* Bonus Amount Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Số tiền thưởng thêm (tùy chọn)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="10000"
                                        value={bonusAmount}
                                        onChange={(e) => setBonusAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                    />
                                    <span className="text-muted-foreground">VND</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Thêm số tiền để hỗ trợ thêm cho chiến dịch
                                </p>
                            </div>

                            <hr className="border-border" />

                            {/* Total Amount */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-foreground">Tổng số tiền</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(totalAmount)} VND
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Section 4: Terms */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-foreground mb-4">Điều khoản</h2>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Ủng hộ có nghĩa là hỗ trợ một dự án sáng tạo, bất kể kết quả ra sao.
                            </p>

                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms-checkbox"
                                    checked={agreeToTerms}
                                    onCheckedChange={setAgreeToTerms}
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="terms-checkbox"
                                    className="text-sm text-foreground leading-relaxed cursor-pointer"
                                >
                                    Tôi hiểu rằng Fundelio hoặc người sáng tạo không đảm bảo sẽ trao phần thưởng hoặc hoàn tiền.
                                </label>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Bằng cách gửi lời cam kết của mình, bạn đồng ý với{' '}
                                <a href="/terms" className="text-primary hover:underline">
                                    Điều khoản sử dụng
                                </a>{' '}
                                và{' '}
                                <a href="/privacy" className="text-primary hover:underline">
                                    Chính sách quyền riêng tư
                                </a>{' '}
                                của Fundelio và cho phép bộ xử lý thanh toán của chúng tôi.
                            </p>
                        </div>
                    </Card>

                    {/* Pledge Button */}
                    <Button
                        onClick={handlePledge}
                        disabled={!agreeToTerms || isSubmitting}
                        className="w-full h-14 text-lg font-bold"
                    >
                        {isSubmitting ? 'Đang xử lý...' : `Ủng hộ ${formatPrice(totalAmount)} VND`}
                    </Button>
            
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full text-center text-muted-foreground hover:text-foreground text-sm"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}

export { PledgeSummaryPage };
