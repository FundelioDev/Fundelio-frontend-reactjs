"use client";
import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import { storageApi } from "@/api/storageApi";
import { userApi } from "@/api/userApi";
import { useAuth } from "@/contexts/AuthContext"; // (SỬA 1: Import useAuth)

export default function UpdateProfile() {
  const { user, fetchUserData } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [biography, setBiography] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // (SỬA 4: Xóa 'initialLoading' state)

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

  // (SỬA 5: Thay thế useEffect ban đầu)
  // useEffect này sẽ tự động điền dữ liệu vào form
  // khi 'user' từ AuthContext được tải
  useEffect(() => {
    if (user) {
      console.log("Populating form from AuthContext user:", user);
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setNickname(user.nickname ?? "");
      setPhone(user.phone ?? "");
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
  }, [user]); // Phụ thuộc vào 'user' từ context

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!firstName.trim() || !lastName.trim()) {
      setMessage("Vui lòng nhập họ và tên.");
      return;
    }

    try {
      setLoading(true);

      let avatarLink = undefined;
      if (avatarFile) {
        try {
          console.log("Uploading avatar file...");
          const uploadRes = await storageApi.uploadSingleFile(avatarFile, "avatars");
          console.log("Upload response:", uploadRes?.data);
          avatarLink =
            uploadRes?.data?.url ||
            uploadRes?.data?.data?.url ||
            uploadRes?.data?.fileUrl ||
            uploadRes?.data?.data?.fileUrl;
          if (!avatarLink || !/^https?:\/\//.test(avatarLink)) {
            console.warn("Upload did not return http URL, ignoring avatarUrl.");
            avatarLink = undefined;
          }
        } catch (uploadErr) {
          // ... (xử lý lỗi upload)
          setMessage("Tải ảnh lên thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickname: nickname.trim() || undefined,
        biography: biography.trim() || undefined,
        city: city?.label || undefined,
        nationality: country?.label || undefined,
      };
      if (avatarLink) payload.avatarUrl = avatarLink;

      console.log("Sending update-profile payload:", JSON.stringify(payload, null, 2));
      const res = await userApi.updateProfile(payload);
      console.log("Update response:", res?.status, res?.data);
      setMessage(res?.data?.message || "Cập nhật thành công!");
      setAvatarFile(null);

      // (SỬA 6: Thay vì gọi userApi.getMe(), gọi hàm của context)
      try {
        await fetchUserData();
        console.log("AuthContext user re-fetched!");
      } catch (err) {
        console.warn("Could not reload user after update:", err);
      }
    } catch (err) {
      console.error("Update error:", err?.response?.status, err?.response?.data || err);
      const errMsg = err?.response?.data?.message || "Cập nhật thất bại!";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // (SỬA 7: Xóa toàn bộ khối 'if (initialLoading)')

  // Tất cả JSX (return) giữ nguyên như code bạn đã sửa ở trên
  // (sử dụng state local 'firstName', 'lastName', 'avatarUrl'...)
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
            <div className="h-28 w-28 rounded-full border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.5 0 4-1.5 4-4s-1.5-4-4-4-4 1.5-4 4 1.5 4 4 4zM6 20c0-3 3-5 6-5s6 2 6 5" />
              </svg>
            </div>
          )}
          <label
            title="Change"
            className="absolute left-1/2 -translate-x-1/2 -bottom-10 inline-flex items-center justify-center px-3 py-1 text-sm rounded-md bg-white text-primary border border-transparent shadow-sm opacity-95 cursor-pointer
                      transform transition-all duration-150 hover:-translate-y-1 hover:shadow-md hover:border-gray-200"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker"
            placeholder="Họ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker"
            placeholder="Nickname"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            value={phone}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
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
            styles={{ menu: (p) => ({ ...p, zIndex: 50 }) }}
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
            styles={{ menu: (p) => ({ ...p, zIndex: 50 }) }}
          />
        </div>
      </div>

      {message && (
        <p className="text-sm text-center text-red-500 mb-4 whitespace-pre-wrap">{message}</p>
      )}

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