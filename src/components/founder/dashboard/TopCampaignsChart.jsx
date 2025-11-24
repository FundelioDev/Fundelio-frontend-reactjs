import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Top Performing Campaigns - Horizontal Bar Chart
 */
export const TopCampaignsChart = ({ campaigns = [], topCampaigns: topCampaignsFromApi }) => {
    // Use topCampaigns from API if provided, otherwise calculate from campaigns
    const topCampaigns = topCampaignsFromApi || [...campaigns]
        .sort((a, b) => (b.pledgedAmount || 0) - (a.pledgedAmount || 0))
        .slice(0, 5);

    const labels = topCampaigns.map(
        (c) => c.title?.substring(0, 30) + (c.title?.length > 30 ? '...' : '') || 'N/A'
    );
    const data = topCampaigns.map((c) => c.pledgedAmount || 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Số tiền gây quỹ',
                data,
                backgroundColor: 'rgba(8, 148, 226, 0.8)',
                borderColor: '#0894E2',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 'flex',
                maxBarThickness: 40,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
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
                borderColor: '#0894E2',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(context.parsed.x);
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 10,
                    },
                    callback: function (value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(0) + 'M';
                        }
                        if (value >= 1000) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                        return value;
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    if (topCampaigns.length === 0) {
        return (
            <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
                <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                    Top chiến dịch
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
                Top 5 chiến dịch hàng đầu
            </h3>
            <div className="h-64 sm:h-80">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default TopCampaignsChart;
