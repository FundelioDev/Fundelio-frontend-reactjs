import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import { userApi } from "@/api/userApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/common/Button';

// Helper function to remove Vietnamese diacritics for better search
const removeDiacritics = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

// Custom filter function for better search experience
const customFilter = (option, inputValue) => {
    if (!inputValue) return true;

    const searchValue = removeDiacritics(inputValue.toLowerCase());
    const label = removeDiacritics(option.label.toLowerCase());

    return label.includes(searchValue);
};

export default function LocationModal({ isOpen, onClose, onSuccess }) {
    const { user, fetchUserData } = useAuth();
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

    // Initialize with user's existing data if available
    useEffect(() => {
        if (user) {
            if (user.nationality) {
                const foundCountry = Country.getAllCountries().find((c) => c.name === user.nationality);
                if (foundCountry) setCountry({ value: foundCountry.isoCode, label: foundCountry.name });
            }
            if (user.city) setCity({ value: user.city, label: user.city });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!country || !city) {
            toast.error("Vui lòng chọn cả quốc tịch và thành phố");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                city: city.label,
                nationality: country.label,
            };

            console.log("Updating location:", payload);
            const res = await userApi.updateProfile(payload);
            toast.success(res?.data?.message || "Cập nhật vị trí thành công!");

            // Refresh user data in AuthContext
            try {
                await fetchUserData();
                console.log("User data refreshed after location update");
            } catch (err) {
                console.warn("Could not reload user after update:", err);
            }

            // Call success callback
            if (onSuccess) {
                onSuccess({ city: city.label, nationality: country.label });
            }

            onClose();
        } catch (err) {
            console.error("Location update error:", err?.response?.status, err?.response?.data || err);

            const backendErrors = err?.response?.data?.errors;
            const singleMessage = err?.response?.data?.message;

            if (Array.isArray(backendErrors) && backendErrors.length > 0) {
                backendErrors.forEach((err) => {
                    if (err.message) {
                        toast.error(err.message, { icon: "⚠️" });
                    }
                });
            } else if (singleMessage) {
                toast.error(singleMessage);
            } else {
                toast.error("Cập nhật vị trí thất bại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thông tin vị trí</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                        Vui lòng cung cấp thông tin quốc tịch và thành phố của bạn để hoàn tất cam kết ủng hộ.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Quốc tịch <span className="text-primary">*</span>
                        </label>
                        <Select
                            classNamePrefix="rs"
                            options={countryOptions}
                            value={country}
                            onChange={(opt) => {
                                setCountry(opt);
                                setCity(null);
                            }}
                            isSearchable={true}
                            filterOption={customFilter}
                            placeholder="Chọn quốc gia"
                            unstyled
                            classNames={{
                                control: (state) =>
                                    `border rounded-md px-3 py-2 bg-background border-border hover:border-ring ${state.isFocused ? 'border-ring ring-1 ring-ring' : ''
                                    }`,
                                menu: () => 'z-[9999] mt-1 bg-popover border border-border rounded-md shadow-lg',
                                menuList: () => 'max-h-[200px] overflow-y-auto py-1',
                                option: (state) =>
                                    `px-3 py-2 cursor-pointer ${state.isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : state.isFocused
                                            ? 'bg-accent text-foreground'
                                            : 'text-foreground'
                                    }`,
                                placeholder: () => 'text-muted-foreground',
                                singleValue: () => 'text-foreground',
                                input: () => 'text-foreground',
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Thành phố <span className="text-primary">*</span>
                        </label>
                        <Select
                            classNamePrefix="rs"
                            options={cityOptions}
                            value={city}
                            onChange={setCity}
                            isDisabled={!country}
                            isSearchable={true}
                            filterOption={customFilter}
                            placeholder={country ? "Chọn thành phố" : "Chọn quốc gia trước"}
                            unstyled
                            classNames={{
                                control: (state) =>
                                    `border rounded-md px-3 py-2 bg-background border-border hover:border-ring ${state.isFocused ? 'border-ring ring-1 ring-ring' : ''
                                    } ${state.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`,
                                menu: () => 'z-[9999] mt-1 bg-popover border border-border rounded-md shadow-lg',
                                menuList: () => 'max-h-[200px] overflow-y-auto py-1',
                                option: (state) =>
                                    `px-3 py-2 cursor-pointer ${state.isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : state.isFocused
                                            ? 'bg-accent text-foreground'
                                            : 'text-foreground'
                                    }`,
                                placeholder: () => 'text-muted-foreground',
                                singleValue: () => 'text-foreground',
                                input: () => 'text-foreground',
                            }}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !country || !city}
                            className="flex-1"
                        >
                            {loading ? "Đang lưu..." : "Xác nhận"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
