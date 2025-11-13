import React, { useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import UpdateProfile from "@/components/admin/users/UpdateProfile";
import UpdateEmail from "@/components/admin/users/UpdateEmail";
import UpdatePassword from "@/components/admin/users/UpdatePassword";


export default function UserProfilePage() {
    const [active, setActive] = useState("profile");

    return (
        <div className="relative pt-20 mx-auto max-w-6xl px-4 pb-20">
        <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white">
            <User className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary dark:text-white">
            Personal Information
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
            Manage your personal information and account security easily
            </p>
        </div>

        <div className="mx-auto mt-4 max-w-3xl">
            <div className="grid grid-cols-3 gap-2 mb-6">
            {[
                { key: "profile", label: "Profile", icon: User },
                { key: "email", label: "Email", icon: Mail },
                { key: "password", label: "Password", icon: Shield },
            ].map(({ key, label, icon: Icon }) => (
                <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active === key
                    ? "bg-neutral-900 text-white dark:bg-neutral-800"
                    : "bg-gray-100 text-text-primary hover:bg-gray-200 dark:bg-darker-2 dark:text-white/80 dark:hover:bg-darker"
                }`}
                >
                <Icon className="h-4 w-4" />
                {label}
                </button>
            ))}
            </div>

            {active === "profile" && <UpdateProfile />}
            {active === "email" && <UpdateEmail />}
            {active === "password" && <UpdatePassword />}
            {active === "verify" && <VerifyEmail />}
        </div>
    </div>
    );
}