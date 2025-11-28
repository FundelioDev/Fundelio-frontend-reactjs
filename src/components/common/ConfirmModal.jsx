import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * ConfirmModal - Two-step confirmation modal
 * Step 1: Show question with Cancel/Proceed buttons
 * Step 2: Show input field to type confirmation keyword
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmKeyword, // 'delete' or 'cancel'
    confirmButtonText = 'Xác nhận',
    cancelButtonText = 'Hủy',
    type = 'danger', // 'danger' or 'warning'
    titleKeyword = '',
}) {
    const [step, setStep] = useState(1); // 1 = question, 2 = input confirmation
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(1);
        setInputValue('');
        setError('');
        onClose();
    };

    const handleProceedToConfirm = () => {
        setStep(2);
        setError('');
    };

    const handleBack = () => {
        setStep(1);
        setInputValue('');
        setError('');
    };

    const handleConfirm = () => {
        if (inputValue.toLowerCase() === confirmKeyword.toLowerCase()) {
            onConfirm();
            handleClose();
        } else {
            setError(`Vui lòng nhập chính xác "${confirmKeyword}" để xác nhận`);
        }
    };

    const buttonColor = type === 'danger'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-orange-600 hover:bg-orange-700 text-white';

    console.log("Title Keyword:", titleKeyword);

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
                <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${type === 'danger' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-orange-50 dark:bg-orange-900/10'}`}>
                    <div className="flex items-center gap-1.5">
                        <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                            <AlertTriangle className={`w-5 h-5 ${type === 'danger' ? 'text-red-600 dark:text-red-500' : 'text-orange-600 dark:text-orange-400'}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title} cho "{titleKeyword}"
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
                    {step === 1 ? (
                        // Step 1: Question
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {description}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    onClick={handleClose}
                                    variant="gray"
                                    className="px-4 py-2"
                                >
                                    {cancelButtonText}
                                </Button>
                                <Button
                                    onClick={handleProceedToConfirm}
                                    className={`px-4 py-2 ${buttonColor}`}
                                    variant="danger"
                                >
                                    {confirmButtonText}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Step 2: Input confirmation
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Để xác nhận, vui lòng nhập <span className="font-bold text-gray-900 dark:text-white">"{confirmKeyword}"</span> vào ô bên dưới:
                            </p>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setError('');
                                }}
                                placeholder={`Nhập "${confirmKeyword}"`}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-darker text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {error}
                                </p>
                            )}
                            <div className="flex gap-3 justify-end mt-6">
                                <Button
                                    onClick={handleConfirm}
                                    className={`px-4 py-2 ${buttonColor}`}
                                    disabled={!inputValue}
                                    variant="danger"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
