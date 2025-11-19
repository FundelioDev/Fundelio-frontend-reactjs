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
    className = '',
    label = ''
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

    const spinnerClass = `
        inline-block rounded-full animate-spin
        ${sizeClasses[size]}
        ${colorClasses[color]}
    `;

    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`} role="status" aria-label="Loading">
            <div className={spinnerClass.trim()} />
            <span className="sr-only">Đang tải...</span>
            {label && (
                <p className="text-sm text-muted-foreground text-center">
                    {label}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
