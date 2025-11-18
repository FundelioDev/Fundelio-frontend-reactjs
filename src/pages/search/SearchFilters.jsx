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
    const handleCategoryToggle = (categoryId) => {
        const idString = String(categoryId);
        if (selectedCategories.includes(idString)) {
            onCategoryChange(selectedCategories.filter(id => id !== idString));
        } else {
            onCategoryChange([...selectedCategories, idString]);
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
        { value: 'ending_soon', label: 'Sắp kết thúc' },
    ];

    return (
        <div className="space-y-6">
            {/* Header with reset */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">Bộ lọc</h3>
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
                <h4 className="text-sm font-semibold text-text">Sắp xếp theo</h4>
                <div className="space-y-2">
                    {sortOptions.map(option => (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value={option.value}
                                checked={sortBy === option.value}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-sm text-text group-hover:text-primary transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-border" />

            {/* Categories */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text">Danh mục</h4>
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
                    {categories.map(category => {
                        const isSelected = selectedCategories.includes(String(category.categoryId));
                        return (
                            <label
                                key={category.categoryId}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleCategoryToggle(category.categoryId)}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-sm text-text group-hover:text-primary transition-colors flex-1">
                                    {category.categoryName}
                                </span>
                                {isSelected && (
                                    <span className="text-xs font-medium text-primary">
                                        ✓
                                    </span>
                                )}
                            </label>
                        );
                    })}
                </div>
            </div>

            <hr className="border-border" />

            {/* Price Range */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-text">Mục tiêu gây quỹ</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-text-secondary mb-1.5">
                            Từ (VND)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1.5">
                            Đến (VND)
                        </label>
                        <input
                            type="number"
                            placeholder="∞"
                            value={priceRange.max}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
                {/* Quick price filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onPriceRangeChange({ min: '', max: '1000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                        &lt; 1M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '1000000', max: '10000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                        1M - 10M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '10000000', max: '100000000' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                        10M - 100M
                    </button>
                    <button
                        onClick={() => onPriceRangeChange({ min: '100000000', max: '' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                        &gt; 100M
                    </button>
                </div>
            </div>

            <hr className="border-border" />

            {/* Campaign Status */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-text">Trạng thái</h4>
                <div className="space-y-2">
                    {statusOptions.map(option => (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="status"
                                value={option.value}
                                checked={campaignStatus === option.value}
                                onChange={(e) => onStatusChange(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-sm text-text group-hover:text-primary transition-colors">
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
