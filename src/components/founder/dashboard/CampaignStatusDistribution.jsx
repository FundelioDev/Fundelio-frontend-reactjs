import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Campaign Status Distribution Doughnut Chart for Founder
 */
export const CampaignStatusDistribution = ({ campaigns = [], campaignsByStatus }) => {
    // Use campaignsByStatus from API if provided, otherwise calculate from campaigns array
    const statusCounts = campaignsByStatus || campaigns.reduce((acc, campaign) => {
        const status = campaign.campaignStatus || 'UNKNOWN';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const statusConfig = {
        DRAFT: { label: 'Nháp', color: '#9CA3AF' },
        PENDING: { label: 'Chờ duyệt', color: '#F59E0B' },
        APPROVED: { label: 'Đã duyệt', color: '#8B5CF6' },
        ACTIVE: { label: 'Đang hoạt động', color: '#0894E2' },
        ENDED: { label: 'Đã kết thúc', color: '#6B7280' },
        SUCCESSFUL: { label: 'Thành công', color: '#10B981' },
        FAILED: { label: 'Thất bại', color: '#EF4444' },
        REJECTED: { label: 'Bị từ chối', color: '#DC2626' },
    };

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    Object.entries(statusCounts).forEach(([status, count]) => {
        if (count > 0) {
            const config = statusConfig[status] || { label: status, color: '#6B7280' };
            labels.push(config.label);
            dataValues.push(count);
            backgroundColors.push(config.color);
        }
    });

    const chartData = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 11,
                    },
                    color: '#6B7280',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#0894E2',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    if (Object.keys(statusCounts).length === 0) {
        return (
            <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
                <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                    Phân bố trạng thái
                </h3>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Chưa có dữ liệu
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
            <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                Phân bố trạng thái
            </h3>
            <div className="h-64 sm:h-72">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default CampaignStatusDistribution;
