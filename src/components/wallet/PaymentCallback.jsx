import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext"; 

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUserData } = useAuth();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const responseCode = searchParams.get("vnp_ResponseCode");
      const amountRaw = searchParams.get("vnp_Amount");
      const amount = amountRaw ? parseInt(amountRaw) / 100 : 0;
      const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);

      if (responseCode === "00") {
        toast.success(`Nạp thành công ${formattedAmount} VND!`);
        try {
            await fetchUserData(); 
        } catch (err) {
            console.error("Lỗi cập nhật user data:", err);
        }
      } else {
        toast.error("Giao dịch thất bại hoặc đã bị hủy.");
      }
    };

    checkPaymentStatus();
  }, [searchParams, navigate, fetchUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
            <FaSpinner className="w-16 h-16 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý giao dịch...</h2>
        <p className="text-gray-500 mb-6">
            Vui lòng không tắt trình duyệt. Hệ thống đang cập nhật số dư ví của bạn.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
}