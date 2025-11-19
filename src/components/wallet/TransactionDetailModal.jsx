// file: TransactionDetailModal.jsx

import React from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaBan, FaHistory, FaClock, FaDollarSign, FaCreditCard, FaCodeBranch, FaUniversity } from 'react-icons/fa';

// Các hàm format giả định được truyền từ History.jsx
// Nếu bạn muốn dùng chung, có thể import từ file utils nếu có.
const formatCurrency = (value) => {
    if (!value) return "0";
    let stringVal = String(value).replace(/\./g, ""); 
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
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', second: '2-digit'
      }).format(date).replace(' lúc', ' -'); 
    } catch (e) {
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

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const statusDetail = getStatusDetails(transaction.status);
    const isIncome = transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'REFUND';

    // Component nhỏ gọn hiển thị một dòng thông tin
    const DetailRow = ({ icon: Icon, label, value, valueColor = 'text-gray-800' }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-3 text-gray-500">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                
                {/* Header (Phần summary) */}
                <div className="p-6 bg-blue-50/70 rounded-t-2xl border-b border-blue-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md ${isIncome ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                                {isIncome ? <FaCheckCircle /> : <FaTimesCircle />}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {transaction.description || (isIncome ? "Giao dịch Nhận tiền" : "Giao dịch Thanh toán")}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Số tiền chính */}
                    <p className={`text-3xl font-extrabold text-right ${isIncome ? 'text-green-700' : 'text-gray-800'} mt-4`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    
                    {/* Trạng thái lớn */}
                    <div className="flex justify-end mt-2">
                        <span className={`text-sm font-bold ${statusDetail.color} flex items-center gap-1`}>
                            <statusDetail.icon className="w-4 h-4"/>
                            {statusDetail.text.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Body (Chi tiết sao kê) */}
                <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-gray-700 mb-3">Chi tiết sao kê</h3>
                    
                    {/* Hàng 1: Thời gian */}
                    <DetailRow 
                        icon={FaClock} 
                        label="Thời gian giao dịch" 
                        value={formatDate(transaction.createdAt)} 
                    />

                    {/* Hàng 2: Số dư sau */}
                    {transaction.status === 'SUCCESS' && (
                        <DetailRow 
                            icon={FaDollarSign} 
                            label="Số dư sau GD" 
                            value={formatCurrency(transaction.balanceAfter)} 
                            valueColor="text-blue-600"
                        />
                    )}

                    {/* Hàng 3: Phương thức */}
                    <DetailRow 
                        icon={FaCreditCard} 
                        label="Phương thức thanh toán" 
                        value={transaction.paymentMethod || 'Ví Fundelio'} 
                    />

                    {/* Hàng 4: Ngân hàng */}
                    {transaction.vnpBankCode && (
                        <DetailRow 
                            icon={FaUniversity} 
                            label="Ngân hàng" 
                            value={`${transaction.vnpBankCode} (VNPay)`} 
                        />
                    )}

                    {/* Mã tham chiếu VNPay (Nếu có) */}
                    {transaction.vnpTransactionNo && (
                        <DetailRow 
                            icon={FaCodeBranch} 
                            label="Mã tham chiếu VNPay" 
                            value={transaction.vnpTransactionNo} 
                            valueColor="text-xs font-mono"
                        />
                    )}
                    
                    {/* Mã giao dịch nội bộ */}
                    <DetailRow 
                        icon={FaCodeBranch} 
                        label="Mã giao dịch nội bộ" 
                        value={transaction.transactionId} 
                        valueColor="text-xs font-mono"
                    />

                    {/* Mã phản hồi VNPay (Nếu có) */}
                    {transaction.vnpResponseCode && (
                        <DetailRow 
                            icon={FaCodeBranch} 
                            label="Mã phản hồi VNPay" 
                            value={transaction.vnpResponseCode} 
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 rounded-b-2xl text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;