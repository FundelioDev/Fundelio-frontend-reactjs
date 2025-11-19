import React from 'react';
import { Calendar, User, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';

/**
 * Recent Pledges Table
 * Shows last 20 pledges with details
 */
export const RecentPledgesTable = ({ pledges = [] }) => {
    const recentPledges = pledges.slice(0, 20);

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'FAILED':
            case 'CANCELLED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
                return 'Thành công';
            case 'PENDING':
                return 'Đang xử lý';
            case 'FAILED':
                return 'Thất bại';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status || 'Không rõ';
        }
    };

    if (recentPledges.length === 0) {
        return (
            <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-6 shadow-card">
                <h3 className="text-base font-semibold text-text-primary dark:text-white mb-4">
                    Pledges gần đây
                </h3>
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">Chưa có pledges nào</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-3 shadow-card">
            <h3 className="text-base font-semibold text-text-primary dark:text-white mb-3">
                Pledges gần đây ({recentPledges.length})
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-darker border-b border-border">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Người ủng hộ
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                                Ngày
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {recentPledges.map((pledge, idx) => {
                            const backerName = pledge.user?.firstName
                                ? `${pledge.user.firstName} ${pledge.user.lastName || ''}`.trim()
                                : pledge.backerName || 'Ẩn danh';
                            const amount = pledge.pledgeAmount || pledge.amount || 0;
                            const date = pledge.createdAt ? new Date(pledge.createdAt) : null;

                            return (
                                <tr key={pledge.pledgeId || idx} className="hover:bg-gray-50 dark:hover:bg-darker/50 transition-colors">
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {backerName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-text-primary dark:text-white truncate">
                                                {backerName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            {amount.toLocaleString('vi-VN')} VND
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-muted-foreground hidden sm:table-cell">
                                        {date ? date.toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPledgesTable;
