import React, { useState } from 'react';
import { ChevronRight, Trash2, XCircle, BarChart3, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import SimpleConfirmModal from '@/components/common/SimpleConfirmModal';
import { campaignApi } from '@/api/campaignApi';
import toast from 'react-hot-toast';
import {
    getStatusLabel,
    getStatusBadgeColor,
    canPerformAction,
    getEditButtonType,
} from '@/utils/campaignStatusConfig';

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
    const hasImage = imageUrl && imageUrl.trim() !== '';

    const status = campaign.campaignStatus;
    const editButtonType = getEditButtonType(status);
    const isViewMode = editButtonType === 'view';

    return (
        <div
            className="group relative bg-white dark:bg-darker-2 rounded-xs p-3 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/20"
        >
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                {/* Image Container */}
                <div className="w-full sm:w-64 h-48 rounded-md flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <div className="text-gray-400 dark:text-gray-500 text-sm">Không có ảnh</div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Status Badge */}
                    <div className="top-4 left-4">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 mt-2 sm:mt-0 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusBadgeColor(status)}`}
                        >
                            {getStatusLabel(status)}
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

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* End Campaign Button */}
                        {canPerformAction(status, 'canEnd') && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                disabled={isProcessing}
                                className="flex items-center gap-1 px-3 py-2 border rounded-xs border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Kết thúc chiến dịch</span>
                            </button>
                        )}

                        {/* Delete Button */}
                        {canPerformAction(status, 'canDelete') && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={isProcessing}
                                className="gap-1 px-4 py-3 bg-red-50 dark:bg-darker-2 rounded-xs border border-red-500 text-red-600 hover:cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        )}

                        {/* Statistics Button */}
                        {canPerformAction(status, 'canViewStats') && (
                            <button
                                onClick={handleViewStats}
                                className="flex items-center gap-1 px-3 py-2 border rounded-xs bg-[#3eca88] border-green-500 hover:bg-emerald-500 hover:border-emerald-600 text-white"
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span>Thống kê</span>
                            </button>
                        )}

                        {/* Edit/View Button */}
                        {canPerformAction(status, 'canEdit') || isViewMode ? (
                            isViewMode ? (
                                <Button
                                    onClick={handleEdit}
                                    variant="primary"
                                    className="rounded-xs"
                                >
                                    <Eye className="w-5 h-5" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleEdit}
                                    variant="primary"
                                    className="rounded-xs"
                                >
                                    <span>Chỉnh sửa chiến dịch</span>
                                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            )
                        ) : null}
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
