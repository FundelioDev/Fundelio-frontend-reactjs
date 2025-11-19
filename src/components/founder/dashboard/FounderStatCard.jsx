import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Stat Card Component for Founder Dashboard
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {object} icon - Lucide icon component
 * @param {number} trend - Trend percentage (positive/negative)
 * @param {string} trendLabel - Label for trend (e.g., "vs tuần trước")
 */
export const FounderStatCard = ({ title, value, icon: Icon, trend, trendLabel }) => {
    const isPositiveTrend = trend >= 0;

    return (
        <div className="bg-white dark:bg-darker-2 p-3 sm:p-4 rounded-sm shadow-card hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary/20">
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-sm bg-primary/10 dark:bg-primary/20">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-muted-foreground dark:text-text-white">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Value */}
            <div className="mb-2">
                <p className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white">
                    {value}
                </p>
            </div>

            {/* Trend */}
            {trend !== undefined && (
                <div className="flex items-center gap-1">
                    {isPositiveTrend ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    )}
                    <span
                        className={`text-xs sm:text-sm font-medium ${isPositiveTrend ? 'text-green-500' : 'text-red-500'
                            }`}
                    >
                        {isPositiveTrend ? '+' : ''}{trend}%
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground dark:text-text-white">
                        {trendLabel}
                    </span>
                </div>
            )}
        </div>
    );
};

export default FounderStatCard;
