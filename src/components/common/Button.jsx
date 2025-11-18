import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  // Định nghĩa các variant của button
  const variants = {
    // Button với nền màu chính
    primary:
      'bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-md',

    // Button với nền màu phụ
    secondary:
      'bg-secondary hover:bg-secondary-600 text-text-primary shadow-sm hover:shadow-md',

    // Button outline với viền màu chính
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',

    // Button outline với viền màu phụ
    'outline-secondary':
      'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-text-primary',

    // Button ghost (chỉ text, không có nền)
    ghost:
      'bg-transparent text-primary hover:bg-primary-50 hover:text-primary-700',

    // Button với nền trắng
    white:
      'bg-white text-text-primary border border-border hover:bg-background-lighter shadow-sm hover:shadow-md',

    // Button nguy hiểm (đỏ)
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',

    // Button outline nguy hiểm
    'outline-danger':
      'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white',

    // Button với nền xanh nhạt
    light:
      'bg-background-light hover:bg-background-lighter text-primary border border-primary-200',

    // Button với gradient cyan-blue
    gradient:
      'bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/50 border-0 outline-none',
    
    gray:
      'bg-gray-100 text-text-primary shadow-sm hover:shadow-md',
  };

  // Định nghĩa các size
  const sizes = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-base font-medium',
    lg: 'px-6 py-3 text-lg font-medium',
    xl: 'px-8 py-4 text-xl font-semibold',
  };

  // Class cơ bản cho button
  const baseClasses =
    'inline-flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none font-inter';

  // Kết hợp tất cả classes
  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
      'hover:scale-105 active:scale-95': !disabled && !loading,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
