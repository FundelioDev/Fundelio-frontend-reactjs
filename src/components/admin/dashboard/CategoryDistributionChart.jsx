import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Category Distribution Doughnut Chart for Admin Dashboard
 */
export const CategoryDistributionChart = ({ campaigns = [] }) => {
    // Count campaigns by category
    const categoryCounts = campaigns.reduce((acc, campaign) => {
        const category = campaign.campaignCategory || 'OTHER';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const categoryConfig = {
        TECHNOLOGY: { label: 'Công nghệ', color: '#3B82F6' },
        ART: { label: 'Nghệ thuật', color: '#F59E0B' },
        MUSIC: { label: 'Âm nhạc', color: '#8B5CF6' },
        GAMES: { label: 'Trò chơi', color: '#EC4899' },
        FOOD: { label: 'Thực phẩm', color: '#10B981' },
        FASHION: { label: 'Thời trang', color: '#EF4444' },
        FILM: { label: 'Phim ảnh', color: '#6366F1' },
        PUBLISHING: { label: 'Xuất bản', color: '#F97316' },
        OTHER: { label: 'Khác', color: '#6B7280' },
    };

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a) // Sort by count descending
        .forEach(([category, count]) => {
            if (count > 0) {
                const config = categoryConfig[category] || { label: category, color: '#6B7280' };
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
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
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

    if (campaigns.length === 0) {
        return (
            <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
                <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                    Phân bố danh mục
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
                Phân bố theo danh mục
            </h3>
            <div className="h-64 sm:h-80">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default CategoryDistributionChart;
