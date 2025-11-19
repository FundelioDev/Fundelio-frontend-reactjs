import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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
 * Funding Progress Timeline - Area Chart
 * Shows cumulative fundraising over time
 */
export const FundingProgressTimeline = ({ pledges = [], campaign }) => {
    const chartData = useMemo(() => {
        if (!campaign) return { labels: [], datasets: [] };

        const now = new Date();
        const startDate = campaign.startDate ? new Date(campaign.startDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        const endDate = campaign.endDate ? new Date(campaign.endDate) : now;

        // Generate daily labels
        const days = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
        const labels = [];
        const data = [];

        for (let i = 0; i <= Math.min(days, 30); i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

            // Calculate cumulative pledges up to this date
            const cumulativeAmount = pledges
                .filter(p => new Date(p.createdAt) <= date)
                .reduce((sum, p) => sum + (p.pledgeAmount || p.amount || 0), 0);

            data.push(cumulativeAmount);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Tổng gây quỹ tích lũy',
                    data,
                    fill: true,
                    borderColor: 'rgb(8, 148, 226)',
                    backgroundColor: 'rgba(8, 148, 226, 0.1)',
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                },
            ],
        };
    }, [pledges, campaign]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'rgb(107, 114, 128)',
                    font: { size: 11, weight: '600' },
                    usePointStyle: true,
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(8, 148, 226)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        return `Tổng: ${context.parsed.y.toLocaleString('vi-VN')} VND`;
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
                    color: 'rgb(107, 114, 128)',
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    font: { size: 10 },
                    callback: (value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-3 shadow-card h-full">
            <h3 className="text-base font-semibold text-text-primary dark:text-white mb-3">
                📈 Tiến độ gây quỹ theo thời gian
            </h3>
            <div style={{ height: '300px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default FundingProgressTimeline;
