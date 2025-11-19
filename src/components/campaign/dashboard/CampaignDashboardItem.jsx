import React, { useState } from 'react';
import { ChevronRight, Trash2, XCircle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import SimpleConfirmModal from '@/components/common/SimpleConfirmModal';
import { campaignApi } from '@/api/campaignApi';
import toast from 'react-hot-toast';

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

const getCampaignStatusColor = (status) => {
    const colors = {
        DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        APPROVED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        ENDED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        SUCCESSFUL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.DRAFT;
};

export default function CampaignDashboardItem({ campaign, onActionComplete }) {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });

    const handleEdit = () => {
        navigate(`/campaigns/${campaign.campaignId}/dashboard`);
    };

    const handleViewStats = () => {
        navigate(`/campaigns/${campaign.campaignId}/statistics`);


    };

    const handleCancelRequest = async () => {
        const toastId = 'end-campaign';
        try {
            setIsProcessing(true);
            setShowCancelModal(false);
            toast.loading('Đang kết thúc chiến dịch...', { id: toastId });

            const response = await campaignApi.endMyCampaign(campaign.campaignId);

            if (response?.data?.success) {
                toast.success('Kết thúc chiến dịch thành công!', { id: toastId });

                // Show success modal
                setSuccessMessage({
                    title: 'Kết thúc chiến dịch thành công!',
                    description: `Chiến dịch "${campaign.title}" đã được kết thúc. Trang sẽ tự động cập nhật.`
                });
                setShowSuccessModal(true);

                // Refresh data after modal
                setTimeout(() => {
                    setShowSuccessModal(false);
                    if (onActionComplete) {
                        onActionComplete();
                    }
                }, 2000);
            } else {
                toast.error('Không thể kết thúc chiến dịch', { id: toastId });
            }
        } catch (error) {
            console.error('Error ending campaign:', error);
            toast.error(error.response?.data?.message || error.errors?.[0]?.message || 'Lỗi khi kết thúc chiến dịch', { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteCampaign = async () => {
        const toastId = 'delete-campaign';
        try {
            setIsProcessing(true);
            setShowDeleteModal(false);
            toast.loading('Đang xóa dự án...', { id: toastId });

            const response = await campaignApi.deleteCampaign(campaign.campaignId);

            if (response?.data?.success) {
                toast.success('Xóa dự án thành công!', { id: toastId });

                // Show success modal
                setSuccessMessage({
                    title: 'Xóa dự án thành công!',
                    description: `Dự án "${campaign.title}" đã được xóa khỏi hệ thống. Trang sẽ tự động cập nhật.`
                });
                setShowSuccessModal(true);

                // Refresh data after modal
                setTimeout(() => {
                    setShowSuccessModal(false);
                    if (onActionComplete) {
                        onActionComplete();
                    }
                }, 2000);
            } else {
                toast.error('Không thể xóa dự án', { id: toastId });
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa dự án', { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    // Get owner name
    const ownerName = campaign.owner
        ? `${campaign.owner.firstName || ''} ${campaign.owner.lastName || ''}`.trim() || 'Unknown'
        : 'Unknown';

    // Mock image URL (since API doesn't have imageUrl yet)
    const imageUrl = campaign.introImageUrl;

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
                                <span>Kết thúc dự án</span>
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
                title="Kết thúc chiến dịch"
                titleKeyword={`${campaign.title}`}
                description={`Bạn có chắc chắn muốn kết thúc chiến dịch "${campaign.title}"? Chiến dịch sẽ chuyển sang trạng thái "Đã kết thúc" và không thể tiếp tục gây quỹ.`}
                confirmKeyword="end"
                confirmButtonText="Kết thúc"
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

            {/* Success Modal */}
            <SimpleConfirmModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    if (onActionComplete) {
                        onActionComplete();
                    }
                }}
                onConfirm={() => {
                    setShowSuccessModal(false);
                    if (onActionComplete) {
                        onActionComplete();
                    }
                }}
                title={successMessage.title}
                description={successMessage.description}
                confirmButtonText="OK"
                cancelButtonText=""
                type="success"
            />
        </div>
    );
}
