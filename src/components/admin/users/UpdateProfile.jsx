"use client";
import React, { useState, useMemo } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import { userApi } from "@/api/userApi";
import { storageApi } from "@/api/storageApi"; // ✅ Thêm dòng này

export default function UpdateProfile() {
  const [firstName, setFirstName] = useState("THUAN");
  const [lastName, setLastName] = useState("QUACH");
  const [nickname, setNickname] = useState("thuanflu");
  const [phone, setPhone] = useState("0901234567");
  const [biography, setBiography] = useState("Tôi là Software Engineer");
  const [avatarUrl, setAvatarUrl] = useState("https://test.png");
  const [avatarFile, setAvatarFile] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(
    () => Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name })),
    []
  );

  const cityOptions = useMemo(() => {
    if (!country) return [];
    return City.getCitiesOfCountry(country.value).map(ci => ({
      value: ci.name,
      label: ci.name
    }));
  }, [country]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      setLoading(true);

      let avatarLink = avatarUrl;

      // sNếu người dùng chọn file mới, upload lên S3
      if (avatarFile) {
        try {
          const uploadRes = await storageApi.uploadSingleFile(avatarFile, "avatars");
          avatarLink = uploadRes?.data?.url || avatarUrl;
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          setMessage("Tải ảnh lên thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        firstName,
        lastName,
        nickname,
        avatarUrl: avatarLink,
        biography,
        city: city?.label,
        nationality: country?.label,
      };

      const res = await userApi.updateProfile(payload);
      setMessage(res?.data?.message || "Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white dark:bg-darker rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center gap-3 mb-6">
        <img
          src={avatarUrl}
          alt="avatar"
          className="h-28 w-28 rounded-full border border-gray-200 shadow-sm object-cover"
        />
        <label className="text-sm text-muted-foreground cursor-pointer">
          Đổi ảnh đại diện
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-darker"
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            value={phone}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
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
          className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </button>
      </div>
    </form>
  );
}
