import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ChevronRight, Trash2, Send, StopCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { campaignApi } from '@/api/campaignApi';
import { rewardApi } from '@/api/rewardApi';
import toast from 'react-hot-toast';

/**
 * Check if basics section is complete
 */
const checkBasicsComplete = (campaign) => {
    if (!campaign) return false;

    const required = [
        campaign.title,
        campaign.goalAmount && campaign.goalAmount >= 1,
        campaign.category,
        campaign.startTime,
        campaign.endTime,
    ];

    return required.every(Boolean);
};

/**
 * Calculate basics completion percentage
 * Each field: 20% (total 5 fields = 100%)
 */
const calculateBasicsProgress = (campaign) => {
    if (!campaign) return 0;

    let progress = 0;
    if (campaign.title) progress += 30;
    if (campaign.description) progress += 10; // Optional but adds to progress
    if (campaign.goalAmount && campaign.goalAmount >= 1) progress += 20;
    if (campaign.campaignCategory) progress += 20;
    if (campaign.startDate) progress += 10;
    if (campaign.endDate) progress += 10;

    return Math.min(100, progress);
};

/**
 * Check if story section is complete
 */
const checkStoryComplete = (campaign) => {
    if (!campaign?.campaignSections || campaign.campaignSections.length === 0) {
        return false;
    }

    // Check if at least one section has all required fields
    return campaign.campaignSections.some(section => {
        return section.tabTitle && section.formatTitle && section.itemData;
    });
};

/**
 * Calculate story completion percentage
 */
const calculateStoryProgress = (campaign) => {
    if (!campaign?.campaignSections || campaign.campaignSections.length === 0) {
        return 0;
    }

    const validSections = campaign.campaignSections.filter(section => {
        return section.tabTitle && section.formatTitle && section.itemData;
    });

    // At least 1 complete section = 100%
    return validSections.length > 0 ? 100 : 0;
};

/**
 * Check if rewards section is complete
 * Fetch all rewards with items to check properly
 */
const checkRewardsComplete = async (campaignId) => {
    try {
        const response = await rewardApi.getRewardsWithItems(campaignId);
        console.log('Full response from getRewardsWithItems:', response);
        console.log('Response data:', response?.data);
        console.log('Response data.data:', response?.data?.data);

        if (!response?.data?.data?.content || response.data.data.content.length === 0) {
            console.log('No rewards found or empty content');
            return false;
        }

        const rewards = response.data.data.content;
        console.log('Rewards for completeness check:', rewards);

        // Check if at least one reward has all required fields
        return rewards.some(reward => {
            console.log('Checking reward:', reward);
            const hasTitle = !!reward.title;
            const hasDescription = !!reward.description;
            const hasPledgeAmount = reward.minPledgedAmount && reward.minPledgedAmount > 0;
            const hasEstimatedDelivery = !!reward.estimatedDelivery;

            // Check if has at least one included item (addon is optional)
            const hasIncludedItems = reward.items?.included &&
                reward.items.included.length > 0;

            console.log('Reward validation:', {
                title: reward.title,
                hasTitle,
                hasDescription,
                hasPledgeAmount,
                minPledgeAmount: reward.minPledgedAmount,
                hasEstimatedDelivery,
                estimatedDelivery: reward.estimatedDelivery,
                hasIncludedItems,
                items: reward.items
            });

            return hasTitle && hasDescription && hasPledgeAmount && hasEstimatedDelivery && hasIncludedItems;
        });
    } catch (error) {
        console.error('Error checking rewards completeness:', error);
        return false;
    }
};

/**
 * Calculate rewards completion percentage
 * Fetch all rewards with items to check properly
 */
