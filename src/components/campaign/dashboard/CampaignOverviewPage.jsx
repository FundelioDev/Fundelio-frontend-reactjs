import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ChevronRight, Trash2, Send, StopCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import SimpleConfirmModal from '@/components/common/SimpleConfirmModal';
import { campaignApi } from '@/api/campaignApi';
import { rewardApi } from '@/api/rewardApi';
import { getErrorMessage, getSuccessMessage } from '@/utils/errorHandler';

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
            className={`w-full flex items-start gap-4 px-3 py-6 rounded-sm border-1 transition-all duration-200 text-left group ${disabled
                ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed'
                : 'bg-white dark:bg-darker-2 border-primary/30 hover:border-primary hover:shadow-lg'
                }`}
        >
            {/* Icon */}
            <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${disabled
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                    : 'bg-primary text-white'
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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
    const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });
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
                setErrorMessage({
                    title: 'Tải dữ liệu thất bại',
                    description: getErrorMessage(error, 'Không thể tải thông tin chiến dịch')
                });
                setShowErrorModal(true);
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
        // Show confirmation modal
        setShowSubmitReviewModal(true);
    };

    const handleConfirmSubmitReview = async () => {
        try {
            setShowSubmitReviewModal(false);

            const response = await campaignApi.submitMyCampaign(campaignId);

            if (response?.data?.success || response?.data?.data) {
                const message = getSuccessMessage(response, 'Gửi dự án để đánh giá thành công!');
                setSuccessMessage({
                    title: 'Gửi dự án thành công!',
                    description: message
                });
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate('/dashboard');
                }, 1500);
            } else {
                setErrorMessage({
                    title: 'Gửi dự án thất bại',
                    description: 'Không thể gửi dự án để đánh giá. Vui lòng thử lại.'
                });
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error submitting campaign:', error);
            const errorMsg = getErrorMessage(error, 'Lỗi khi gửi dự án để đánh giá');
            setErrorMessage({
                title: 'Gửi dự án thất bại',
                description: errorMsg
            });
            setShowErrorModal(true);
        }
    };

    const handleLaunch = () => {
        setSuccessMessage({
            title: 'Thông báo',
            description: 'Dự án của bạn đang hoạt động!'
        });
        setShowSuccessModal(true);
    };

    const handleDeleteCampaign = async () => {
        try {
            setShowDeleteModal(false);

            const response = await campaignApi.deleteCampaign(campaignId);

            const message = getSuccessMessage(response, 'Xóa dự án thành công!');
            setSuccessMessage({
                title: 'Xóa dự án thành công!',
                description: message
            });
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error deleting campaign:', error);
            const errorMsg = getErrorMessage(error, 'Lỗi khi xóa dự án');
            setErrorMessage({
                title: 'Xóa dự án thất bại',
                description: errorMsg
            });
            setShowErrorModal(true);
        }
    };

    const handleEndCampaign = async () => {
        try {
            setShowEndCampaignModal(false);

            const response = await campaignApi.endMyCampaign(campaignId);

            if (response?.data?.data || response?.data?.success) {
                const message = getSuccessMessage(response, 'Kết thúc chiến dịch thành công!');
                setSuccessMessage({
                    title: 'Kết thúc chiến dịch thành công!',
                    description: message
                });
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate('/dashboard');
                }, 2000);
            } else {
                setErrorMessage({
                    title: 'Kết thúc chiến dịch thất bại',
                    description: 'Không thể kết thúc chiến dịch. Vui lòng thử lại.'
                });
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error ending campaign:', error);
            const errorMsg = getErrorMessage(error, 'Lỗi khi kết thúc chiến dịch');
            setErrorMessage({
                title: 'Kết thúc chiến dịch thất bại',
                description: errorMsg
            });
            setShowErrorModal(true);
        }
    };

    const allSectionsComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;

    console.log('SSSS:', campaign?.campaignStatus);
    console.log('CHECK STATUS:', campaign?.campaignStatus === 'ACTIVE');
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
                        {/* Back to Founder Dashboard Button */}
                        <button
                            onClick={() => navigate('/founder-dashboard')}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 mb-4 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            <span>Quay lại Dashboard Founder</span>
                        </button>

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
                            disabled={campaign.campaignStatus === "PENDING"}
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
                            title={campaign.campaignStatus === 'ACTIVE' ? 'Dự án đang hoạt động' : 'Chuẩn bị ra mắt'}
                            description={
                                campaign.campaignStatus === 'ACTIVE'
                                    ? 'Dự án của bạn đã được kích hoạt và đang chạy.'
                                    : campaign.campaignStatus === 'SUCCESSFUL'
                                        ? 'Dự án của bạn đã kết thúc thành công!'
                                        : 'Dự án sẽ được kích hoạt sau khi được phê duyệt.'
                            }
                            icon={Check}
                            disabled={campaign.campaignStatus !== 'ACTIVE' && campaign.campaignStatus !== 'SUCCESSFUL'}
                            onClick={handleLaunch}
                        />
                    </div>

                    {/* Delete Campaign Button */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-4">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={campaign.campaignStatus !== 'DRAFT' && campaign.campaignStatus !== 'ENDED'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${(campaign.campaignStatus === 'DRAFT' || campaign.campaignStatus === 'ENDED')
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800'
                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 border border-gray-200 dark:border-gray-700'
                                }`}
                            title={
                                (campaign.campaignStatus !== 'DRAFT' && campaign.campaignStatus !== 'ENDED')
                                    ? 'Chỉ có thể xóa dự án ở trạng thái Bản nháp hoặc Đã kết thúc'
                                    : 'Xóa dự án'
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa dự án</span>
                        </button>

                        {(campaign.campaignStatus !== 'DRAFT' && campaign.campaignStatus !== 'ENDED') && (
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
                description={`Bạn có chắc chắn muốn xóa dự án này"? Hành động này không thể hoàn tác và toàn bộ dữ liệu sẽ bị xóa vĩnh viễn.`}
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
                description={`Bạn có chắc chắn muốn kết thúc chiến dịch này"? Chiến dịch sẽ chuyển sang trạng thái "Đã kết thúc" và không thể tiếp tục gây quỹ.`}
                confirmKeyword="end"
                confirmButtonText="Kết thúc"
                cancelButtonText="Hủy"
                type="warning"
            />

            {/* Submit for Review Modal */}
            <SimpleConfirmModal
                isOpen={showSubmitReviewModal}
                onClose={() => setShowSubmitReviewModal(false)}
                onConfirm={handleConfirmSubmitReview}
                title="Gửi dự án để Admin phê duyệt"
                description={`Bạn có chắc chắn muốn gửi dự án này để admin phê duyệt? Sau khi gửi, dự án sẽ chuyển sang trạng thái "Đang chờ duyệt" và bạn cần chờ 1-3 ngày làm việc để nhận phản hồi.`}
                confirmButtonText="Gửi đánh giá"
                cancelButtonText="Hủy"
                type="info"
            />

            {/* Success Modal */}
            <SimpleConfirmModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/dashboard');
                }}
                onConfirm={() => {
                    setShowSuccessModal(false);
                    navigate('/dashboard');
                }}
                title={successMessage.title}
                description={successMessage.description}
                confirmButtonText="OK"
                cancelButtonText=""
                type="success"
            />

            {/* Error Modal */}
            <SimpleConfirmModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                onConfirm={() => setShowErrorModal(false)}
                title={errorMessage.title}
                description={errorMessage.description}
                confirmButtonText="Đóng"
                cancelButtonText=""
                type="danger"
            />
        </div>
    );
}
