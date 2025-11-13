// src/components/admin/users/UpdateEmail.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

import { VerifyEmailDialog } from "@/components/auth/VerifyEmailDialog";
import { AuthErrorDialog } from "@/components/auth/AuthErrorDialog";
import { userApi } from "@/api/userApi";


export default function UpdateEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ newEmail: "" });

  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!form.newEmail) {
      setErrors((prev) => ({ ...prev, newEmail: "Vui lòng nhập email mới" }));
      return;
    }

    setIsLoading(true);

    try {
      const res = await userApi.updateEmail({ newEmail: form.newEmail });
      setMessage(res?.data?.message || "Yêu cầu đổi email đã được gửi.");

      setShowVerifyEmailDialog(true);
    } catch (error) {
      const backendErrors = error?.errors;
      const fallbackMessage =
        error?.response?.data?.message ||
        (Array.isArray(backendErrors) && backendErrors[0]?.message) ||
        "Đổi email thất bại. Vui lòng thử lại.";

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const combined = backendErrors.map((e) => e?.message).filter(Boolean).join("\n");
        const finalMsg = combined || fallbackMessage;
        setErrors({ general: finalMsg });
        setErrorDialogMessage(finalMsg);
        setShowErrorDialog(true);
      } else {
        setErrors({ general: fallbackMessage });
        setErrorDialogMessage(fallbackMessage);
        setShowErrorDialog(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full mx-auto backdrop-blur-sm bg-transparent border-none shadow-none">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">
            Đổi email
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Nhập email mới. Bạn sẽ cần xác thực qua email.
          </p>
        </CardHeader>

        <CardContent className="px-2 md:px-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail" className="text-sm md:text-base font-medium">
                Email mới
              </Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                placeholder="name@example.com"
                value={form.newEmail}
                onChange={handleChange}
                className={`h-11 px-4 rounded-xl ${
                  errors.newEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.newEmail && (
                <p className="text-xs md:text-sm text-red-500">{errors.newEmail}</p>
              )}
            </div>

            {message && !errors.general && (
              <p className="text-sm text-emerald-600 dark:text-emerald-500">{message}</p>
            )}
            {errors.general && (
              <p className="text-sm text-red-500 whitespace-pre-wrap">{errors.general}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi yêu cầu đổi email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <VerifyEmailDialog
        open={showVerifyEmailDialog}
        onOpenChange={setShowVerifyEmailDialog}
        email={form.newEmail}
      />

      <AuthErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="Đổi email thất bại"
        message={errorDialogMessage}
      />
    </motion.div>
  );
}