const calculateRewardsProgress = async (campaignId) => {
    try {
        const response = await rewardApi.getRewardsWithItems(campaignId);
        console.log('calculateRewardsProgress - Full response:', response);

        if (!response?.data?.data?.content || response.data.data.content.length === 0) {
            console.log('calculateRewardsProgress - No rewards found');
            return 0;
        }

        const rewards = response.data.data.content;
        console.log('calculateRewardsProgress - Rewards:', rewards);

        const validRewards = rewards.filter(reward => {
            const hasTitle = !!reward.title;
            const hasDescription = !!reward.description;
            const hasPledgeAmount = reward.minPledgedAmount && reward.minPledgedAmount > 0;
            const hasEstimatedDelivery = !!reward.estimatedDelivery;

            // Check if has at least one included item (addon is optional)
            const hasIncludedItems = reward.items?.included &&
                reward.items.included.length > 0;

            console.log('valid reward:', { hasTitle, hasDescription, hasPledgeAmount, hasEstimatedDelivery, hasIncludedItems });

            return hasTitle && hasDescription && hasPledgeAmount && hasEstimatedDelivery && hasIncludedItems;
        });

        // At least 1 complete reward = 100%
        return validRewards.length > 0 ? 100 : 0;
    } catch (error) {
        console.error('Error calculating rewards progress:', error);
        return 0;
    }
};

/**
 * Circular Progress Component
 */
const CircularProgress = ({ percentage, size = 50, strokeWidth = 3 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    const isComplete = percentage === 100;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle (track) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${isComplete
                        ? 'text-primary'
                        : percentage >= 50
                            ? 'text-primary'
                            : 'text-yellow-500'
                        }`}
                />
            </svg>
            {/* Center circle with shadow and check icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${isComplete ? 'w-12 h-12 bg-primary' : 'w-12 h-12 bg-white dark:bg-darker shadow-lg'
                    }`}>
                    <Check
                        className={`transition-colors duration-300 ${isComplete
                            ? 'w-5 h-5 text-white'
                            : 'w-5 h-5 text-gray-400 dark:text-gray-500'
                            }`}
                        strokeWidth={2}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Section Item Component
 */
const SectionItem = ({ title, description, completed, onClick, progress = 0 }) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-start gap-4 px-3 py-6 bg-white dark:bg-darker-2 rounded-sm border border-border hover:border-primary/30 transition-all duration-200 text-left group"
        >
            {/* Icon with Progress */}
            <div className="flex-shrink-0">
                <CircularProgress percentage={progress} size={50} strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-text-primary dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Arrow */}
            <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
    );
};

/**
 * Submission Section Component
 */
const SubmissionSection = ({ title, description, icon: Icon, disabled, onClick }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-start gap-4 p-6 rounded-xs border-2 transition-all duration-200 text-left group ${disabled
                ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                : 'bg-white dark:bg-darker-2 border-primary/30 hover:border-primary hover:shadow-lg'
                }`}
        >
            {/* Icon */}
            <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${disabled
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                    : 'bg-gradient-to-br from-primary to-secondary text-white'
                    }`}
            >
                <Icon className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3
                    className={`text-lg font-bold mb-1 transition-colors ${disabled
                        ? 'text-gray-400 dark:text-gray-600'
                        : 'text-text-primary dark:text-white group-hover:text-primary'
                        }`}
                >
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Arrow */}
            {!disabled && (
                <ChevronRight className="flex-shrink-0 w-5 h-5 text-primary group-hover:translate-x-1 transition-all" />
            )}
        </button>
    );
};

/**
 * Campaign Overview Page
 */
