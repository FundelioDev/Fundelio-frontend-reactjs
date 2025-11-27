"use client";
import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import { storageApi } from "@/api/storageApi";
import { userApi } from "@/api/userApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function UpdateProfile() {
  const { user, fetchUserData } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [biography, setBiography] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(
    () => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
    []
  );

  const cityOptions = useMemo(() => {
    if (!country) return [];
    return City.getCitiesOfCountry(country.value).map((ci) => ({
      value: ci.name,
      label: ci.name,
    }));
  }, [country]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setNickname(user.nickname ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setBiography(user.biography ?? "");
      setAvatarUrl(user.avatarUrl ?? "");

      if (user.nationality) {
        const foundCountry = Country.getAllCountries().find((c) => c.name === user.nationality);
        if (foundCountry) setCountry({ value: foundCountry.isoCode, label: foundCountry.name });
        else setCountry(null);
      } else {
        setCountry(null);
      }

      if (user.city) setCity({ value: user.city, label: user.city });
      else setCity(null);
    }
  }, [user]);
  const extractCampaignName = (description) => {
    if (!description) return '';
    const match = description.match(/:\s*(.*?)\s*\| Tổng pledge/);
    return match ? match[1] : '';
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Vui lòng nhập họ và tên.");
      return;
    }

    try {
      setLoading(true);

      let avatarLink = undefined;
      if (avatarFile) {
        try {
          const uploadRes = await storageApi.uploadSingleFile(avatarFile, "users/avatars");
          avatarLink =
            uploadRes?.data?.url ||
            uploadRes?.data?.data?.url ||
            uploadRes?.data?.fileUrl ||
            uploadRes?.data?.data?.fileUrl;

          if (!avatarLink || !/^https?:\/\//.test(avatarLink)) {
            avatarLink = undefined;
          }
        } catch {
          toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        nickname: nickname.trim() || undefined,
        biography: biography.trim() || undefined,
        city: city?.label || undefined,
        nationality: country?.label || undefined,
      };
      if (avatarLink) payload.avatarUrl = avatarLink;

      const res = await userApi.updateProfile(payload);
      toast.success(res?.data?.message || "Cập nhật thành công!");
      setAvatarFile(null);
      await fetchUserData();
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      const singleMessage = err?.response?.data?.message;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          if (err.message) toast.error(err.message, { icon: "⚠️" });
        });
      } else if (singleMessage) {
        toast.error(singleMessage);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom styles cho react-select dark mode
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#d1d5db" : "#000",
      borderColor: state.isFocused
        ? "#6366f1"
        : document.documentElement.classList.contains("dark")
          ? "#374151"
          : "#d1d5db",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#d1d5db" : "#000",
      zIndex: 50,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: document.documentElement.classList.contains("dark") ? "#d1d5db" : "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280",
    }),
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white dark:bg-darker rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-28 w-28 rounded-full border border-gray-200 shadow-sm object-cover"
            />
          ) : (
            <div className="h-28 w-28 rounded-full border border-gray-200 shadow-sm bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 12c2.5 0 4-1.5 4-4s-1.5-4-4-4-4 1.5-4 4 1.5 4 4 4zM6 20c0-3 3-5 6-5s6 2 6 5"
                />
              </svg>
            </div>
          )}
          <label
            title="Change"
            className="absolute left-1/2 -translate-x-1/2 -bottom-10 inline-flex items-center justify-center px-3 py-1 text-sm rounded-md bg-white dark:bg-gray-800 text-primary border border-transparent shadow-sm opacity-95 cursor-pointer
                      transform transition-all duration-150 hover:-translate-y-1 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"
          >
            Change
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tiểu sử</label>
        <textarea
          rows={3}
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker dark:text-gray-200"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker dark:text-gray-200"
            placeholder="Họ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker dark:text-gray-200"
            placeholder="Tên"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nickname</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker dark:text-gray-200"
            placeholder="Nickname"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            value={phoneNumber}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 dark:bg-darker text-gray-500 dark:text-gray-200"
            placeholder="Số điện thoại"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quốc tịch</label>
          <Select
            classNamePrefix="rs"
            options={countryOptions}
            value={country}
            onChange={(opt) => {
              setCountry(opt);
              setCity(null);
            }}
            placeholder="Chọn quốc gia"
            styles={customSelectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thành phố</label>
          <Select
            classNamePrefix="rs"
            options={cityOptions}
            value={city}
            onChange={setCity}
            isDisabled={!country}
            placeholder={country ? "Chọn thành phố" : "Chọn quốc gia trước"}
            styles={customSelectStyles}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 hover:shadow-lg transition-shadow"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </button>
      </div>
    </form>
  );
}
