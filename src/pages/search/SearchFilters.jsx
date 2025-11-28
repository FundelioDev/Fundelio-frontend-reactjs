import React from 'react';
import { X, RotateCcw } from 'lucide-react';

/**
 * SearchFilters - Filter sidebar component
 */
const SearchFilters = ({
    categories = [],
    selectedCategories = [],
    onCategoryChange,
    priceRange = { min: '', max: '' },
    onPriceRangeChange,
    campaignStatus = 'all',
    onStatusChange,
    sortBy = 'newest',
    onSortChange,
    onReset,
    activeFilterCount = 0,
}) => {
    // Toggle category selection
    const handleCategoryToggle = (categoryValue) => {
        const valueString = String(categoryValue);
        if (selectedCategories.includes(valueString)) {
            onCategoryChange(selectedCategories.filter(val => val !== valueString));
        } else {
            onCategoryChange([...selectedCategories, valueString]);
        }
    };

    // Clear all categories
    const handleClearCategories = () => {
        onCategoryChange([]);
    };

    // Status options
    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'upcoming', label: 'Sắp diễn ra' },
        { value: 'ended', label: 'Đã kết thúc' },
    ];

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'most_funded', label: 'Nhiều hỗ trợ nhất' },
        { value: 'backersCount', label: 'Nhiều người ủng hộ nhất' },
        { value: 'ending_soon', label: 'Sắp kết thúc' },
        { value: 'startDate_desc', label: 'Mới ra mắt' },
        { value: 'needs_support', label: 'Cần tiếp sức' },
    ];

    return (
        <div className="space-y-6 text-white">
            {/* Header with reset */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bộ lọc</h3>
                {activeFilterCount > 0 && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Đặt lại</span>
                    </button>
                )}
            </div>

            {/* Sort */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold">Sắp xếp theo</h4>
                <div className="space-y-2">
                    {sortOptions.map(option => (
                        <label
                            key={option.value}
                            className="flex items-center gap-1.5 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value={option.value}
                                checked={sortBy === option.value}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Categories */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Danh mục</h4>
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={handleClearCategories}
                            className="text-xs text-primary hover:underline"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-primary">
                    {!categories || categories.length === 0 ? (
                        <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                            Đang tải danh mục...
                        </div>
                    ) : (
                        categories.map(category => {
                            // Use category key (e.g., 'FILM', 'ART') for filtering - this is what backend expects
                            // category.key is the enum value like 'FILM', 'ART', etc.
                            // category.id might be the database ID, but we use key for filtering
                            const categoryValue = category.key || category.id;
                            const isSelected = selectedCategories.includes(String(categoryValue));
                            return (
                                <label
                                    key={category.id || category.key}
                                    className="flex items-center gap-1.5 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleCategoryToggle(categoryValue)}
                                        className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-sm group-hover:text-primary transition-colors flex-1">
                                        {category.name}
                                    </span>
                                    {isSelected && (
                                        <span className="text-xs font-medium text-primary">
                                            ✓
                                        </span>
                                    )}
                                </label>
                            );
                        }))}
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Price Range */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold">Mục tiêu gây quỹ</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1.5">
                            Từ (VND)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1.5">
                            Đến (VND)
                        </label>
                        <input
                            type="number"
                            placeholder="∞"
                            value={priceRange.max}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
                {/* Quick price filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onPriceRangeChange({ min: '', max: '1000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15 hover:border-primary hover:text-primary transition-colors"
                    >
                        &lt; 1M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '1000000', max: '10000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15 hover:border-primary hover:text-primary transition-colors"
                    >
                        1M - 10M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '10000000', max: '100000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15 hover:border-primary hover:text-primary transition-colors"
                    >
                        10M - 100M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '100000000', max: '' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15 hover:border-primary hover:text-primary transition-colors"
                    >
                        &gt; 100M
                    </button>
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Campaign Status */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold">Trạng thái</h4>
                <div className="space-y-2">
                    {statusOptions.map(option => (
                        <label
                            key={option.value}
                            className="flex items-center gap-1.5 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="status"
                                value={option.value}
                                checked={campaignStatus === option.value}
                                onChange={(e) => onStatusChange(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
