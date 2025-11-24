import React from 'react';

const RankingItemSkeleton = () => {
    return (
        <div className="flex items-center gap-4 p-3 bg-white dark:bg-darker-2 animate-pulse">
            {/* Rank Badge Skeleton */}
            <div className="flex items-center justify-center w-14 h-14 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Image Skeleton */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex-shrink-0 text-right">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    );
};

export default RankingItemSkeleton;

