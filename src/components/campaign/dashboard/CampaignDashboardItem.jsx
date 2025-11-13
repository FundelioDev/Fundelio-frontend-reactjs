import React, { useState } from 'react';
import { ChevronRight, Trash2, XCircle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { campaignApi } from '@/api/campaignApi';
import toast from 'react-hot-toast';
/**
 * Get campaign status label in Vietnamese
 */
const getCampaignStatusLabel = (status) => {
    const labels = {
        DRAFT: 'Bản nháp',
        ACTIVE: 'Đang hoạt động',
        PENDING: 'Chờ duyệt',
        PAUSED: 'Tạm dừng',
        ENDED: 'Đã kết thúc',
        SUCCESSFUL: 'Thành công',
        FAILED: 'Thất bại',
    };
    return labels[status] || status;
};

/**
 * Get campaign status color classes
 */
const getCampaignStatusColor = (status) => {
    const colors = {
        DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        PAUSED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        ENDED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        SUCCESSFUL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.DRAFT;
};

/**
 * Get mock image based on category
 */
const getMockImage = (category) => {
    const mockImages = {
        art: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        games: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
        technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
        film: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop',
        food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
        fashion: 'https://images.unsplash.com/photo-1558769132-cb1aea7c8a0b?w=600&h=400&fit=crop',
        publishing: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
        photography: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
    };
    return mockImages[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop';
};

/**
 * CampaignDashboardItem - Campaign card for dashboard (horizontal layout)
 */
export default function CampaignDashboardItem({ campaign }) {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = () => {
        navigate(`/campaigns/${campaign.campaignId}/dashboard`);
    };

    const handleViewStats = () => {
        // TODO: Navigate to campaign statistics page
        navigate(`/campaigns/${campaign.campaignId}/statistics`);
    };

    const handleCancelRequest = async () => {
        try {
            setIsProcessing(true);
            const response = await campaignApi.updateCampaignStatus(campaign.campaignId, {
                campaignStatus: 'CANCELLED'
            });

            if (response?.data?.success) {
                toast.success('Đã hủy yêu cầu đánh giá thành công!');
                // Reload page to update status
                window.location.reload();
            } else {
                toast.error('Không thể hủy yêu cầu');
            }
        } catch (error) {
            console.error('Error cancelling request:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi hủy yêu cầu');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteCampaign = async () => {
        try {
            setIsProcessing(true);
            const response = await campaignApi.deleteCampaign(campaign.campaignId);

            if (response?.data?.success) {
                toast.success('Xóa dự án thành công!');
                // Reload page to remove deleted campaign
                window.location.reload();
            } else {
                toast.error('Không thể xóa dự án');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa dự án');
        } finally {
            setIsProcessing(false);
        }
    };

    // Get owner name
    const ownerName = campaign.owner
        ? `${campaign.owner.firstName || ''} ${campaign.owner.lastName || ''}`.trim() || 'Unknown'
        : 'Unknown';

    // Mock image URL (since API doesn't have imageUrl yet)
    const imageUrl = campaign.introImageUrl || getMockImage(campaign.category);

    return (
        <div
            className="group relative bg-white dark:bg-darker-2 rounded-xs p-3 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/20"
        >
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                {/* Image Container */}
                <div className="w-full sm:w-64 h-48 rounded-md flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = getMockImage(campaign.campaignCategory);
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Status Badge */}
                    <div className="top-4 left-4">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 mt-2 sm:mt-0 rounded-full text-xs font-semibold backdrop-blur-sm ${getCampaignStatusColor(campaign.campaignStatus)}`}
                        >
                            {getCampaignStatusLabel(campaign.campaignStatus)}
                        </span>
                    </div>
                    <div>
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors">
                            {campaign.title}
                        </h3>

                        {/* Owner */}
                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                                {ownerName.charAt(0).toUpperCase()}
                            </span>
                            <span>by {ownerName}</span>
                        </p>
                    </div>

                    {/* Edit Button */}
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Cancel Request Button - Only show when status is PENDING */}
                        {campaign.campaignStatus === 'PENDING' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                disabled={isProcessing}
                                variant="outline"
                                className="flex items-center gap-1 px-3 py-2 border rounded-xs border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Hủy yêu cầu</span>
                            </button>
                        )}

                        {/* Delete Button - Only show when status is DRAFT */}
                        {(campaign.campaignStatus === 'DRAFT' || campaign.campaignStatus === 'CANCELLED') && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={isProcessing}
                                className="gap-1 px-4 py-3 bg-red-50 dark:bg-darker-2 rounded-xs border border-red-500 text-red-600 hover:cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                {/* <span>Xóa</span> */}
                            </button>
                        )}

                        {/* Statistics Button */}
                        <button
                            onClick={handleViewStats}
                            className="flex items-center gap-1 px-3 py-2 border rounded-xs bg-[#3eca88] border-green-500 hover:bg-emerald-500 hover:border-emerald-600 text-white "
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Thống kê</span>
                        </button>

                        {/* Edit Button */}
                        <Button
                            onClick={handleEdit}
                            variant="primary"
                            className="rounded-xs"
                        >
                            <span>Chỉnh sửa chiến dịch</span>
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Cancel Request Modal */}
            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelRequest}
                title="Hủy yêu cầu duyệt"
                titleKeyword={`${campaign.title}`}
                description={`Bạn có chắc chắn muốn hủy yêu cầu duyệt cho dự án "${campaign.title}"? Bạn có thể gửi lại yêu cầu sau khi hủy.`}
                confirmKeyword="cancel"
                confirmButtonText="Hủy yêu cầu"
                cancelButtonText="Quay lại"
                type="warning"
            />

            {/* Delete Campaign Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteCampaign}
                title="Xóa dự án"
                titleKeyword={`${campaign.title}`}
                description={`Bạn có chắc chắn muốn xóa dự án "${campaign.title}"? Hành động này không thể hoàn tác.`}
                confirmKeyword="delete"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                type="danger"
            />
        </div>
    );
}
