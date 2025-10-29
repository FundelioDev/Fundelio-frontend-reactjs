import React, { useState } from 'react';
import PaymentPackageCard from './PaymentPackageCard';

const PaymentPage = () => {
    // Payment packages data - 9 packages from 1 to 1000
    const packages = [
        { id: 1, amount: 1, bonus: 0, price: 1, image: '/packages/pack1.png' },
        { id: 2, amount: 5, bonus: 105, price: 5, image: '/packages/pack2.png' },
        { id: 3, amount: 10, bonus: 275, price: 10, image: '/packages/pack3.png' },
        { id: 4, amount: 20, bonus: 475, price: 20, image: '/packages/pack4.png' },
        { id: 5, amount: 50, bonus: 750, price: 50, image: '/packages/pack5.png' },
        { id: 6, amount: 100, bonus: 1975, price: 100, image: '/packages/pack6.png' },
        { id: 7, amount: 200, bonus: 3750, price: 200, image: '/packages/pack7.png' },
        { id: 8, amount: 500, bonus: 9500, price: 500, image: '/packages/pack8.png' },
        { id: 9, amount: 1000, bonus: 20000, price: 1000, image: '/packages/pack9.png' },
    ];

    // State
    const [selectedPackage, setSelectedPackage] = useState(null); // No default selection
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo'); // 'momo' or 'bank'
    const [quantity, setQuantity] = useState(1);

    // Format price to VND
    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Calculate total
    const totalPrice = selectedPackage ? selectedPackage.price * quantity : 0;
    const totalRP = selectedPackage ? (selectedPackage.amount + selectedPackage.bonus) * quantity : 0;

    // Payment methods
    const paymentMethods = [
        {
            id: 'momo',
            name: 'MoMo',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#A50064" />
                    <path d="M24 12C17.4 12 12 17.4 12 24C12 30.6 17.4 36 24 36C30.6 36 36 30.6 36 24C36 17.4 30.6 12 24 12Z" fill="white" />
                    <path d="M24 15C19.05 15 15 19.05 15 24C15 28.95 19.05 33 24 33C28.95 33 33 28.95 33 24C33 19.05 28.95 15 24 15Z" fill="#A50064" />
                    <text x="24" y="28" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">M</text>
                </svg>
            ),
            description: 'Thanh toán qua ví điện tử MoMo'
        },
        {
            id: 'bank',
            name: 'Ngân hàng',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" className="stroke-primary" />
                    <path d="M2 10h20" strokeWidth="2" className="stroke-primary" />
                    <circle cx="7" cy="15" r="1" fill="currentColor" className="fill-primary" />
                </svg>
            ),
            description: 'Chuyển khoản ngân hàng'
        }
    ];

    return (
        <div className="min-h-screen bg-background-lighter dark:bg-[#14182b] py-8 px-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-8 pt-20">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
                        Nạp Credits
                    </h1>
                    <p
                        className="text-lg font-bold text-secondary"
                        style={{
                            textShadow: `
                2px 2px 0px rgba(0, 0, 0, 0.2),
                4px 4px 0px rgba(0, 0, 0, 0.1),
                1px 1px 0px rgba(255, 183, 0, 0.5)
              `
                        }}
                    >
                        Chọn gói nạp phù hợp với bạn
                    </p>
                </div>

                {/* Main Grid Layout */}
                <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4">
                    Chọn gói nạp
                </h2>
                <div className="grid lg:grid-cols-[1fr_360px] gap-12">
                    {/* Left Column - Payment Packages */}
                    <div>


                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {packages.map((pkg) => (
                                <PaymentPackageCard
                                    key={pkg.id}
                                    amount={pkg.amount}
                                    bonus={pkg.bonus}
                                    price={pkg.price}
                                    image={pkg.image}
                                    selected={selectedPackage?.id === pkg.id}
                                    onSelect={() => setSelectedPackage(pkg)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="bg-white dark:bg-[#1c2237] rounded-lg shadow-md overflow-hidden">
                            {/* Header */}
                            <div className="bg-primary px-4 py-3">
                                <h2 className="text-lg font-bold text-white">
                                    Thông tin đơn hàng
                                </h2>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                {/* Selected Package */}
                                {selectedPackage ? (
                                    <div className="flex items-center gap-3 p-3 bg-background-lighter dark:bg-darker rounded-lg border border-border-light dark:border-white/10">
                                        <img
                                            src={selectedPackage.image}
                                            alt="Package"
                                            className="w-16 h-16 object-contain"
                                        />
                                        <div className="flex-1">
                                            <p className="text-text-secondary dark:text-white/70 text-xs mb-1">
                                                Gói {selectedPackage.amount + selectedPackage.bonus} RP
                                            </p>
                                            <p className="text-xl font-bold text-text-primary dark:text-white">
                                                {formatPrice(selectedPackage.price)} VND
                                            </p>
                                        </div>
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-2 bg-white dark:bg-darker-2 rounded-lg border border-border-light dark:border-white/10 px-2 py-1">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="text-text-primary dark:text-white hover:text-primary transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="text-base font-semibold text-text-primary dark:text-white min-w-[2rem] text-center">
                                                x{quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="text-text-primary dark:text-white hover:text-primary transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center p-6 bg-primary/10 rounded-md border border-primary/40 dark:border-white/10">
                                        <p className="text-text-secondary dark:text-white/60 text-center text-sm">
                                            Vui lòng chọn gói nạp bên trái
                                        </p>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary dark:text-white mb-3">
                                        Phương thức thanh toán
                                    </h3>

                                    <div className="space-y-2">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                                className={`
                          w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
                          ${selectedPaymentMethod === method.id
                                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                        : 'border-border-light dark:border-white/10 hover:border-primary/50 bg-white dark:bg-darker'
                                                    }
                        `}
                                            >
                                                <div className="flex-shrink-0">
                                                    {method.icon}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-text-primary dark:text-white text-sm">
                                                        {method.name}
                                                    </p>
                                                    <p className="text-xs text-text-secondary dark:text-white/60">
                                                        {method.description}
                                                    </p>
                                                </div>
                                                <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${selectedPaymentMethod === method.id
                                                        ? 'border-primary bg-primary'
                                                        : 'border-border dark:border-white/20'
                                                    }
                        `}>
                                                    {selectedPaymentMethod === method.id && (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-border-light dark:border-white/10" />

                                {/* Payment Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary dark:text-white mb-3">
                                        Chi tiết thanh toán
                                    </h3>

                                    <div className="space-y-2 p-3 bg-primary/10 rounded-md border border-primary/40">
                                        <div className="flex justify-between text-text-secondary dark:text-white/70 text-sm">
                                            <span>Tổng tiền:</span>
                                            <span className="font-semibold text-text-primary dark:text-white">
                                                {formatPrice(totalPrice)} VND
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center text-lg font-bold pt-3 border-t-2 border-border-light dark:border-white/10">
                                    <span className="text-text-primary dark:text-white">Tổng thanh toán</span>
                                    <span className="text-2xl text-secondary">
                                        {formatPrice(totalPrice)} VND
                                    </span>
                                </div>

                                {/* Terms */}
                                <div className="text-xs text-text-secondary dark:text-white/60">
                                    Bằng việc nhấn nút "Thanh toán ngay", bạn đồng ý rằng giao dịch này không hoàn, không hủy và tuân thủ với{' '}
                                    <a href="#" className="text-primary hover:underline">
                                        Điều khoản sử dụng
                                    </a>
                                    {' '}và{' '}
                                    <a href="#" className="text-primary hover:underline">
                                        Chính sách bảo mật
                                    </a>
                                    {' '}của VNG.
                                </div>

                                {/* Payment Button */}
                                <button
                                    disabled={!selectedPackage}
                                    className={`
                    w-full py-3 font-bold text-base rounded-lg transition-all duration-200
                    ${selectedPackage
                                            ? 'bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                            : 'bg-border-light dark:bg-white/10 text-text-secondary dark:text-white/40 cursor-not-allowed'
                                        }
                  `}
                                >
                                    Thanh toán ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
