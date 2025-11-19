import React, { useState, useEffect } from 'react';
import { pledgeApi } from '@/api/pledgeApi';
import toast from 'react-hot-toast';
import PledgeList from './components/PledgeList';
import PledgeFilters from './components/PledgeFilters';
import PledgeDetailModal from './components/PledgeDetailModal';

export default function MyPledgesPage() {
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPledge, setSelectedPledge] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination & Filtering
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchPledges();
    }, [currentPage, pageSize, filter]);

    const fetchPledges = async () => {
        try {
            setLoading(true);

            // Build query params for Spring Filter
            const params = {
                page: currentPage,
                size: pageSize,
            };

            if (filter) {
                params.filter = filter;
            }

            const response = await pledgeApi.getMyPledges(params);
            console.log('Pledges response:', response);
            if (response?.data?.success) {
                setPledges(response.data.data.content || []);
                // If API returns pagination info
                if (response.data.totalPages !== undefined) {
                    setTotalPages(response.data.totalPages);
                }
            } else {
                setPledges([]);
                toast.error('Không thể tải danh sách cam kết');
            }
        } catch (error) {
            console.error('Error fetching pledges:', error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(0); // Reset to first page
    };

    const handleShowDetail = (pledge) => {
        setSelectedPledge(pledge);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedPledge(null);
    };

    return (
        <main className="min-h-screen bg-background-light-2 dark:bg-darker pb-8 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-white mb-2">
                        Các chiến dịch tôi đã ủng hộ
                    </h1>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các cam kết ủng hộ của bạn
                    </p>
                </header>

                {/* Filters */}
                <PledgeFilters
                    onFilterChange={handleFilterChange}
                    currentFilter={filter}
                />

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Đang tải...</p>
                        </div>
                    </div>
                ) : pledges.length === 0 ? (
                    <div className="bg-white dark:bg-darker-2 rounded-sm shadow-card p-12 text-center">
                        <p className="text-muted-foreground text-lg">
                            Bạn chưa ủng hộ chiến dịch nào
                        </p>
                    </div>
                ) : (
                    <>
                        <PledgeList
                            pledges={pledges}
                            onShowDetail={handleShowDetail}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-text-primary dark:text-white bg-white dark:bg-darker-2 border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                >
                                    Trước
                                </button>

                                <span className="px-4 py-2 text-sm text-muted-foreground">
                                    Trang {currentPage + 1} / {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-text-primary dark:text-white bg-white dark:bg-darker-2 border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                >
                                    Sau
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedPledge && (
                <PledgeDetailModal
                    pledge={selectedPledge}
                    onClose={handleCloseDetail}
                />
            )}
        </main>
    );
}
