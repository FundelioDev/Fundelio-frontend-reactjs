import React from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Button from './Button';

/**
 * SimpleConfirmModal - Simple one-step confirmation modal
 * Just shows description and Confirm/Cancel buttons - no typing required
 */
export default function SimpleConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmButtonText = 'Xác nhận',
    cancelButtonText = 'Hủy',
    type = 'info', // 'danger', 'warning', 'info', 'success'
}) {
    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    // Icon and color based on type
    const config = {
        danger: {
            icon: AlertTriangle,
            bgColor: 'bg-red-50 dark:bg-red-900/10',
            iconBgColor: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-500',
            buttonColor: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-orange-50 dark:bg-orange-900/10',
            iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
            iconColor: 'text-orange-600 dark:text-orange-400',
            buttonColor: 'bg-orange-600 hover:bg-orange-700 text-white',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50 dark:bg-blue-900/10',
            iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/10',
            iconBgColor: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            buttonColor: 'bg-green-600 hover:bg-green-700 text-white',
        },
    };

    const { icon: Icon, bgColor, iconBgColor, iconColor, buttonColor } = config[type] || config.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-darker-2 rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${bgColor}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${iconBgColor}`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {description}
                    </p>
                    <div className="flex gap-3 justify-end">
                        {cancelButtonText && (
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className="px-4 py-2"
                            >
                                {cancelButtonText}
                            </Button>
                        )}
                        <Button
                            onClick={handleConfirm}
                            className={`px-4 py-2 ${buttonColor}`}
                        >
                            {confirmButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
