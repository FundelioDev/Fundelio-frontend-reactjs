import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { userApi } from "@/api/userApi";
import { storageService } from "@/services/storage";

export default function UpdatePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới và xác nhận không trùng khớp.");
            return;
        }

        try {
            setLoading(true);
            const res = await userApi.updatePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            const msg = res?.data?.message || "Đổi mật khẩu thành công!";
            setMessage(msg);

            setTimeout(() => {
                storageService.removeAccessToken();
                window.location.href = "/auth";
            }, 1500);
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Đổi mật khẩu thất bại!";
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, value, onChange, show, setShow }) => (
        <div className="text-left space-y-2 relative">
            <label className="text-sm font-medium">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <div className="p-6 w-full max-w-md bg-white dark:bg-darker rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="space-y-6 text-center">
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary dark:text-white">
                            Password
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Update your password to protect your account
                        </p>
                    </div>

                    <PasswordInput
                        label="Current password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        show={showCurrent}
                        setShow={setShowCurrent}
                    />

                    <PasswordInput
                        label="New password"
                        value={newPassword}
                        onChange={setNewPassword}
                        show={showNew}
                        setShow={setShowNew}
                    />

                    <PasswordInput
                        label="Confirm new password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirm}
                        setShow={setShowConfirm}
                    />

                    {message && (
                        <p className="text-sm text-center text-red-500">{message}</p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white"
                        >
                            {loading ? "Updating..." : "Update password"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
