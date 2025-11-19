import React from 'react';
import { Card } from '@/components/ui/card';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const CampaignStatusChart = ({ campaigns = [] }) => {
    // Count campaigns by status
    const statusCounts = campaigns.reduce((acc, campaign) => {
        const status = campaign.campaignStatus || campaign.status || 'UNKNOWN';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const statusLabels = {
        'DRAFT': 'Bản nháp',
        'PENDING': 'Chờ duyệt',
        'APPROVED': 'Đã duyệt',
        'ACTIVE': 'Đang hoạt động',
        'ENDED': 'Đã kết thúc',
        'SUCCESSFUL': 'Thành công',
        'FAILED': 'Thất bại',
        'REJECTED': 'Từ chối'
    };

    const data = {
        labels: Object.keys(statusCounts).map(status => statusLabels[status] || status),
        datasets: [
            {
                label: 'Số lượng chiến dịch',
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(156, 163, 175, 0.8)',  // DRAFT - gray
                    'rgba(251, 191, 36, 0.8)',   // PENDING - yellow
                    'rgba(34, 197, 94, 0.8)',    // APPROVED - green
                    'rgba(59, 130, 246, 0.8)',   // ACTIVE - blue
                    'rgba(139, 92, 246, 0.8)',   // ENDED - purple
                    'rgba(16, 185, 129, 0.8)',   // SUCCESSFUL - emerald
                    'rgba(239, 68, 68, 0.8)',    // FAILED - red
                    'rgba(220, 38, 38, 0.8)',    // REJECTED - dark red
                ],
                borderColor: [
                    'rgb(156, 163, 175)',
                    'rgb(251, 191, 36)',
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)',
                    'rgb(220, 38, 38)',
                ],
                borderWidth: 2,
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
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                }
            },
            x: {
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <Card className='p-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                Phân bố chiến dịch theo trạng thái
            </h3>
            <div style={{ height: '320px' }}>
                {campaigns.length > 0 ? (
                    <Bar data={data} options={options} />
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-400'>
                        Chưa có dữ liệu chiến dịch
                    </div>
                )}
            </div>
        </Card>
    );
};
