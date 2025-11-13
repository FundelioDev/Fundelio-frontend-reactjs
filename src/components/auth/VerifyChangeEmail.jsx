"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userApi } from "@/api/userApi";  

export default function VerifyChangeEmail() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Token không hợp lệ!");
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading");
        console.log(" Verifying token:", token);

        const response = await userApi.verifyChangeEmail({ token });

        console.log("Success:", response?.data);
        setMessage(
          response?.data?.message || "Email đã được xác thực thành công!"
        );
        setStatus("success");

        setTimeout(() => {
          navigate("/auth#login");
        }, 2000);
      } catch (error) {
        console.error("Error:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Xác thực thất bại!";
        setMessage(errorMsg);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-darker">
      
    </div>
  );
}
