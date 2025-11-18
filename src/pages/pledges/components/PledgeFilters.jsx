import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

export default function PledgeFilters({ onFilterChange, currentFilter }) {
    const [showFilters, setShowFilters] = useState(false);
    const [tempFilter, setTempFilter] = useState(currentFilter);

    const handleApply = () => {
        onFilterChange(tempFilter);
        setShowFilters(false);
    };

    const handleClear = () => {
        setTempFilter('');
        onFilterChange('');
    };

    // Predefined filter templates for Spring Filter
    const filterTemplates = [
        { label: 'Tất cả', value: '' },
        { label: 'Chiến dịch đang hoạt động', value: "campaign.campaignStatus:'ACTIVE'" },
        { label: 'Chiến dịch đã kết thúc', value: "campaign.campaignStatus:'END'" },
        { label: 'Cam kết > 500K', value: 'totalAmount>500000' },
        { label: 'Cam kết > 1M', value: 'totalAmount>1000000' },
    ];

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary dark:text-white bg-white dark:bg-darker-2 border border-border rounded-sm hover:bg-muted transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </button>

                {currentFilter && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-sm hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="bg-white dark:bg-darker-2 rounded-sm shadow-card p-4 border border-border">
                    {/* Quick Filters */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-text-primary dark:text-white mb-3">
                            Bộ lọc nhanh
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {filterTemplates.map((template, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setTempFilter(template.value)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${tempFilter === template.value
                                            ? 'bg-primary text-white'
                                            : 'bg-muted text-text-primary dark:text-white hover:bg-muted/80'
                                        }`}
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Filter Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                            Bộ lọc tùy chỉnh (Spring Filter)
                        </label>
                        <input
                            type="text"
                            value={tempFilter}
                            onChange={(e) => setTempFilter(e.target.value)}
                            placeholder="Ví dụ: totalAmount>100000 and campaign.campaignStatus:'ACTIVE'"
                            className="w-full px-3 py-2 text-sm text-text-primary dark:text-white bg-background dark:bg-darker border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Tham khảo{' '}
                            <a
                                href="https://github.com/turkraft/springfilter"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Spring Filter syntax
                            </a>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setShowFilters(false)}
                            className="px-4 py-2 text-sm font-medium text-text-primary dark:text-white bg-muted hover:bg-muted/80 rounded-sm transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-sm transition-colors"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
