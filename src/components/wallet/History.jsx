import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaPlus,
  FaHistory,
  FaArrowRight,
  FaExchangeAlt,
  FaUniversity,
  FaFilter,
  FaShoppingBag,
  FaTimesCircle,
  FaCheckCircle,
  FaBan
} from "react-icons/fa";
import { walletApi } from "@/api/walletApi";
import TransactionDetailModal from './TransactionDetailModal';

export default function History() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const navigate = useNavigate();

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
    if (!dateString) return "";
    try {
      const cleanDateStr = dateString.replace(/ [AP]M$/i, '');
      const date = new Date(cleanDateStr);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(date).replace(' lúc', ' -');
    } catch (e) {
      return dateString;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const walletRes = await walletApi.getWalletInfo();
      if (walletRes?.data?.success) {
        setBalance(walletRes.data.data.balance);
      }

      const filters = { type: filterType, status: filterStatus };
      const historyRes = await walletApi.getTransactions(1, 20, filters, 'createdAt,desc');

      if (historyRes?.data?.success) {
        setTransactions(historyRes.data.data.content || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType, filterStatus]);

  const handleRowClick = (item) => {
    setSelectedTransaction(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleContinuePayment = (transactionId) => {
    localStorage.setItem("pendingTransactionId", transactionId);
    navigate("/payment");
  };

  const renderStatusBadge = (status) => {
    const normalizedStatus = status ? status.toUpperCase() : '';
    let text, bgColor, textColor, Icon;

    switch (normalizedStatus) {
      case 'SUCCESS':
        text = "THÀNH CÔNG"; bgColor = "bg-green-100 dark:bg-green-900"; textColor = "text-green-700 dark:text-green-400"; Icon = FaCheckCircle; break;
      case 'FAILED':
        text = "THẤT BẠI"; bgColor = "bg-red-100 dark:bg-red-900"; textColor = "text-red-700 dark:text-red-400"; Icon = FaTimesCircle; break;
      case 'CANCELLED':
        text = "ĐÃ HỦY"; bgColor = "bg-gray-100 dark:bg-gray-700"; textColor = "text-gray-600 dark:text-gray-300"; Icon = FaBan; break;
      case 'PENDING':
        text = "ĐANG XỬ LÝ"; bgColor = "bg-yellow-100 dark:bg-yellow-900"; textColor = "text-yellow-700 dark:text-yellow-400"; Icon = FaHistory; break;
      default:
        text = normalizedStatus; bgColor = "bg-gray-100 dark:bg-gray-700"; textColor = "text-gray-600 dark:text-gray-300"; Icon = FaHistory;
    }

    return (
      <div className={`flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-bold rounded ${bgColor} ${textColor}`}>
        <Icon size={10} />
        <span>{text}</span>
      </div>
    );
  };

  const getTransactionTypeName = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'NẠP TIỀN';
      case 'PAYMENT': return 'THANH TOÁN';
      case 'REFUND': return 'HOÀN TIỀN';
      case 'TRANSFER': return 'CHUYỂN TIỀN';
      default: return type;
    }
  };

  const renderAmount = (item) => {
    const withdrawal = item.transactionType === "PAYMENT" ? formatCurrency(item.amount) : "---";
    const deposit = item.transactionType !== "PAYMENT" ? formatCurrency(item.amount) : "---";

    return { withdrawal, deposit };
  };

  const getShortDescription = (description) => {
    if (!description) return "";
    return description.split(":")[0].trim();
  };

  const renderTypeBadge = (type) => {
    let text = getTransactionTypeName(type);
    let bgColor = "", textColor = "";

    switch (type) {
      case 'DEPOSIT':
        bgColor = "bg-blue-100 dark:bg-blue-900";
        textColor = "text-blue-700 dark:text-blue-400";
        break;
      case 'PAYMENT':
        bgColor = "bg-red-100 dark:bg-red-900";
        textColor = "text-red-700 dark:text-red-400";
        break;
      case 'REFUND':
        bgColor = "bg-yellow-100 dark:bg-yellow-900";
        textColor = "text-yellow-700 dark:text-yellow-400";
        break;
      case 'TRANSFER':
        bgColor = "bg-green-100 dark:bg-green-900";
        textColor = "text-green-700 dark:text-green-400";
        break;
      default:
        bgColor = "bg-gray-100 dark:bg-gray-700";
        textColor = "text-gray-600 dark:text-gray-300";
    }

    return (
      <div className={`flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-bold rounded ${bgColor} ${textColor}`}>
        {text}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-10 flex flex-col pt-28 md:pt-20">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-blue-100 font-medium mb-1 text-sm uppercase tracking-wider">Số dư khả dụng</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {formatCurrency(balance)}
            </h1>
          </div>
          <button
            onClick={() => navigate("/payment")}
            className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <FaPlus /> Nạp tiền ngay
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FaHistory className="text-blue-600" /> Lịch sử giao dịch
          </h2>
          <div className="flex gap-3 w-full md:w-auto text-sm">

            <div className="relative w-full md:w-40">
              <label className="text-xs text-gray-500 dark:text-gray-300 font-semibold ml-1 mb-1 block">Loại giao dịch</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg focus:outline-none focus:border-blue-500 font-medium shadow-sm appearance-none cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <option value="ALL">Tất cả (ALL)</option>
                <option value="DEPOSIT">DEPOSIT</option>
                <option value="PAYMENT">PAYMENT</option>
                <option value="REFUND">REFUND</option>
                <option value="TRANSFER">TRANSFER</option>
              </select>
              <div className="pointer-events-none absolute bottom-2.5 right-3 text-gray-500 dark:text-gray-300">
                <FaFilter size={10} />
              </div>
            </div>

            <div className="relative w-full md:w-40">
              <label className="text-xs text-gray-500 dark:text-gray-300 font-semibold ml-1 mb-1 block">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg focus:outline-none focus:border-blue-500 font-medium shadow-sm appearance-none cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <option value="ALL">Tất cả (ALL)</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <div className="pointer-events-none absolute bottom-2.5 right-3 text-gray-500 dark:text-gray-300">
                <FaFilter size={10} />
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[200px]">
                  Giao dịch / Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Loại GD
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                  Tiền ra (VND)
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                  Tiền vào (VND)
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[100px]">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 dark:text-gray-300 text-sm">Đang tải dữ liệu...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500 dark:text-gray-300">
                    <FaShoppingBag className="text-gray-300 dark:text-gray-500 text-3xl mx-auto mb-2" />
                    Không tìm thấy giao dịch nào phù hợp.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => {
                  const amounts = renderAmount(item);
                  return (
                    <tr
                      key={item.transactionId}
                      className="hover:bg-blue-50/20 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
                            {item.transactionType === 'DEPOSIT' ? <FaWallet /> : item.transactionType === 'REFUND' ? <FaExchangeAlt /> : <FaShoppingBag />}
                          </div>
                          <div>
                            <p
                              className="text-gray-800 dark:text-gray-200 font-semibold truncate max-w-xs"
                              title={item.description}
                            >
                              {getShortDescription(item.description) || getTransactionTypeName(item.transactionType)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                              {formatDate(item.createdAt)}
                            </p>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
                              ID: #{item.transactionId?.slice(0, 6)}...
                              {item.vnpBankCode && (
                                <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                                  | <FaUniversity size={9} /> {item.vnpBankCode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {renderTypeBadge(item.transactionType)}
                      </td>

                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-medium ${amounts.withdrawal !== '---' ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                        {amounts.withdrawal}
                      </td>

                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-medium ${amounts.deposit !== '---' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {amounts.deposit}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {renderStatusBadge(item.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center text-gray-400 dark:text-gray-300">
              Đang tải dữ liệu...
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center text-gray-500 dark:text-gray-300">
              <FaShoppingBag className="text-gray-300 dark:text-gray-500 text-3xl mx-auto mb-2" />
              Không tìm thấy giao dịch nào phù hợp.
            </div>
          ) : (
            transactions.map((item) => {
              const amounts = renderAmount(item);
              return (
                <div
                  key={item.transactionId}
                  onClick={() => handleRowClick(item)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">
                      {item.transactionType === 'DEPOSIT' ? <FaWallet /> : item.transactionType === 'REFUND' ? <FaExchangeAlt /> : <FaShoppingBag />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
                        {getShortDescription(item.description) || getTransactionTypeName(item.transactionType)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Loại GD:</span>
                      {renderTypeBadge(item.transactionType)}
                    </div>

                    {amounts.withdrawal !== '---' && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Tiền ra:</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{amounts.withdrawal}</span>
                      </div>
                    )}

                    {amounts.deposit !== '---' && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Tiền vào:</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{amounts.deposit}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Trạng thái:</span>
                      {renderStatusBadge(item.status)}
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                        <span>ID: #{item.transactionId?.slice(0, 8)}...</span>
                        {item.vnpBankCode && (
                          <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                            <FaUniversity size={10} /> {item.vnpBankCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </div>
  );
}
