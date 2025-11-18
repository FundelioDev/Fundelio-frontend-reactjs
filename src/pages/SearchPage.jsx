import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import {campaignApi} from '@/api/campaignApi';
import SearchFilters from './search/SearchFilters';
import SearchResults from './search/SearchResults';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * SearchPage - Main search page with filters and infinite scroll
 * Features:
 * - Multi-select category filter
 * - Price range filter
 * - Campaign status filter
 * - Sort by (newest, most funded, ending soon)
 * - Infinite scroll pagination
 * - Spring Filter backend integration
 */
const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const categories = useSelector(state => state.categories.categories);

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [campaignStatus, setCampaignStatus] = useState('all'); // all, active, upcoming, ended
    const [sortBy, setSortBy] = useState('newest'); // newest, most_funded, ending_soon
    const [searchQuery, setSearchQuery] = useState('');

    // Results state
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    // UI state
    const [showFilters, setShowFilters] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Infinite scroll observer
    const observerTarget = useRef(null);

    // Initialize filters from URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const statusParam = searchParams.get('status');
        const sortParam = searchParams.get('sort');
        const queryParam = searchParams.get('q');

        if (categoryParam) {
            setSelectedCategories(categoryParam.split(','));
        }
        if (statusParam) {
            setCampaignStatus(statusParam);
        }
        if (sortParam) {
            setSortBy(sortParam);
        }
        if (queryParam) {
            setSearchQuery(queryParam);
        }
    }, []);

    // Build Spring Filter query
    const buildSpringFilter = useCallback(() => {
        const filters = [];

        // Category filter: "categoryId in (1, 2, 3)"
        if (selectedCategories.length > 0) {
            filters.push(`categoryId in (${selectedCategories.join(', ')})`);
        }

        // Status filter
        if (campaignStatus === 'active') {
            filters.push(`campaignStatus: 'ACTIVE'`);
        } else if (campaignStatus === 'upcoming') {
            filters.push(`campaignStatus: 'UPCOMING'`);
        } else if (campaignStatus === 'ended') {
            filters.push(`campaignStatus: 'ENDED'`);
        }

        // Price range (fundingGoal)
        if (priceRange.min) {
            filters.push(`fundingGoal >= ${priceRange.min}`);
        }
        if (priceRange.max) {
            filters.push(`fundingGoal <= ${priceRange.max}`);
        }

        // Search query (title or description contains)
        if (searchQuery.trim()) {
            filters.push(`(title ~~ '*${searchQuery}*' or description ~~ '*${searchQuery}*')`);
        }

        return filters.length > 0 ? filters.join(' and ') : null;
    }, [selectedCategories, campaignStatus, priceRange, searchQuery]);

    // Fetch campaigns
    const fetchCampaigns = useCallback(async (pageNum = 0, reset = false) => {
        try {
            setLoading(true);
            const filter = buildSpringFilter();

            const params = {
                page: pageNum,
                size: 20,
                ...(filter && { filter }),
            };

            // Map sort to backend fields
            if (sortBy === 'newest') {
                params.sort = 'createdAt,desc';
            } else if (sortBy === 'most_funded') {
                params.sort = 'currentAmount,desc';
            } else if (sortBy === 'ending_soon') {
                params.sort = 'endDate,asc';
            }

            const response = await campaignApi.getAllCampaigns(params);
            const newCampaigns = response.data?.data?.content || [];
            const total = response.data?.data?.totalElements || 0;
            const totalPages = response.data?.data?.totalPages || 0;

            if (reset) {
                setCampaigns(newCampaigns);
            } else {
                setCampaigns(prev => [...prev, ...newCampaigns]);
            }

            setHasMore(pageNum < totalPages - 1);
            setTotalResults(total);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, [buildSpringFilter, sortBy]);

    // Fetch on filter/sort change
    useEffect(() => {
        setPage(0);
        fetchCampaigns(0, true);
    }, [selectedCategories, campaignStatus, priceRange, sortBy, searchQuery]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchCampaigns(nextPage, false);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page, fetchCampaigns]);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
            params.set('category', selectedCategories.join(','));
        }
        if (campaignStatus !== 'all') {
            params.set('status', campaignStatus);
        }
        if (sortBy !== 'newest') {
            params.set('sort', sortBy);
        }
        if (searchQuery) {
            params.set('q', searchQuery);
        }
        setSearchParams(params, { replace: true });
    }, [selectedCategories, campaignStatus, sortBy, searchQuery]);

    // Reset filters
    const handleResetFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: '', max: '' });
        setCampaignStatus('all');
        setSortBy('newest');
        setSearchQuery('');
    };

    // Active filter count
    const activeFilterCount =
        selectedCategories.length +
        (priceRange.min || priceRange.max ? 1 : 0) +
        (campaignStatus !== 'all' ? 1 : 0) +
        (searchQuery ? 1 : 0);

    return (
        <main className="min-h-screen bg-background">
            {/* Search Header */}
            <header className="bg-white dark:bg-darker border-b border-border">
                <div className="max-w-container mx-auto px-4 lg:px-6 py-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chiến dịch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Results count & filter toggle */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-text-secondary">
                            {loading ? 'Đang tìm kiếm...' : `${totalResults} kết quả`}
                        </p>

                        <div className="flex items-center gap-3">
                            {/* Desktop: Toggle sidebar */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile: Open modal */}
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="text-sm font-medium">Bộ lọc</span>
                                {activeFilterCount > 0 && (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-container mx-auto px-4 lg:px-6 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar (Desktop) */}
                    {showFilters && (
                        <aside className="hidden lg:block w-80 flex-shrink-0">
                            <div className="sticky top-[88px]">
                                <SearchFilters
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    onCategoryChange={setSelectedCategories}
                                    priceRange={priceRange}
                                    onPriceRangeChange={setPriceRange}
                                    campaignStatus={campaignStatus}
                                    onStatusChange={setCampaignStatus}
                                    sortBy={sortBy}
                                    onSortChange={setSortBy}
                                    onReset={handleResetFilters}
                                    activeFilterCount={activeFilterCount}
                                />
                            </div>
                        </aside>
                    )}

                    {/* Results */}
                    <section className="flex-1 min-w-0">
                        {loading && page === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : campaigns.length > 0 ? (
                            <>
                                <SearchResults campaigns={campaigns} />

                                {/* Infinite scroll trigger */}
                                {hasMore && (
                                    <div ref={observerTarget} className="py-8 flex justify-center">
                                        <LoadingSpinner />
                                    </div>
                                )}

                                {!hasMore && campaigns.length > 0 && (
                                    <p className="text-center text-text-secondary py-8">
                                        Đã hiển thị tất cả {totalResults} kết quả
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                                <h3 className="text-xl font-semibold text-text mb-2">
                                    Không tìm thấy chiến dịch
                                </h3>
                                <p className="text-text-secondary mb-6">
                                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                                >
                                    Đặt lại bộ lọc
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
                    <div className="bg-white dark:bg-darker w-full sm:max-w-lg sm:rounded-t-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-darker border-b border-border px-4 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-text">Bộ lọc</h3>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="p-4">
                            <SearchFilters
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryChange={setSelectedCategories}
                                priceRange={priceRange}
                                onPriceRangeChange={setPriceRange}
                                campaignStatus={campaignStatus}
                                onStatusChange={setCampaignStatus}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                onReset={handleResetFilters}
                                activeFilterCount={activeFilterCount}
                            />

                            {/* Apply Button */}
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full mt-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SearchPage;
