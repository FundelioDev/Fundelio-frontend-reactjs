"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userApi } from "@/api/userApi";
import { motion } from "framer-motion";
import { Loader2, MailCheck, XCircle } from "lucide-react";

export default function VerifyChangeEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!token) {
      setMessage("Token không hợp lệ hoặc đã hết hạn!");
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const response = await userApi.verifyChangeEmail({ token });
        setMessage(
          response?.data?.message || "Đổi email thành công!"
        );
        setStatus("success");
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          "Xác thực thất bại! Token có thể đã hết hạn.";
        setMessage(errorMsg);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status === "success") {
      if (countdown <= 0) {
        navigate("/auth#login");
        return;
      }
      const timerId = setTimeout(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [status, countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-darker p-4">
      <div className="sm:max-w-[480px] w-full p-0 overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            
            {status === "loading" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Đang xác thực...</h2>
                  <p className="text-base text-muted-foreground">
                    Vui lòng chờ trong giây lát.
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Xác thực thất bại!</h2>
                  <p className="text-base text-red-500">{message}</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <MailCheck className="w-10 h-10 text-green-500" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">ĐỔI EMAIL THÀNH CÔNG!</h2>
                  <p className="text-base text-muted-foreground">{message}</p>
                </div>
                <div className="space-y-2 pt-4">
                  <p className="text-base text-muted-foreground">
                    Điều hướng về trang login sau
                  </p>
                  <div className="font-bold text-6xl text-primary">
                    {countdown}
                  </div>
                </div>
              </>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}