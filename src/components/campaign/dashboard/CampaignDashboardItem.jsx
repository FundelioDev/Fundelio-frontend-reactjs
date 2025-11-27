import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaChartBar, FaBan, FaEllipsisV, FaEye } from 'react-icons/fa';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CampaignDashboardItem({ campaign, onActionComplete }) {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                    {/* Action Dropdown */}
                    <div className="flex items-center justify-end" ref={dropdownRef}>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <FaEllipsisV />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute bottom-full right-0 mb-2 flex flex-col gap-1 bg-white dark:bg-darker-2 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 p-1 z-10 min-w-[40px] items-center animate-in fade-in zoom-in-95 duration-200">
                                    <TooltipProvider delayDuration={0}>
                                        {/* Edit/View Action */}
                                        {(canPerformAction(status, 'canEdit') || isViewMode) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            handleEdit();
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                                                    >
                                                        {isViewMode ? <FaEye size={16} /> : <FaEdit size={16} />}
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>{isViewMode ? 'Xem chi tiết' : 'Chỉnh sửa'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {/* Statistics Action */}
                                        {canPerformAction(status, 'canViewStats') && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            handleViewStats();
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                                                    >
                                                        <FaChartBar size={16} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>Thống kê</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {/* End Campaign Action */}
                                        {canPerformAction(status, 'canEnd') && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            setShowCancelModal(true);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        disabled={isProcessing}
                                                        className="p-2 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 transition-colors disabled:opacity-50"
                                                    >
                                                        <FaBan size={16} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>Kết thúc chiến dịch</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {/* Delete Action */}
                                        {canPerformAction(status, 'canDelete') && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        disabled={isProcessing}
                                                        className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>Xóa dự án</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TooltipProvider>
                                </div>
                            )}
                        </div>
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
