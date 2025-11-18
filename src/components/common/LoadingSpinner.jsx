import React from 'react';

/**
 * LoadingSpinner - Reusable loading spinner component
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {string} color - Color variant: 'primary', 'white', 'gray'
 * @param {string} className - Additional CSS classes
 */
const LoadingSpinner = ({
    size = 'md',
    color = 'primary',
    className = ''
}) => {
    // Size mapping
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4',
    };

    // Color mapping
    const colorClasses = {
        primary: 'border-primary/30 border-t-primary',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300',
    };

    return (
        <div
            className={`
        inline-block rounded-full animate-spin
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Đang tải...</span>
        </div>
    );
};

export default LoadingSpinner;
