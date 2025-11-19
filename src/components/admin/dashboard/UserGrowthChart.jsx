import React from 'react';
import { Card } from '@/components/ui/card';
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

export const UserGrowthChart = ({ users = [] }) => {
    // Group users by month (last 6 months)
    const last6Months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last6Months.push({
            label: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
            month: date.getMonth(),
            year: date.getFullYear(),
            count: 0
        });
    }

    // Count users created in each month
    users.forEach(user => {
        if (!user.createdAt) return;
        const createdDate = new Date(user.createdAt);
        const monthData = last6Months.find(m =>
            m.month === createdDate.getMonth() &&
            m.year === createdDate.getFullYear()
        );
        if (monthData) {
            monthData.count++;
        }
    });

    const data = {
        labels: last6Months.map(m => m.label),
        datasets: [
            {
                label: 'Người dùng mới',
                data: last6Months.map(m => m.count),
                fill: true,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
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
                Tăng trưởng người dùng
            </h3>
            <div style={{ height: '320px' }}>
                {users.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-400'>
                        Chưa có dữ liệu người dùng
                    </div>
                )}
            </div>
        </Card>
    );
};
