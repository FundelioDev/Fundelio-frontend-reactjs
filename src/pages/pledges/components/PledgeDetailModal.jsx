import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PledgeDetailModal({ pledge, onClose }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value || 0) + ' VND';
    };

    const InfoRow = ({ label, value, highlight = false }) => (
        <div className="flex justify-between items-start py-3 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <span className={`text-sm text-right max-w-[60%] ${highlight ? 'font-bold text-primary' : 'text-text-primary dark:text-white'
                }`}>
                {value}
            </span>
        </div>
    );

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-primary">
                <DialogHeader>
                    <DialogTitle>Chi tiết cam kết ủng hộ</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Pledge Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                            Thông tin cam kết
                        </h3>
                        <div className="bg-muted/30 dark:bg-darker rounded-sm p-4">
                            <InfoRow label="Mã cam kết" value={pledge.pledgeId} />
                            <InfoRow label="Người ủng hộ" value={pledge.backerName || 'N/A'} />
                            <InfoRow label="Phần thưởng" value={pledge.rewardTitle || 'Không có'} />
                            <InfoRow label="Số tiền cam kết" value={formatCurrency(pledge.amount)} />
                            {pledge.bonusAmount > 0 && (
                                <InfoRow label="Tiền thưởng" value={formatCurrency(pledge.bonusAmount)} />
                            )}
                            <InfoRow label="Tổng cộng" value={formatCurrency(pledge.totalAmount)} highlight />
                            <InfoRow label="Ngày tạo" value={formatDate(pledge.createdAt)} />
                            <InfoRow label="Cập nhật lần cuối" value={formatDate(pledge.updatedAt)} />
                        </div>
                    </section>

                    {/* Campaign Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                            Thông tin chiến dịch
                        </h3>
                        <div className="bg-muted/30 dark:bg-darker rounded-sm p-4">
                            {pledge.campaign.introImageUrl && (
                                <div className="mb-4">
                                    <img
                                        src={pledge.campaign.introImageUrl}
                                        alt={pledge.campaign.title}
                                        className="w-full h-48 object-cover rounded-sm"
                                    />
                                </div>
                            )}

                            <InfoRow label="Mã chiến dịch" value={pledge.campaign.campaignId} />
                            <InfoRow label="Tiêu đề" value={pledge.campaign.title} />
                            {pledge.campaign.description && (
                                <div className="py-3 border-b border-border">
                                    <p className="text-sm text-muted-foreground font-medium mb-2">Mô tả</p>
                                    <p className="text-sm text-text-primary dark:text-white">
                                        {pledge.campaign.description}
                                    </p>
                                </div>
                            )}
                            <InfoRow label="Danh mục" value={pledge.campaign.campaignCategory || 'N/A'} />
                            <InfoRow label="Trạng thái" value={pledge.campaign.campaignStatus || 'N/A'} />
                            <InfoRow label="Mục tiêu" value={formatCurrency(pledge.campaign.goalAmount)} />
                            <InfoRow label="Đã gây quỹ" value={formatCurrency(pledge.campaign.pledgedAmount)} highlight />
                            <InfoRow label="Số người ủng hộ" value={`${pledge.campaign.backersCount || 0} người`} />
                            <InfoRow label="Ngày bắt đầu" value={formatDate(pledge.campaign.startDate)} />
                            <InfoRow label="Ngày kết thúc" value={formatDate(pledge.campaign.endDate)} />

                            {pledge.campaign.introVideoUrl && (
                                <InfoRow label="Video giới thiệu" value={
                                    <a
                                        href={pledge.campaign.introVideoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Xem video
                                    </a>
                                } />
                            )}
                        </div>
                    </section>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-sm transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
