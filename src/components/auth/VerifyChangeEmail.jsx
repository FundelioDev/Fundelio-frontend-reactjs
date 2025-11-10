"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userApi } from "@/api/userApi";

export default function VerifyChangeEmailPage() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setStatus("loading");
        const res = await userApi.verifyChangeEmail(token); // truyền string
        const ok = res?.data?.success ?? true;
        setMessage(res?.data?.message || "Xác thực thành công.");
        if (ok) {
          setStatus("success");
          setTimeout(() => router.replace("/login"), 1000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message || err?.message || "Xác thực thất bại.";
        setMessage(msg);
        setStatus("error");
      }
    })();
  }, [token, router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Verify Email Change</h1>

        {status === "loading" ? (
          <p className="text-sm text-muted-foreground">Đang xác thực… Vui lòng chờ.</p>
        ) : (
          <p className={status === "success" ? "text-emerald-600" : "text-red-500"}>
            {message}
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={() => router.replace("/login")}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-neutral-800"
          >
            Về trang đăng nhập
          </button>
        </div>
      </div>
    </main>
  );
}
