import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check, AlertCircle, MapPin } from 'lucide-react';
import Button from '@/components/common/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RewardItem } from '@/components/campaign/rewards/reward-detail/RewardItem';
import { Card } from '@/components/campaign/rewards/ui/Card';
import { usePledgeEvents } from '@/websocket/hooks';
import { createPledge, webSocketClient } from '@/websocket';
import { useAuth } from '@/contexts/AuthContext';
import LocationModal from '@/pages/pledges/components/LocationModal';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';

export default function PledgeSummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const { user } = useAuth();
    const [showProducts, setShowProducts] = useState(false);
    const [bonusAmount, setBonusAmount] = useState(0);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pledgeSuccess, setPledgeSuccess] = useState(null);
    const [pledgeError, setPledgeError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [userLocation, setUserLocation] = useState({ city: '', nationality: '' });
    const timeoutRef = useRef(null);
    const successIconRef = useRef(null);
    const errorIconRef = useRef(null);

    // Get pledge data from navigation state
    const pledgeData = location.state?.pledgeData;

    // Subscribe to pledge events - MUST be called before any early returns
    const handlePledgeSuccess = useCallback((data) => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsSubmitting(false);
        setPledgeSuccess(data);
    }, []);

    const handlePledgeError = useCallback((error) => {
        console.error('❌ Pledge failed:', error.errors?.[0]?.message);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsSubmitting(false);
        setPledgeError(error.errors?.[0]?.message);
        setShowErrorModal(true);
    }, []);

    usePledgeEvents(handlePledgeSuccess, handlePledgeError);

    useEffect(() => {
        if (!pledgeData) {
            navigate(`/campaigns/${campaignId}`);
        } else {
            console.log('📋 Pledge Data:', pledgeData);
            console.log('🎁 Reward:', pledgeData.reward);
            console.log('➕ Add-ons:', pledgeData.addOns);
        }
    }, [pledgeData, campaignId, navigate]);

    // Check user location and show modal if needed
    useEffect(() => {
        if (user) {
            const hasCity = user.city && user.city.trim() !== '';
            const hasNationality = user.nationality && user.nationality.trim() !== '';

            setUserLocation({
                city: user.city || '',
                nationality: user.nationality || ''
            });

            // Show modal if user doesn't have both city and nationality
            // Only for reward pledges (not for No Reward pledges)
            const isNoRewardPledge = pledgeData?.hasNoReward || !pledgeData?.reward;
            if (!isNoRewardPledge && (!hasCity || !hasNationality)) {
                setShowLocationModal(true);
            }
        }
    }, [user, pledgeData]);

    // Cleanup timeout khi unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Animate success icon when it appears
    useEffect(() => {
        if (pledgeSuccess && successIconRef.current) {
            const icon = successIconRef.current;
            const container = icon.parentElement;

            // Set initial state
            gsap.set(container, { scale: 0, rotation: -180 });
            gsap.set(icon, { scale: 0 });

            // Animate container
            gsap.to(container, {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: "back.out(1.7)",
            });

            // Animate icon with delay
            gsap.to(icon, {
                scale: 1,
                duration: 0.4,
                delay: 0.3,
                ease: "back.out(2)",
            });

            // Pulse effect
            gsap.to(container, {
                scale: 1.1,
                duration: 0.3,
                delay: 0.9,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
            });
        }
    }, [pledgeSuccess]);

    // Animate error icon when modal opens
    useEffect(() => {
        if (showErrorModal && errorIconRef.current) {
            const icon = errorIconRef.current;
            const container = icon.parentElement;

            // Set initial state
            gsap.set(container, { scale: 0 });
            gsap.set(icon, { rotation: -90, scale: 0 });

            // Animate container
            gsap.to(container, {
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
            });

            // Animate icon
            gsap.to(icon, {
                rotation: 0,
                scale: 1,
                duration: 0.5,
                delay: 0.2,
                ease: "back.out(2)",
            });

            // Shake effect
            gsap.to(icon, {
                x: -5,
                duration: 0.1,
                delay: 0.7,
                yoyo: true,
                repeat: 5,
                ease: "power2.inOut",
            });
        }
    }, [showErrorModal]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Early returns AFTER all hooks
    if (!pledgeData) {
        return null;
    }

    // Success card
    if (pledgeSuccess) {
        const successData = pledgeSuccess.data || pledgeSuccess;
        const message = pledgeSuccess.message || 'Đóng góp thành công! Cảm ơn bạn đã ủng hộ chiến dịch này';

        return (
            <div className="min-h-screen bg-background-light-2 dark:bg-darker flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    <div className="bg-white dark:bg-darker-2 rounded-lg p-12 text-center shadow-[0_8px_20px_rgba(0,0,0,0.35)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-[#00D9A6] flex items-center justify-center">
                                <Check ref={successIconRef} className="w-12 h-12 text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-[#00D9A6] mb-4">Ủng hộ thành công!</h1>
                        <p className="text-muted-foreground text-md mb-8">{message}</p>
                        {successData && (
                            <div className="bg-background-light-2 dark:bg-darker rounded-lg p-6 mb-8 text-left">
                                <h3 className="font-semibold text-foreground mb-4">Chi tiết đóng góp</h3>
                                <div className="space-y-2 text-sm">
                                    {successData.rewardTitle && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phần thưởng:</span>
                                            <span className="font-medium text-foreground">{successData.rewardTitle}</span>
                                        </div>
                                    )}
                                    {successData.amount !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Số tiền:</span>
                                            <span className="font-medium text-foreground">{formatPrice(successData.amount)} VND</span>
                                        </div>
                                    )}
                                    {successData.bonusAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Thưởng thêm:</span>
                                            <span className="font-medium text-foreground">{formatPrice(successData.bonusAmount)} VND</span>
                                        </div>
                                    )}
                                    {successData.totalAmount !== undefined && (
                                        <div className="flex justify-between pt-2 border-t border-border">
                                            <span className="text-foreground font-semibold">Tổng cộng:</span>
                                            <span className="font-bold text-primary">{formatPrice(successData.totalAmount)} VND</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            <Button
                                onClick={() => navigate(`/campaigns/${campaignId}`)}
                                variant="primary"
                                size="md"
                                className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 rounded-lg text-base"
                            >
                                VỀ TRANG CHIẾN DỊCH
                            </Button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { reward, addOns = [], quantity = 1, hasNoReward = false } = pledgeData;

    // If hasNoReward, use the amount directly from pledgeData
    const isNoRewardPledge = hasNoReward || !reward;

    // Calculate amounts
    const rewardAmount = reward?.minPledgedAmount || 0;
    const addOnsAmount = addOns.reduce(
        (sum, addon) => sum + (addon.price || 0) * (addon.quantity || 1),
        0
    );
    // If no reward, use amount from pledgeData directly
    const amount = isNoRewardPledge ? (pledgeData.amount || 0) : (rewardAmount + addOnsAmount);
    // For no reward pledge, use totalAmount from pledgeData (bonusAmount is always 0)
    // For reward pledge, add bonusAmount to amount
    const totalAmount = isNoRewardPledge
        ? (pledgeData.totalAmount || amount)
        : (amount + (bonusAmount || 0));

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

        // Check location for reward pledges
        const isNoRewardPledge = pledgeData?.hasNoReward || !pledgeData?.reward;
        if (!isNoRewardPledge && (!userLocation.city || !userLocation.nationality)) {
            toast.error('Vui lòng cung cấp thông tin vị trí trước khi ủng hộ');
            setShowLocationModal(true);
            return;
        }

        // Kiểm tra WebSocket connection
        if (!webSocketClient.isConnected()) {
            toast.error('WebSocket chưa kết nối. Vui lòng thử lại sau.');
            console.error('❌ WebSocket not connected');
            return;
        }

        // Show confirmation modal
        setShowConfirmModal(true);
    };

    const handleLocationSuccess = (locationData) => {
        setUserLocation(locationData);
        toast.success('Đã cập nhật thông tin vị trí');
    };

    const handleConfirmPledge = async () => {
        setShowConfirmModal(false);
        setIsSubmitting(true);

        console.log('PAYYYY pledge with data:', reward);

        try {
            const pledgePayload = {
                campaignId: campaignId,
                rewardId: isNoRewardPledge ? null : reward.rewardId,
                amount: amount, // Required field
                bonusAmount: isNoRewardPledge ? 0 : (bonusAmount || 0),
                totalAmount: totalAmount,
                addOns: isNoRewardPledge ? [] : (reward.items?.addOn?.map(addon => ({
                    rewardItemId: addon.rewardItemId,
                    quantity: addon.quantity || 1
                })) || [])
            };

            console.log('📤 Sending pledge:', pledgePayload);
            console.log('📊 Breakdown:', {
                'Campaign ID': campaignId,
                'Reward ID': pledgePayload.rewardId,
                'Amount': amount,
                'Bonus Amount': pledgePayload.bonusAmount,
                'Total Amount': totalAmount,
                // 'Add-ons Count': pledgePayload.addOns.length,
                'Has No Reward': isNoRewardPledge
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

    return (
        <div className="min-h-screen bg-background-light-2 dark:bg-darker pb-8 pt-24">
            <div className="container mx-auto max-w-4xl px-4">
                <h1 className="text-3xl font-bold text-foreground mb-8">Xác nhận ủng hộ</h1>

                <div className="space-y-6">
                    {/* Section 1: Reward and Add-ons Display */}
                    {!isNoRewardPledge && (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-foreground mb-4">Sản phẩm ủng hộ</h2>

                            {/* Reward */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    {reward?.imageUrl && (
                                        <div className="w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                                            <img
                                                src={reward.imageUrl}
                                                alt={reward.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-foreground">{reward?.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                            {reward?.description}
                                        </p>
                                        <p className="text-lg font-bold text-primary mt-2">
                                            {formatPrice(reward?.minPledgedAmount || 0)} VND
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
                    )}

                    {/* No Reward Message */}
                    {isNoRewardPledge && (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-foreground mb-4">Ủng hộ không có phần thưởng</h2>
                            <p className="text-muted-foreground">
                                Bạn đang ủng hộ chiến dịch này mà không chọn phần thưởng. Cảm ơn sự đóng góp của bạn!
                            </p>
                        </Card>
                    )}

                    {/* Section 2: Included Products Toggle */}
                    {!isNoRewardPledge && includedItems.length > 0 && (
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

                            {/* Bonus Amount Input - Only show when there's a reward */}
                            {!isNoRewardPledge && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        Số tiền thưởng thêm (tùy chọn)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={bonusAmount || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setBonusAmount(value === '' ? 0 : Math.max(0, parseInt(value) || 0));
                                            }}
                                            placeholder="0"
                                            className="flex-1"
                                        />
                                        <span className="text-muted-foreground">VND</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Thêm số tiền để hỗ trợ thêm cho chiến dịch
                                    </p>
                                </div>
                            )}

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

                    {/* Section 3.5: Location Information - Only show for reward pledges */}
                    {!isNoRewardPledge && (
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-bold text-foreground">Thông tin vị trí</h2>
                                </div>
                                <button
                                    onClick={() => setShowLocationModal(true)}
                                    className="text-sm text-primary hover:text-primary-600 font-medium transition-colors"
                                >
                                    Chỉnh sửa
                                </button>
                            </div>

                            {userLocation.city && userLocation.nationality ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-darker rounded-sm">
                                        <span className="text-sm text-muted-foreground">Quốc tịch</span>
                                        <span className="text-sm font-semibold text-foreground">{userLocation.nationality}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-darker rounded-sm">
                                        <span className="text-sm text-muted-foreground">Thành phố</span>
                                        <span className="text-sm font-semibold text-foreground">{userLocation.city}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-sm">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Vui lòng cung cấp thông tin vị trí để hoàn tất cam kết ủng hộ.
                                    </p>
                                    <button
                                        onClick={() => setShowLocationModal(true)}
                                        className="mt-2 text-sm text-primary hover:text-primary-600 font-semibold transition-colors"
                                    >
                                        Thêm thông tin vị trí →
                                    </button>
                                </div>
                            )}
                        </Card>
                    )}

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

            {/* Confirmation Modal */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="sm:max-w-md">
                    <div className="py-4">
                        <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                            Xác nhận thanh toán
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="bg-background-light-2 dark:bg-darker-2 rounded-lg p-4 space-y-3">
                                {!isNoRewardPledge && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Phần thưởng</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatPrice(rewardAmount)} VND
                                        </span>
                                    </div>
                                )}

                                {!isNoRewardPledge && addOns.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Add-ons ({addOns.length})
                                        </span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatPrice(addOnsAmount)} VND
                                        </span>
                                    </div>
                                )}

                                {isNoRewardPledge && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Số tiền ủng hộ</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatPrice(amount)} VND
                                        </span>
                                    </div>
                                )}

                                {!isNoRewardPledge && bonusAmount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Thêm ủng hộ</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatPrice(bonusAmount)} VND
                                        </span>
                                    </div>
                                )}

                                <div className="pt-3 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-foreground">Tổng cộng</span>
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(totalAmount)} VND
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground text-center">
                                Bạn có chắc chắn muốn tiếp tục thanh toán?
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowConfirmModal(false)}
                                variant="outline"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleConfirmPledge}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                <DialogContent className="sm:max-w-md">
                    <div className="text-center py-6">
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertCircle ref={errorIconRef} className="w-10 h-10 text-destructive" strokeWidth={2} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            Ủng hộ thất bại
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {pledgeError || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'}
                        </p>
                        <Button
                            onClick={() => setShowErrorModal(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSuccess={handleLocationSuccess}
            />
        </div>
    );
}

export { PledgeSummaryPage };
