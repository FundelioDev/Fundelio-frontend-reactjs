import React, { useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import UpdateProfile from "@/components/admin/users/UpdateProfile";
import UpdateEmail from "@/components/admin/users/UpdateEmail";
import UpdatePassword from "@/components/admin/users/UpdatePassword";

export default function UserProfilePage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-slate-950 dark:to-blue-950">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-500/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 dark:bg-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      </div>

      <div className="relative z-20 pt-30 px-4 pb-20 mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-neutral-700">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-text-primary dark:text-white transition-colors duration-500">
            Thông tin cá nhân
          </h1>
          <p className="mt-2 text-base text-muted-foreground dark:text-gray-300 transition-colors duration-500">
            Quản lý thông tin cá nhân và bảo mật tài khoản dễ dàng
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { key: "profile", label: "Hồ sơ", icon: User },
              { key: "email", label: "Email", icon: Mail },
              { key: "password", label: "Mật khẩu", icon: Shield },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300
                  ${active === key
                    ? "bg-neutral-900 text-white dark:bg-neutral-700 dark:text-white"
                    : "bg-gray-100 text-text-primary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="transition-colors duration-500 text-text-primary dark:text-gray-100">
            {active === "profile" && <UpdateProfile />}
            {active === "email" && <UpdateEmail />}
            {active === "password" && <UpdatePassword />}
          </div>
        </div>
      </div>
    </div>
  );
}
