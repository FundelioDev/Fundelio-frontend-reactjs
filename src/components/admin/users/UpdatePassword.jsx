import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { userApi } from "@/api/userApi";
import { storageService } from "@/services/storage";
import { toast } from "react-hot-toast";
import {
  PasswordStrengthIndicator,
  usePasswordValidation,
} from "@/components/auth/PasswordStrengthIndicator";


const PasswordInput = ({ label, value, onChange, show, setShow, error }) => (
  <div className="text-left space-y-2 relative">
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm pr-10 dark:bg-darker ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "dark:border-gray-500"
          }`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && (
      <p className="text-xs text-left text-red-500 mt-1">{error}</p>
    )}
  </div>
);

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const passwordValidation = usePasswordValidation(newPassword);
  const handleBackendErrors = (backendErrors) => {
    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
      const fieldErrors = {};
      backendErrors.forEach((err) => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
      setErrors(fieldErrors);
    }
  };

  const handleChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await userApi.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      const msg = res?.data?.message || "Đổi mật khẩu thành công!";
      toast.success(msg);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        storageService.removeAccessToken();
        window.location.href = "/auth";
      }, 1500);

    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);

      const backendErrors = error?.response?.data?.errors;
      const singleMessage = error?.response?.data?.message;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        handleBackendErrors(backendErrors);
      } else if (singleMessage) {
        if (singleMessage.toLowerCase().includes("mật khẩu hiện tại")) {
          setErrors({ currentPassword: singleMessage });
        } else {
          setErrors({ general: singleMessage });
        }
      } else {
        setErrors({ general: "Đổi mật khẩu thất bại! Vui lòng thử lại." });
      }


    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="p-5 w-full max-w-md bg-white dark:bg-darker rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-4 text-center">
          <div>
            <h3 className="text-xl font-semibold text-text-primary dark:text-white">
              Mật khẩu
            </h3>
            <p className="text-sm text-muted-foreground">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>

          <PasswordInput
            label="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={handleChange(setCurrentPassword, "currentPassword")}
            show={showCurrent}
            setShow={setShowCurrent}
            error={errors.currentPassword}
          />

          <PasswordInput
            label="Mật khẩu mới"
            value={newPassword}
            onChange={handleChange(setNewPassword, "newPassword")}
            show={showNew}
            setShow={setShowNew}
            error={errors.newPassword}
          />

          <div className="">
            <PasswordStrengthIndicator password={newPassword} />
          </div>          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword, "confirmPassword")}
            show={showConfirm}
            setShow={setShowConfirm}
            error={errors.confirmPassword}
          />

          {errors.general && (
            <p className="text-sm text-center text-red-500">
              {errors.general}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}