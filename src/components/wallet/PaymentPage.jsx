import React, { useState } from 'react';
import TermsModal from './TermsModal';

const PaymentPage = () => {
    // State
    const [amount, setAmount] = useState(1000000);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    // Quick amount options
    const quickAmounts = [500000, 1000000, 2000000, 5000000];

    // Format price to VND
    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Handle input change
    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setAmount(value ? parseInt(value) : 0);
    };

    // Handle quick amount selection
    const handleQuickAmount = (quickAmount) => {
        setAmount(quickAmount);
    };

    return (
        <div className="bg-background-light-2 dark:bg-darker py-16 px-4 pb-20">
            <div className="max-w-6xl mx-auto">
                {/* Section 1 - Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-20">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-white">
                        Nạp tiền vào ví
                    </h1>
                    <button className="text-sm sm:text-base md:text-lg text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap">
                        Lịch sử nạp tiền
                    </button>
                </div>

                {/* Section 2 - Main Content (2 columns) */}
                <div className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 mb-8">
                    {/* Left Column */}
                    <div className="flex flex-col justify-between">
                        {/* Payment Method */}
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-4">
                                Chọn phương thức thanh toán
                            </h2>

                            {/* VNPay Card */}
                            <div className="relative bg-white dark:bg-darker-2 rounded-md border-2 border-indigo-400 shadow-md p-4 cursor-pointer hover:shadow-lg transition-all">
                                <div className="flex items-center gap-4">
                                    {/* VNPay Logo */}
                                    <img src="/VNPAY_Logo.svg" alt="VNPay Logo" className="w-20 sm:w-24 md:w-30 h-auto" />

                                    {/* Text */}
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Thanh toán qua VNPay
                                        </p>
                                    </div>

                                    {/* Check Icon */}
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions - Desktop only */}
                        <div className="hidden lg:flex flex-col gap-3">
                            <div>
                                <label className="flex justify-start items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer p-1"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-primary text-xl">* </span>Tôi đã đọc và đồng ý với{' '}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowTermsModal(true);
                                            }}
                                            className="text-primary hover:text-primary/80 underline font-medium"
                                        >
                                            Điều khoản và điều kiện
                                        </button>
                                    </span>
                                </label>
                            </div>

                            {/* Desktop button */}
                            <button
                                disabled={!amount || amount <= 0 || !acceptedTerms}
                                className={`w-full sm:w-[14rem] px-4 sm:px-5 py-2 sm:py-3 rounded-md font-bold text-base transition-all ${amount > 0 && acceptedTerms
                                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {amount > 0 && acceptedTerms
                                    ? `Nạp ${formatPrice(amount)} VND`
                                    : 'Chọn số tiền để nạp'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Amount Input Card */}
                    <div className="flex items-start lg:items-center justify-center">
                        <div className="w-full bg-white dark:bg-darker-2 backdrop-blur-xl rounded-md p-6 sm:p-8 shadow-lg border-border">
                            {/* Card Title */}
                            <h3 className="text-base sm:text-lg font-semibold text-text-prim dark:text-white mb-4">
                                Số tiền nạp
                            </h3>

                            {/* Amount Input */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                                    Nhập số tiền muốn nạp
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatPrice(amount)}
                                        onChange={handleAmountChange}
                                        className="w-full text-center text-2xl sm:text-3xl font-bold bg-background-lighter dark:bg-darker backdrop-blur-sm rounded-md px-4 sm:px-6 py-4 sm:py-6 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 border-border"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 text-lg sm:text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400">
                                        VND
                                    </span>
                                </div>
                            </div>

                            {/* Quick Amount Options */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        onClick={() => handleQuickAmount(quickAmount)}
                                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${amount === quickAmount
                                            ? 'bg-primary text-white shadow-lg scale-105'
                                            : 'bg-background-light dark:bg-darker text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 hover:scale-105 border-border shadow-xs'
                                            }`}
                                    >
                                        <span className="hidden sm:inline">{formatPrice(quickAmount)} VND</span>
                                        <span className="sm:hidden">{quickAmount / 1000}K</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile: Terms and Submit Button at bottom */}
                <div className="lg:hidden flex flex-col gap-4">
                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-primary text-xl">* </span>Tôi đã đọc và đồng ý với{' '}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTermsModal(true);
                                }}
                                className="text-primary hover:text-primary/80 underline font-medium"
                            >
                                Điều khoản và điều kiện
                            </button>
                        </span>
                    </label>

                    {/* Mobile submit button */}
                    <button
                        disabled={!amount || amount <= 0 || !acceptedTerms}
                        className={`w-full px-6 py-4 rounded-md font-bold text-base transition-all ${amount > 0 && acceptedTerms
                            ? 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl active:scale-95'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {amount > 0 && acceptedTerms
                            ? 'Nạp tiền'
                            : 'Chọn số tiền để nạp'}
                    </button>
                </div>

                {/* Terms Modal */}
                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />
            </div>
        </div>
    );
};

export default PaymentPage;