export default function CampaignOverviewPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEndCampaignModal, setShowEndCampaignModal] = useState(false);
    const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);
    const [completionStatus, setCompletionStatus] = useState({
        basics: false,
        rewards: false,
        story: false,
    });
    const [progressStatus, setProgressStatus] = useState({
        basics: 0,
        rewards: 0,
        story: 0,
    });

    // Fetch campaign data
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                const response = await campaignApi.getCampaignById(campaignId);

                if (response?.data?.data) {
                    const campaignData = response.data.data;
                    setCampaign(campaignData);

                    // Check completion status (rewards check is async)
                    const rewardsComplete = await checkRewardsComplete(campaignId);
                    const rewardsProgress = await calculateRewardsProgress(campaignId);

                    setCompletionStatus({
                        basics: checkBasicsComplete(campaignData),
                        rewards: rewardsComplete,
                        story: checkStoryComplete(campaignData),
                    });

                    // Calculate progress
                    setProgressStatus({
                        basics: calculateBasicsProgress(campaignData),
                        rewards: rewardsProgress,
                        story: calculateStoryProgress(campaignData),
                    });
                }
            } catch (error) {
                console.error('Error fetching campaign:', error);
                toast.error('Không thể tải thông tin chiến dịch');
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchCampaign();
        }
    }, [campaignId]);

    const handleNavigateToBasics = () => {
        navigate(`/campaigns/${campaignId}/edit?tab=basic`);
    };

    const handleNavigateToRewards = () => {
        navigate(`/campaigns/${campaignId}/edit?tab=rewards`);
    };

    const handleNavigateToStory = () => {
        navigate(`/campaigns/${campaignId}/edit?tab=story`);
    };

    const handleSubmitForReview = async () => {
        // const allComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;
        const allComplete = true;
        if (!allComplete) {
            toast.error('Vui lòng hoàn thành tất cả các phần trước khi gửi đánh giá');
            return;
        }

        // Show confirmation modal
        setShowSubmitReviewModal(true);
    };

    const handleConfirmSubmitReview = async () => {
        try {
            const response = await campaignApi.submitMyCampaign(campaignId);

            if (response?.data?.success) {
                toast.success('Gửi dự án để đánh giá thành công!');
                setShowSubmitReviewModal(false);
                // Refresh campaign data
                const refreshResponse = await campaignApi.getCampaignById(campaignId);
                if (refreshResponse?.data?.data) {
                    setCampaign(refreshResponse.data.data);
                }
            } else {
                toast.error('Không thể gửi dự án để đánh giá');
            }
        } catch (error) {
            console.error('Error submitting campaign:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi gửi dự án để đánh giá');
        }
    };

    const handleLaunch = () => {
        const allComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;

        if (!allComplete) {
            toast.error('Vui lòng hoàn thành tất cả các phần trước khi kích hoạt');
            return;
        }

        // TODO: Implement launch campaign API
        toast.success('Dự án đã được kích hoạt!');
    };

    const handleDeleteCampaign = async () => {
        try {
            const response = await campaignApi.deleteCampaign(campaignId);

            if (response?.data?.success) {
                toast.success('Xóa dự án thành công!');
                // Navigate to dashboard after successful deletion
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                toast.error('Không thể xóa dự án');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa dự án');
        }
    };

    const handleEndCampaign = async () => {
        try {
            const response = await campaignApi.endMyCampaign(campaignId);

            if (response?.data?.success) {
                toast.success('Kết thúc chiến dịch thành công!');
                setShowEndCampaignModal(false);
                // Refresh campaign data
                const refreshResponse = await campaignApi.getCampaignById(campaignId);
                if (refreshResponse?.data?.data) {
                    setCampaign(refreshResponse.data.data);
                }
            } else {
                toast.error('Không thể kết thúc chiến dịch');
            }
        } catch (error) {
            console.error('Error ending campaign:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi kết thúc chiến dịch');
        }
    };

    const allSectionsComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;

    console.log('allSectionsCompleteCampaign:', campaign);
    console.log("allSectionsComplete", allSectionsComplete);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Đang tải...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
                <Header variant="light" />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">Không tìm thấy chiến dịch</p>
                        <Button onClick={() => navigate('/dashboard')} className="mt-4">
                            Quay lại Dashboard
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
                            Tổng quan dự án
                        </h1>
                        <p className="text-muted-foreground">{campaign.title}</p>
                    </div>

                    {/* Main Sections */}
                    <div className="space-y-4 mb-8">
                        <SectionItem
                            title="Cơ bản"
                            description="Đặt tên cho dự án, tải lên hình ảnh hoặc video và thiết lập thông tin chi tiết về chiến dịch."
                            completed={completionStatus.basics}
                            progress={progressStatus.basics}
                            onClick={handleNavigateToBasics}
                        />

                        <SectionItem
                            title="Phần thưởng"
                            description="Thiết lập phần thưởng và chi phí vận chuyển."
                            completed={completionStatus.rewards}
                            progress={progressStatus.rewards}
                            onClick={handleNavigateToRewards}
                        />

                        <SectionItem
                            title="Câu chuyện"
                            description="Thêm mô tả chi tiết về dự án và truyền đạt những rủi ro và thách thức của bạn."
                            completed={completionStatus.story}
                            progress={progressStatus.story}
                            onClick={handleNavigateToStory}
                        />
                    </div>

                    {/* Connecting Line */}
                    <div className="relative my-8">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-700"></div>
                        <div className="h-12"></div>
                    </div>

                    {/* Review Section */}
                    <div className="mb-4">
                        <SubmissionSection
                            title="Đánh giá dự án"
                            description="Chúng tôi sẽ kiểm tra để đảm bảo rằng nó tuân thủ các quy tắc và hướng dẫn của chúng tôi. Vui lòng chờ 1-3 ngày làm việc để nhận được phản hồi."
                            icon={Send}
                            disabled={campaign.campaignStatus === "PENDING"} //!allSectionsComplete ||
                            onClick={handleSubmitForReview}
                        />
                    </div>

                    {/* Connecting Line */}
                    <div className="relative my-8">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-700"></div>
                        <div className="h-12"></div>
                    </div>

                    {/* Launch Section */}
                    <div>
                        <SubmissionSection
                            title={campaign.campaignStatus === 'ACTIVE' ? 'Kích hoạt dự án' : 'Chuẩn bị ra mắt'}
                            description={
                                campaign.campaignStatus === 'ACTIVE'
                                    ? 'Dự án của bạn đã được kích hoạt và đang chạy.'
                                    : 'Gửi dự án của bạn để xem xét.'
                            }
                            icon={Check}
                            disabled={!allSectionsComplete || campaign.campaignStatus === 'PENDING'}
                            onClick={handleLaunch}
                        />
                    </div>

                    {/* Info Message */}
                    {!allSectionsComplete && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                💡 Hoàn thành tất cả các phần (Cơ bản, Phần thưởng, Câu chuyện) để có thể gửi dự án đánh giá và kích hoạt.
                            </p>
                        </div>
                    )}

                    {/* Delete Campaign Button */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={campaign.campaignStatus !== 'DRAFT'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${campaign.campaignStatus === 'DRAFT'
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800'
                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 border border-gray-200 dark:border-gray-700'
                                }`}
                            title={
                                campaign.campaignStatus !== 'DRAFT'
                                    ? 'Chỉ có thể xóa dự án ở trạng thái Bản nháp'
                                    : 'Xóa dự án'
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa dự án</span>
                        </button>

                        {campaign.campaignStatus !== 'DRAFT' && (
                            <button
                                onClick={() => setShowEndCampaignModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                            >
                                <StopCircle className="w-4 h-4" />
                                <span>Kết thúc chiến dịch</span>
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Campaign Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteCampaign}
                title="Xóa dự án"
                titleKeyword={campaign?.title}
                description={`Bạn có chắc chắn muốn xóa dự án "${campaign?.title}"? Hành động này không thể hoàn tác và toàn bộ dữ liệu sẽ bị xóa vĩnh viễn.`}
                confirmKeyword="delete"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                type="danger"
            />

            {/* End Campaign Modal */}
            <ConfirmModal
                isOpen={showEndCampaignModal}
                onClose={() => setShowEndCampaignModal(false)}
                onConfirm={handleEndCampaign}
                title="Kết thúc chiến dịch"
                titleKeyword={campaign?.title}
                description={`Bạn có chắc chắn muốn kết thúc chiến dịch "${campaign?.title}"? Chiến dịch sẽ chuyển sang trạng thái "Đã kết thúc" và không thể tiếp tục gây quỹ.`}
                confirmKeyword="end"
                confirmButtonText="Kết thúc"
                cancelButtonText="Hủy"
                type="warning"
            />

            {/* Submit for Review Modal */}
            <ConfirmModal
                isOpen={showSubmitReviewModal}
                onClose={() => setShowSubmitReviewModal(false)}
                onConfirm={handleConfirmSubmitReview}
                title="Gửi dự án để đánh giá"
                titleKeyword={campaign?.title}
                description={`Bạn có chắc chắn muốn gửi dự án "${campaign?.title}" để đánh giá? Sau khi gửi, dự án sẽ chuyển sang trạng thái "Đang chờ duyệt" và bạn cần chờ 1-3 ngày làm việc để nhận phản hồi.`}
                confirmKeyword="submit"
                confirmButtonText="Gửi đánh giá"
                cancelButtonText="Hủy"
                type="info"
            />
        </div>
    );
}
