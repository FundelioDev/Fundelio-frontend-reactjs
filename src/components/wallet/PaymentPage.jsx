import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsModal from './TermsModal';
import { toast } from 'react-hot-toast';
import { walletApi } from '@/api/walletApi';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [amount, setAmount] = useState(1000000);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const [balance, setBalance] = useState(0);
    const [initialBalance, setInitialBalance] = useState(0);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const pollInterval = useRef(null);

    const [depositLimits, setDepositLimits] = useState({ min: 10000, max: 50000000 });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth');
        }
    }, [isLoggedIn, navigate]);



    const formatPrice = (value) => {
        const numberVal = Number(value);
        return new Intl.NumberFormat('vi-VN').format(isNaN(numberVal) ? 0 : numberVal);
    };

    const parseBackendNumber = (str) => {
        if (!str) return 0;
        return Number(String(str).replace(/\./g, ''));
    };

    useEffect(() => {
        if (isLoggedIn) {
            const getBalance = async () => {
                try {
                    const res = await walletApi.getWalletInfo();
                    if (res?.data?.success) {
                        const realBalance = parseBackendNumber(res.data.data.balance);
                        setBalance(realBalance);
                        setInitialBalance(realBalance);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            getBalance();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    const quickAmounts = [500000, 1000000, 2000000, 5000000];

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const numValue = value ? parseInt(value) : 0;
        setAmount(numValue);

        if (numValue > 1000000000) {
            // Giữ lại limit cứng rất lớn để tránh input quá dài gây lỗi UI nếu cần, hoặc bỏ luôn cũng được.
            // Ở đây tôi bỏ validate min/max theo yêu cầu, chỉ giữ setAmount.
        }
    };

    const handleQuickAmount = (quickAmount) => {
        setAmount(quickAmount);

    };

    const startPolling = () => {
        setIsProcessing(true);
        setIsSuccess(false);

        pollInterval.current = setInterval(async () => {
            try {
                const res = await walletApi.getWalletInfo();
                if (res?.data?.success) {
                    const newBalance = parseBackendNumber(res.data.data.balance);

                    if (newBalance > initialBalance) {
                        clearInterval(pollInterval.current);
                        setIsProcessing(false);
                        setIsSuccess(true);
                        toast.success(`Đã nhận được tiền!`);
                    }
                }
            } catch (err) {
                console.error("Polling check failed", err);
            }
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            toast.error("Vui lòng đồng ý với Điều khoản và điều kiện.");
            return;
        }
        if (!amount || amount <= 0) {
            toast.error(`Vui lòng nhập số tiền hợp lệ.`);
            return;
        }

        try {
            const currentOrigin = window.location.origin;
            const payload = {
                amount: amount,
                paymentMethod: "VNPay",
                returnUrl: `${currentOrigin}/payment/callback`
            };

            const response = await walletApi.initiateDeposit(payload);
            const paymentUrl = response?.data?.data?.paymentUrl;

            if (paymentUrl) {
                window.open(paymentUrl, '_blank');
                startPolling();
            } else {
                toast.error("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
            }

        } catch (error) {
            const msg = error?.errors?.[0]?.message || "Khởi tạo thanh toán thất bại.";
            toast.error(msg);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="bg-background-light-2 dark:bg-darker py-16 px-4 pb-20 relative">
            {(isProcessing || isSuccess) && (
                <div className="fixed inset-0 z-[9999] bg-white/95 dark:bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
                    {isSuccess ? (
                        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                                <FaCheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                Thanh toán thành công!
                            </h2>
                            <p className="text-gray-500 dark:text-gray-300 text-lg">
                                Số tiền <span className="font-bold text-green-600">{formatPrice(amount)} VND</span> đã được cộng vào ví.
                            </p>
                            <button
                                onClick={() => navigate('/wallet')}
                                className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                Hoàn tất & Xem lịch sử
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <FaSpinner className="w-16 h-16 text-primary animate-spin mb-6" />
                            <h2 className="text-3xl font-bold text-primary mb-3">Đang chờ thanh toán...</h2>
                            <div className="max-w-lg space-y-2">
                                <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                                    Cổng thanh toán VNPay đang được mở ở tab mới.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Vui lòng hoàn tất giao dịch. Hệ thống sẽ tự động cập nhật ngay khi nhận được tiền.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (pollInterval.current) clearInterval(pollInterval.current);
                                    setIsProcessing(false);
                                    toast.dismiss();
                                }}
                                className="mt-10 px-6 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                                Hủy chờ
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-20">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-white">
                            Nạp tiền vào ví
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Số dư khả dụng: <span className="font-bold text-primary text-lg">{formatPrice(balance)} VND</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/wallet')}
                        className="text-sm sm:text-base md:text-lg text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
                    >
                        Quay lại Ví của tôi
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 mb-8">
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-4">
                                Chọn phương thức thanh toán
                            </h2>
                            <div className="relative bg-white dark:bg-darker-2 rounded-md border-2 border-indigo-400 shadow-md p-4 cursor-pointer hover:shadow-lg transition-all">
                                <div className="flex items-center gap-4">
                                    <img src="/VNPAY_Logo.svg" alt="VNPay Logo" className="w-20 sm:w-24 md:w-30 h-auto" />
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Thanh toán qua VNPay
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

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

                            <button
                                type="submit"
                                disabled={!amount || amount <= 0 || !acceptedTerms || isProcessing || isSuccess}
                                className={`w-full sm:w-[14rem] px-4 sm:px-5 py-2 sm:py-3 rounded-md font-bold text-base transition-all ${amount > 0 && acceptedTerms
                                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? "Đang xử lý..." : (amount > 0 && acceptedTerms
                                    ? `Nạp ${formatPrice(amount)} VND`
                                    : 'Chọn số tiền để nạp')}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start lg:items-center justify-center">
                        <div className="w-full bg-white dark:bg-darker-2 backdrop-blur-xl rounded-md p-6 sm:p-8 shadow-lg border-border">
                            <h3 className="text-base sm:text-lg font-semibold text-text-prim dark:text-white mb-4">
                                Số tiền nạp
                            </h3>
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
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        type="button"
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
                </form>

                <div className="lg:hidden flex flex-col gap-4">
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

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!amount || amount <= 0 || !acceptedTerms || isProcessing || isSuccess}
                        className={`w-full px-6 py-4 rounded-md font-bold text-base transition-all ${amount > 0 && acceptedTerms
                            ? 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl active:scale-95'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? "Đang xử lý..." : (amount > 0 && acceptedTerms
                            ? `Nạp ${formatPrice(amount)} VND`
                            : 'Chọn số tiền để nạp')}
                    </button>
                </div>

                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />
            </div>
        </div>
    );
};

export default PaymentPage;
