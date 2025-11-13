import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ChevronRight, Trash2 } from 'lucide-react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { campaignApi } from '@/api/campaignApi';
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
    if (campaign.title) progress += 20;
    if (campaign.description) progress += 10; // Optional but adds to progress
    if (campaign.goalAmount && campaign.goalAmount >= 1) progress += 20;
    if (campaign.category) progress += 20;
    if (campaign.introVideoUrl) progress += 10; // Optional
    if (campaign.startTime) progress += 10;
    if (campaign.endTime) progress += 10;

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
 * Check if rewards section is complete (temporarily false)
 */
const checkRewardsComplete = (campaign) => {
    // TODO: Implement when rewards API is ready
    return false;
};

/**
 * Calculate rewards completion percentage
 */
const calculateRewardsProgress = (campaign) => {
    // TODO: Implement when rewards API is ready
    return 0;
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

                    // Check completion status
                    setCompletionStatus({
                        basics: checkBasicsComplete(campaignData),
                        rewards: checkRewardsComplete(campaignData),
                        story: checkStoryComplete(campaignData),
                    });

                    // Calculate progress
                    setProgressStatus({
                        basics: calculateBasicsProgress(campaignData),
                        rewards: calculateRewardsProgress(campaignData),
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

    const handleSubmitForReview = () => {
        const allComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;

        if (!allComplete) {
            toast.error('Vui lòng hoàn thành tất cả các phần trước khi gửi đánh giá');
            return;
        }

        // TODO: Implement submit for review API
        toast.success('Gửi dự án để đánh giá thành công!');
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

    const allSectionsComplete = completionStatus.basics && completionStatus.rewards && completionStatus.story;

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
                            icon={AlertCircle}
                            disabled={!allSectionsComplete}
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
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
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
        </div>
    );
}
