import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ADMIN_CHARTS_MOCK_CAMPAIGNS } from '@/data/mockAdminCampaigns';
import { getChartPalette, hexToRgba } from '@/utils/themeUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

/**
 * Founder Growth Line Chart for Admin Dashboard
 * Shows cumulative growth of unique founders over last 6 months
 */
export const FounderGrowthChart = ({ campaigns = [] }) => {
    const palette = getChartPalette();
    const sourceCampaigns = campaigns?.length ? campaigns : ADMIN_CHARTS_MOCK_CAMPAIGNS;
    // Get last 6 months data
    const getMonthlyFounderData = () => {
        const months = [];
        const founderCounts = [];
        const now = new Date();

        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = monthDate.toLocaleDateString('vi-VN', { month: 'short' });
            months.push(monthLabel);

            // Get unique founders up to this month
            const uniqueFounders = new Set();
            sourceCampaigns.forEach((campaign) => {
                const createdDate = new Date(campaign.createdAt);
                if (createdDate <= monthDate && campaign.owner?.userId) {
                    uniqueFounders.add(campaign.owner.userId);
                }
            });

            founderCounts.push(uniqueFounders.size);
        }

        return { months, founderCounts };
    };

    const { months, founderCounts } = useMemo(() => getMonthlyFounderData(), [campaigns]);

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Tổng Founders',
                data: founderCounts,
                fill: true,
                borderColor: palette.primary,
                backgroundColor: palette.primaryTint,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: palette.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: palette.primary,
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `Founders: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: palette.muted,
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: hexToRgba(palette.border, 0.2),
                },
                ticks: {
                    color: palette.muted,
                    font: {
                        size: 11,
                    },
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
            <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                Tăng trưởng Founders
            </h3>
            <div className="h-64 sm:h-72">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default FounderGrowthChart;
