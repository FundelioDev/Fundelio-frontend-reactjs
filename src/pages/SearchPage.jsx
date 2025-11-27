import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { campaignApi } from '@/api/campaignApi';
import { useCategories } from '@/hooks/useCategories';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const { categories } = useCategories();

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
    const isInitialMount = useRef(true);
    const isInitializedFromUrl = useRef(false);
    const isUpdatingFromUrl = useRef(false);

    // UI state
    const defaultFilterState = {
        selectedCategories: [],
        priceRange: { min: '', max: '' },
        campaignStatus: 'all',
        sortBy: 'newest',
    };
    const [pendingFilters, setPendingFilters] = useState(defaultFilterState);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // Infinite scroll observer
    const observerTarget = useRef(null);

    // Initialize filters from URL params and fetch immediately
    useEffect(() => {
        console.log('[SearchPage] Initializing from URL params:', {
            category: searchParams.get('category'),
            status: searchParams.get('status'),
            sort: searchParams.get('sort'),
            q: searchParams.get('q'),
        });

        // Mark that we're updating from URL to prevent filter change effect from fetching
        isUpdatingFromUrl.current = true;

        const categoryParam = searchParams.get('category');
        const statusParam = searchParams.get('status');
        const sortParam = searchParams.get('sort');
        const queryParam = searchParams.get('q');

        const initialCategories = categoryParam ? categoryParam.split(',') : [];
        const initialStatus = statusParam || 'all';
        const initialSort = sortParam || 'newest';

        console.log('[SearchPage] Setting state from URL:', {
            initialCategories,
            initialStatus,
            initialSort,
        });

        setSelectedCategories(initialCategories);
        setCampaignStatus(initialStatus);
        setSortBy(initialSort);

        if (queryParam) {
            setSearchQuery(queryParam);
        }

        setPendingFilters({
            selectedCategories: initialCategories,
            priceRange: { min: '', max: '' },
            campaignStatus: initialStatus,
            sortBy: initialSort,
        });

        // Fetch immediately with URL params to avoid double fetch
        // Use a separate async function to avoid dependency issues
        const fetchFromUrl = async () => {
            setPage(0);
            await fetchCampaigns(0, true, {
                categories: initialCategories,
                status: initialStatus,
                sortBy: initialSort,
                priceRange: { min: '', max: '' },
                searchQuery: queryParam || '',
            });
            // Reset flag after fetch completes
            isUpdatingFromUrl.current = false;
        };

        fetchFromUrl();

        // Mark as initialized after first run
        isInitializedFromUrl.current = true;
        // Mark initial mount as done (to prevent double fetch from filter change effect)
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Build Spring Filter query - can accept params or use state
    const buildSpringFilter = useCallback((params = null) => {
        const filters = [];
        const categories = params?.categories ?? selectedCategories;
        const status = params?.status ?? campaignStatus;
        const price = params?.priceRange ?? priceRange;
        const query = params?.searchQuery ?? searchQuery;

        // Category filter: campaignCategory in ['FILM','ART']
        if (categories.length > 0) {
            const categoryList = categories.map(cat => `'${cat}'`).join(',');
            filters.push(`campaignCategory in [${categoryList}]`);
        }

        // Status filter - Default to ACTIVE and SUCCESSFUL if status is 'all'
        if (status === 'active') {
            filters.push(`campaignStatus: 'ACTIVE'`);
        } else if (status === 'upcoming') {
            filters.push(`campaignStatus: 'UPCOMING'`);
        } else if (status === 'ended') {
            filters.push(`campaignStatus: 'ENDED'`);
        } else if (status === 'all') {
            // Default: only show ACTIVE and SUCCESSFUL campaigns
            filters.push(`campaignStatus in ['ACTIVE','SUCCESSFUL']`);
        }

        // Price range (fundingGoal)
        if (price?.min) {
            filters.push(`goalAmount >= ${price.min}`);
        }
        if (price?.max) {
            filters.push(`goalAmount <= ${price.max}`);
        }

        // Search query (title or description contains)
        if (query?.trim()) {
            filters.push(`(title ~~ '*${query}*' or description ~~ '*${query}*')`);
        }

        return filters.length > 0 ? filters.join(' and ') : null;
    }, [selectedCategories, campaignStatus, priceRange, searchQuery]);

    // Fetch campaigns - can accept filter params or use state
    const fetchCampaigns = useCallback(async (pageNum = 0, reset = false, filterParams = null) => {
        try {
            const categories = filterParams?.categories ?? selectedCategories;
            const status = filterParams?.status ?? campaignStatus;
            const sort = filterParams?.sortBy ?? sortBy;
            const price = filterParams?.priceRange ?? priceRange;
            const query = filterParams?.searchQuery ?? searchQuery;

            console.log('[SearchPage] fetchCampaigns called:', {
                pageNum,
                reset,
                categories,
                status,
                sort,
                price,
                query,
                isInitializedFromUrl: isInitializedFromUrl.current,
                usingFilterParams: !!filterParams,
            });

            setLoading(true);
            const filter = buildSpringFilter(filterParams ? {
                categories,
                status,
                priceRange: price,
                searchQuery: query,
            } : null);

            console.log('[SearchPage] Built filter:', filter);

            const params = {
                page: pageNum,
                size: 20,
                ...(filter && { filter }),
            };

            // Map sort to backend fields
            let sortParam = null;
            if (sort === 'newest') {
                sortParam = 'createdAt,desc';
            } else if (sort === 'most_funded') {
                sortParam = 'pledgedAmount,desc';
            } else if (sort === 'backersCount') {
                sortParam = ['backersCount,desc', 'pledgedAmount,desc'];
            } else if (sort === 'ending_soon') {
                sortParam = 'endDate,asc';
            } else if (sort === 'startDate_desc') {
                sortParam = 'startDate,desc';
            } else if (sort === 'needs_support' || sort === 'startDate_asc') {
                sortParam = ['backersCount,asc', 'startDate,asc'];
            }

            if (sortParam) {
                params.sort = sortParam;
            }

            console.log('[SearchPage] API params:', params);

            const response = await campaignApi.getAllCampaigns(params);
            const newCampaigns = response.data?.data?.content || [];
            const total = response.data?.data?.meta?.totalElements || 0;
            const totalPages = response.data?.data?.totalPages || 0;

            console.log('[SearchPage] API response:', {
                campaignsCount: newCampaigns.length,
                total,
                totalPages,
            });

            if (reset) {
                setCampaigns(newCampaigns);
            } else {
                setCampaigns(prev => [...prev, ...newCampaigns]);
            }

            setHasMore(pageNum < totalPages - 1);
            setTotalResults(total);
        } catch (error) {
            console.error('[SearchPage] Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, [buildSpringFilter, sortBy, selectedCategories, campaignStatus, searchQuery, priceRange]);

    // Fetch on filter/sort change (only when user changes filters via UI, not from URL)
    useEffect(() => {
        // Skip if not initialized from URL yet (initial fetch is handled in URL effect)
        if (!isInitializedFromUrl.current) {
            console.log('[SearchPage] Skipping fetch - not initialized from URL yet');
            return;
        }

        // Skip if this is the initial mount (URL effect already handled it)
        if (isInitialMount.current) {
            console.log('[SearchPage] Skipping fetch - initial mount already handled by URL effect');
            return;
        }

        // Skip if we're currently updating from URL (to prevent double fetch)
        if (isUpdatingFromUrl.current) {
            console.log('[SearchPage] Skipping fetch - currently updating from URL');
            return;
        }

        console.log('[SearchPage] Filter changed via UI, fetching campaigns:', {
            selectedCategories,
            campaignStatus,
            priceRange,
            sortBy,
            searchQuery,
        });

        setPage(0);
        fetchCampaigns(0, true);
    }, [selectedCategories, campaignStatus, priceRange, sortBy, searchQuery, fetchCampaigns]);

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
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

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
        setSelectedCategories(defaultFilterState.selectedCategories);
        setPriceRange(defaultFilterState.priceRange);
        setCampaignStatus(defaultFilterState.campaignStatus);
        setSortBy(defaultFilterState.sortBy);
        setSearchQuery('');
        setPendingFilters(defaultFilterState);
    };

    const handleOpenFilters = () => {
        setPendingFilters({
            selectedCategories,
            priceRange,
            campaignStatus,
            sortBy,
        });
        setIsFilterPanelOpen(true);
    };

    const handleApplyFilters = () => {
        setSelectedCategories(pendingFilters.selectedCategories);
        setPriceRange(pendingFilters.priceRange);
        setCampaignStatus(pendingFilters.campaignStatus);
        setSortBy(pendingFilters.sortBy);
        setIsFilterPanelOpen(false);
    };

    const handlePendingReset = () => {
        setPendingFilters(defaultFilterState);
    };

    // Active filter count
    const activeFilterCount =
        selectedCategories.length +
        (priceRange.min || priceRange.max ? 1 : 0) +
        (campaignStatus !== 'all' ? 1 : 0) +
        (searchQuery ? 1 : 0);

    const pendingFilterCount =
        pendingFilters.selectedCategories.length +
        (pendingFilters.priceRange.min || pendingFilters.priceRange.max ? 1 : 0) +
        (pendingFilters.campaignStatus !== 'all' ? 1 : 0) +
        (pendingFilters.sortBy !== 'newest' ? 1 : 0);

    console.log('campaigns', campaigns)
    return (
        <main className="min-h-screen bg-background-light-2 dark:bg-darker text-white transition-colors">
            {/* Search Header */}
            <header className="bg-transparent border-b border-white/10 dark:border-white/5">
                <div className="max-w-container mx-auto px-4 lg:px-6 py-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chiến dịch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                        />
                    </div>

                    {/* Results count & filter toggle */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            {loading ? 'Đang tìm kiếm...' : `${totalResults} kết quả`}
                        </p>

                        <button
                            onClick={handleOpenFilters}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-white/10 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-text-primary dark:text-white" />
                            <span className="text-sm font-medium text-text-primary dark:text-white">Bộ lọc</span>
                            {activeFilterCount > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-black text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-container mx-auto px-4 lg:px-6 py-8">
                {/* Results */}
                <section className="min-w-0">
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
                                    <LoadingSpinner label="Đang tải thêm chiến dịch..." />
                                </div>
                            )}

                            {!hasMore && campaigns.length > 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    Đã hiển thị tất cả {totalResults} kết quả
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Không tìm thấy chiến dịch
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="px-6 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Filter Overlay */}
            {isFilterPanelOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsFilterPanelOpen(false)}
                        aria-hidden="true"
                    />
                    <aside className="w-full max-w-md h-full sm:h-auto sm:max-h-screen bg-[#0c111b] text-white dark:bg-darker shadow-2xl overflow-y-auto border-l border-white/10">
                        <div className="sticky top-0 bg-[#0c111b] dark:bg-darker border-b border-white/10 px-5 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
                            <button
                                onClick={() => setIsFilterPanelOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Đóng bộ lọc"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <SearchFilters
                                categories={categories}
                                selectedCategories={pendingFilters.selectedCategories}
                                onCategoryChange={(value) => setPendingFilters((prev) => ({ ...prev, selectedCategories: value }))}
                                priceRange={pendingFilters.priceRange}
                                onPriceRangeChange={(value) => setPendingFilters((prev) => ({ ...prev, priceRange: value }))}
                                campaignStatus={pendingFilters.campaignStatus}
                                onStatusChange={(value) => setPendingFilters((prev) => ({ ...prev, campaignStatus: value }))}
                                sortBy={pendingFilters.sortBy}
                                onSortChange={(value) => setPendingFilters((prev) => ({ ...prev, sortBy: value }))}
                                onReset={handlePendingReset}
                                activeFilterCount={pendingFilterCount}
                            />
                        </div>
                        <div className="border-t border-white/10 px-5 py-4 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handlePendingReset}
                                className="w-full py-3 rounded-lg border border-white/15 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Đặt lại
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Áp dụng bộ lọc
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
};

export default SearchPage;
