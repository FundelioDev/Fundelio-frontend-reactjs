import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Legend,
    Tooltip,
    Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ADMIN_CHARTS_MOCK_CAMPAIGNS } from '@/data/mockAdminCampaigns';
import { getChartPalette, hexToRgba } from '@/utils/themeUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Legend,
    Tooltip,
    Filler
);

const formatMillion = (value = 0) => {
    if (!Number.isFinite(value)) return 0;
    return +(value / 1_000_000).toFixed(1);
};

export const CampaignsPerformanceChart = ({ campaigns = [], campaignsPerformance }) => {
    const palette = getChartPalette();
    const chartData = useMemo(() => {
        // Use campaignsPerformance from API if provided
        if (campaignsPerformance?.labels && campaignsPerformance?.newCampaigns && campaignsPerformance?.totalPledged) {
            return {
                labels: campaignsPerformance.labels,
                campaigns: campaignsPerformance.newCampaigns,
                pledged: campaignsPerformance.totalPledged.map(v => formatMillion(v)),
            };
        }
        
        // Fallback: calculate from campaigns
        const sourceCampaigns = campaigns?.length ? campaigns : ADMIN_CHARTS_MOCK_CAMPAIGNS;
        const months = [];
        const today = new Date();

        for (let i = 5; i >= 0; i -= 1) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                label: date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
                month: date.getMonth(),
                year: date.getFullYear(),
                campaigns: 0,
                pledged: 0,
            });
        }

        sourceCampaigns.forEach((campaign) => {
            if (!campaign.createdAt) return;
            const createdDate = new Date(campaign.createdAt);
            const bucket = months.find(
                (item) => item.month === createdDate.getMonth() && item.year === createdDate.getFullYear()
            );
            if (!bucket) return;

            bucket.campaigns += 1;
            bucket.pledged += campaign.pledgedAmount ?? campaign.currentAmount ?? 0;
        });

        return {
            labels: months.map((m) => m.label),
            campaigns: months.map((m) => m.campaigns),
            pledged: months.map((m) => formatMillion(m.pledged)),
        };
    }, [campaigns, campaignsPerformance]);

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                type: 'bar',
                label: 'Chiến dịch mới',
                data: chartData.campaigns,
                backgroundColor: palette.primaryTint,
                borderColor: palette.primary,
                borderRadius: 8,
                barThickness: 24,
                order: 2,
                yAxisID: 'campaignAxis',
            },
            {
                type: 'line',
                label: 'Vốn huy động (triệu VND)',
                data: chartData.pledged,
                borderColor: palette.secondary,
                backgroundColor: palette.secondaryTint,
                pointBackgroundColor: palette.secondary,
                pointBorderColor: '#fff',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                order: 1,
                yAxisID: 'fundAxis',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    color: palette.muted,
                },
            },
            tooltip: {
                callbacks: {
                    label(context) {
                        if (context.dataset.yAxisID === 'fundAxis') {
                            return `${context.dataset.label}: ${context.parsed.y} triệu VND`;
                        }
                        return `${context.dataset.label}: ${context.parsed.y} chiến dịch`;
                    },
                },
            },
        },
        scales: {
            campaignAxis: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: palette.muted,
                },
                grid: {
                    color: hexToRgba(palette.border, 0.5),
                },
            },
            fundAxis: {
                beginAtZero: true,
                position: 'right',
                ticks: {
                    color: palette.muted,
                    callback: (value) => `${value}M`,
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            x: {
                ticks: {
                    color: palette.muted,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nhiệt độ chiến dịch</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Số lượng chiến dịch & vốn huy động trong 6 tháng gần nhất</p>
                </div>
            </div>
            <div style={{ height: 360 }}>
                {(campaigns?.length || ADMIN_CHARTS_MOCK_CAMPAIGNS.length) > 0 ? (
                    <Chart type="bar" data={data} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        Chưa có dữ liệu chiến dịch
                    </div>
                )}
            </div>
        </Card>
    );
};


