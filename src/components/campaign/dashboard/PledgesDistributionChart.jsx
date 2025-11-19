import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Pledges Distribution Chart - Bar Chart
 * Groups pledges by amount ranges
 */
export const PledgesDistributionChart = ({ pledges = [] }) => {
    const chartData = useMemo(() => {
        if (!pledges || pledges.length === 0) {
            return {
                labels: ['< 100K', '100K-500K', '500K-1M', '1M-5M', '> 5M'],
                datasets: [
                    {
                        label: 'Số lượng pledges',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                        ],
                        borderColor: [
                            'rgb(99, 102, 241)',
                            'rgb(16, 185, 129)',
                            'rgb(245, 158, 11)',
                            'rgb(239, 68, 68)',
                            'rgb(168, 85, 247)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        }

        // Group pledges by amount ranges
        const ranges = {
            'under100k': 0,
            '100kTo500k': 0,
            '500kTo1m': 0,
            '1mTo5m': 0,
            'over5m': 0,
        };

        pledges.forEach((pledge) => {
            const amount = pledge.pledgeAmount || pledge.amount || 0;
            if (amount < 100000) ranges.under100k++;
            else if (amount < 500000) ranges['100kTo500k']++;
            else if (amount < 1000000) ranges['500kTo1m']++;
            else if (amount < 5000000) ranges['1mTo5m']++;
            else ranges.over5m++;
        });

        return {
            labels: ['< 100K', '100K-500K', '500K-1M', '1M-5M', '> 5M'],
            datasets: [
                {
                    label: 'Số lượng pledges',
                    data: [
                        ranges.under100k,
                        ranges['100kTo500k'],
                        ranges['500kTo1m'],
                        ranges['1mTo5m'],
                        ranges.over5m,
                    ],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                    ],
                    borderColor: [
                        'rgb(99, 102, 241)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)',
                        'rgb(168, 85, 247)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [pledges]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                callbacks: {
                    label: (context) => {
                        return `Số lượng: ${context.parsed.y} pledges`;
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
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-3 shadow-card h-full">
            <h3 className="text-base font-semibold text-text-primary dark:text-white mb-3">
                📊 Phân bố Pledges theo mức giá
            </h3>
            <div style={{ height: '300px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default PledgesDistributionChart;
