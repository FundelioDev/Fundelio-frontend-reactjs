import React from 'react';
import {
    FaTimes,
    FaCheckCircle,
    FaTimesCircle,
    FaBan,
    FaHistory,
    FaClock,
    FaDollarSign,
    FaCreditCard,
    FaCodeBranch,
    FaUniversity,
    FaPercent
} from 'react-icons/fa';

const extractTransactionDetails = (description) => {
    if (!description || !description.includes(':')) {
        return { campaignName: null, platformFeeText: null, receivedAmountText: null };
    }

    const parts = description.split(': ');
    const detailsPart = parts.slice(1).join(': ');
    const detailsSplit = detailsPart.split(' | ');

    const campaignName = detailsSplit[0]?.trim() || null;

    const platformFeeItem = detailsSplit.find(item =>
        item.includes('Phí nền tảng (5%)')
    );
    const platformFeeText = platformFeeItem ? platformFeeItem.trim() : null;

    const receivedAmountItem = detailsSplit.find(item =>
        item.includes('Số tiền nhận')
    );
    const receivedAmountText = receivedAmountItem
        ? receivedAmountItem.split(':').pop().trim()
        : null;

    return { campaignName, platformFeeText, receivedAmountText };
};

const formatCurrency = (value) => {
    if (!value) return "0";
    const stringVal = String(value).replace(/\./g, "");
    const numberVal = Number(stringVal);
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(isNaN(numberVal) ? 0 : numberVal);
};

const formatDate = (dateString) => {
    if (!dateString) return "---";
    try {
        const cleanDateStr = dateString.replace(/ [AP]M$/i, '');
        const date = new Date(cleanDateStr);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date).replace(' lúc', ' -');
    } catch {
        return dateString;
    }
};

const getStatusDetails = (status) => {
    const normalizedStatus = status ? status.toUpperCase() : '';
    switch (normalizedStatus) {
        case 'SUCCESS':
            return { text: "Thành công", color: "text-green-600", icon: FaCheckCircle };
        case 'FAILED':
            return { text: "Thất bại", color: "text-red-600", icon: FaTimesCircle };
        case 'CANCELLED':
            return { text: "Đã hủy", color: "text-gray-600", icon: FaBan };
        case 'PENDING':
            return { text: "Đang xử lý", color: "text-yellow-600", icon: FaHistory };
        default:
            return { text: "Không xác định", color: "text-gray-500", icon: FaHistory };
    }
};

const getTransactionTypeName = (type) => {
    switch (type) {
        case 'DEPOSIT': return 'Nạp tiền';
        case 'PAYMENT': return 'Thanh toán';
        case 'REFUND': return 'Hoàn tiền';
        case 'TRANSFER': return 'Chuyển/Nhận tiền';
        default: return type;
    }
};

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const statusDetail = getStatusDetails(transaction.status);
    const isIncome =
        transaction.transactionType === 'DEPOSIT' ||
        transaction.transactionType === 'REFUND' ||
        transaction.transactionType === 'TRANSFER';

    let extractedDetails = { campaignName: null, platformFeeText: null };

    if (transaction.transactionType === 'TRANSFER' && transaction.description) {
        extractedDetails = extractTransactionDetails(transaction.description);
    }

    const { campaignName, platformFeeText, receivedAmountText } = extractedDetails;

    let feeLabel = null;
    let feeValue = null;

    if (platformFeeText) {
        const parts = platformFeeText.split(':');
        feeLabel = parts[0]?.trim() || 'Phí nền tảng (5%)';
        feeValue = parts.length > 1 ? parts.slice(1).join(':').trim() : null;
    }

    const DetailRow = ({ icon: Icon, label, value, valueColor = 'text-gray-800' }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
        </div>
    );

    const DETAIL_FIELDS = [
        { key: 'createdAt', label: 'Thời gian giao dịch', icon: FaClock, format: 'date' },
        {
            key: 'balanceAfter',
            label: 'Số dư sau GD',
            icon: FaDollarSign,
            color: 'text-blue-600',
            condition: (t) => t.status === 'SUCCESS',
            format: 'currency'
        },
        { key: 'paymentMethod', label: 'Phương thức thanh toán', icon: FaCreditCard, default: 'Ví Fundelio' },
        { key: 'vnpBankCode', label: 'Ngân hàng', icon: FaUniversity, formatValue: (v) => `${v} (VNPay)` },
        { key: 'vnpTransactionNo', label: 'Mã tham chiếu VNPay', icon: FaCodeBranch, valueColor: 'text-xs font-mono' },
        { key: 'transactionId', label: 'Mã giao dịch nội bộ', icon: FaCodeBranch, valueColor: 'text-xs font-mono' },
        { key: 'vnpResponseCode', label: 'Mã phản hồi VNPay', icon: FaCodeBranch },
    ];

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 bg-blue-50/70 rounded-t-2xl border-b border-blue-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md ${isIncome ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                                {isIncome ? <FaCheckCircle /> : <FaTimesCircle />}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {transaction.description
                                    ? transaction.description.split(':')[0]
                                    : getTransactionTypeName(transaction.transactionType)}
                            </h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    <p className={`text-3xl font-extrabold text-right ${isIncome ? 'text-green-700' : 'text-gray-800'} mt-4`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>

                    <div className="flex justify-end mt-2">
                        <span className={`text-sm font-bold ${statusDetail.color} flex items-center gap-1`}>
                            <statusDetail.icon className="w-4 h-4" />
                            {statusDetail.text.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-gray-700 mb-3">Chi tiết sao kê</h3>

                    {campaignName && (
                        <DetailRow
                            icon={FaCodeBranch}
                            label="Tên chiến dịch"
                            value={campaignName}
                            valueColor="text-blue-600"
                        />
                    )}

                    {feeValue && (
                        <DetailRow
                            icon={FaPercent}
                            label={feeLabel}
                            value={feeValue}
                            valueColor="text-red-500"
                        />
                    )}

                    {receivedAmountText && (
                        <DetailRow
                            icon={FaDollarSign}
                            label="Số tiền nhận"
                            value={receivedAmountText}
                            valueColor="text-green-700"
                        />
                    )}

                    {DETAIL_FIELDS.map((field) => {
                        const rawValue = transaction[field.key];
                        const value = field.key === 'paymentMethod' && !rawValue ? field.default : rawValue;
                        const isValid = field.condition ? field.condition(transaction) : true;
                        if (!isValid || value === null || value === undefined || value === '') return null;

                        let displayValue = value;
                        if (field.formatValue) displayValue = field.formatValue(rawValue);
                        if (field.format === 'currency') displayValue = formatCurrency(rawValue);
                        if (field.format === 'date') displayValue = formatDate(rawValue);
                        if (field.key === 'transactionId') displayValue = String(rawValue);

                        return (
                            <DetailRow
                                key={field.key}
                                icon={field.icon}
                                label={field.label}
                                value={displayValue}
                                valueColor={field.color || field.valueColor}
                            />
                        );
                    })}
                </div>

                <div className="p-4 bg-gray-50 rounded-b-2xl text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
