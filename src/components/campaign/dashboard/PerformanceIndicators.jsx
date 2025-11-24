import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

/**
 * Performance Indicators Component
 * Shows key metrics: Avg Pledge, Daily Avg, Projected Amount, Success Probability
 */
export const PerformanceIndicators = ({ campaign, pledges = [], performanceIndicators: indicatorsFromApi }) => {
    if (!campaign) return null;

    // Use performanceIndicators from API if provided, otherwise calculate
    const avgPledge = indicatorsFromApi?.avgPledge || 0;
    const dailyAvg = indicatorsFromApi?.dailyAvg || 0;
    const projected = indicatorsFromApi?.projected || 0;
    const successProbability = indicatorsFromApi?.successProbability || 0;

    const indicators = [
        {
            label: 'Pledge Trung Bình',
            value: `${(avgPledge / 1000).toFixed(0)}K VND`,
            icon: Trophy,
            color: 'blue',
            description: 'Số tiền trung bình mỗi người ủng hộ'
        },
        {
            label: 'Trung Bình Mỗi Ngày',
            value: `${(dailyAvg / 1000).toFixed(0)}K VND`,
            icon: Medal,
            color: 'green',
            description: 'Số tiền gây quỹ trung bình mỗi ngày'
        },
        {
            label: 'Dự Kiến Cuối Cùng',
            value: projected >= 1000000 ? `${(projected / 1000000).toFixed(1)}M VND` : `${(projected / 1000).toFixed(0)}K VND`,
            icon: Award,
            color: 'purple',
            description: 'Số tiền dự kiến khi kết thúc'
        },
        {
            label: 'Tỷ Lệ Thành Công',
            value: `${successProbability}%`,
            icon: Trophy,
            color: successProbability >= 70 ? 'green' : successProbability >= 40 ? 'yellow' : 'red',
            description: 'Xác suất đạt mục tiêu dựa trên xu hướng hiện tại'
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white dark:bg-darker-2 rounded-sm border border-border p-3 shadow-card">
            <h3 className="text-base font-semibold text-text-primary dark:text-white mb-3">
                📊 Chỉ Số Hiệu Suất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {indicators.map((indicator, idx) => {
                    const Icon = indicator.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-sm border ${getColorClasses(indicator.color)} transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-sm ${indicator.color === 'blue' ? 'bg-blue-200 dark:bg-blue-800' :
                                    indicator.color === 'green' ? 'bg-green-200 dark:bg-green-800' :
                                        indicator.color === 'purple' ? 'bg-purple-200 dark:bg-purple-800' :
                                            indicator.color === 'yellow' ? 'bg-yellow-200 dark:bg-yellow-800' :
                                                'bg-red-200 dark:bg-red-800'
                                    }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1">
                                        {indicator.label}
                                    </p>
                                    <p className="text-xl font-bold mb-1">
                                        {indicator.value}
                                    </p>
                                    <p className="text-xs opacity-70">
                                        {indicator.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceIndicators;
