import React from 'react';
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
 * Fundraising Progress Line Chart for Founder Dashboard
 * Shows pledgedAmount over time (weekly)
 */
export const FundraisingProgressChart = ({ campaigns = [] }) => {
    // Get last 7 weeks of data
    const getWeeklyData = () => {
        const weeks = [];
        const data = [];
        const now = new Date();

        // Generate last 7 weeks
        for (let i = 6; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (i * 7));

            const weekLabel = `T${7 - i}`;
            weeks.push(weekLabel);

            // Calculate total pledgedAmount for this week
            const weekTotal = campaigns.reduce((sum, campaign) => {
                const campaignDate = new Date(campaign.createdAt);
                if (campaignDate <= weekStart) {
                    return sum + (campaign.pledgedAmount || 0);
                }
                return sum;
            }, 0);

            data.push(weekTotal);
        }

        return { weeks, data };
    };

    const { weeks, data: weeklyData } = getWeeklyData();

    const chartData = {
        labels: weeks,
        datasets: [
            {
                label: 'Tiền gây quỹ',
                data: weeklyData,
                fill: true,
                borderColor: '#0894E2',
                backgroundColor: 'rgba(8, 148, 226, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#0894E2',
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
                borderColor: '#0894E2',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(context.parsed.y);
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
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    },
                    callback: function (value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                        if (value >= 1000) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                        return value;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card">
            <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-white mb-4">
                Tiến độ gây quỹ
            </h3>
            <div className="h-64 sm:h-72">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default FundraisingProgressChart;
