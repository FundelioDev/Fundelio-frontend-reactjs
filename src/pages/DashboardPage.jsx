import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import CampaignDashboardItem from '@/components/campaign/dashboard/CampaignDashboardItem';
import { useAuth } from '@/contexts/AuthContext';
import { campaignApi } from '@/api/campaignApi';
import toast from 'react-hot-toast';

/**
 * Status color mapping - gray only for DRAFT
 */
const getStatusColor = (status) => {
    const colors = {
        DRAFT: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700',
        APPROVED: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700',
        REJECTED: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700',
        ACTIVE: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700',
        SUCCESSFUL: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
        FAILED: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700',
        ENDED: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700',
    };
    return colors[status] || colors.DRAFT;
};

/**
 * DashboardPage - User's dashboard showing their campaigns
 */
export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [campaignStatuses, setCampaignStatuses] = useState({});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 9,
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false,
    });

    // Fetch campaign statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await campaignApi.getAllCampaignStatus();
                if (response?.data?.data) {
                    setCampaignStatuses(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching campaign statuses:', error);
            }
        };

        fetchStatuses();
    }, []);

    // Fetch campaigns
    useEffect(() => {
        const fetchCampaigns = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await campaignApi.getUserCampaigns(user.userId, {
                    page: pagination.currentPage,
                    size: pagination.pageSize,
                    sort: 'createdAt,desc',
                });

                if (response?.data?.data) {
                    const { content, meta } = response.data.data;
                    setCampaigns(content);
                    setPagination(meta);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                toast.error('Không thể tải danh sách chiến dịch');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [user?.userId, pagination.currentPage, pagination.pageSize]);

    // Filter campaigns based on search and status
    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'ALL' || campaign.campaignStatus === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateCampaign = () => {
        navigate('/campaigns/create');
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-20">
                <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
                            Bảng điều khiển
                        </h1>
                        <p className="text-muted-foreground">
                            Quản lý các chiến dịch gây quỹ của bạn
                        </p>
                    </div>

                    {loading ? (
                        /* Loading State */
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-muted-foreground">Đang tải chiến dịch...</p>
                            </div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-full max-w-md text-center">
                                {/* Illustration/Icon */}
                                <div className="mb-8 flex justify-center">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white dark:bg-darker-2 rounded-full flex items-center justify-center shadow-lg">
                                                <svg
                                                    className="w-12 h-12 text-primary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Decorative line */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-sm"></div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-3">
                                    Bạn chưa có dự án nào
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Bắt đầu tạo dự án của bạn
                                </p>

                                {/* CTA Button */}
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    onClick={handleCreateCampaign}
                                    className="px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    TẠO DỰ ÁN MỚI
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Campaigns Grid */
                        <div>
                            {/* Filters and Search */}
                            <div className="mb-6 space-y-4">
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm chiến dịch..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedStatus('ALL')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedStatus === 'ALL'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white dark:bg-darker-2 text-text-primary dark:text-white border-border hover:border-primary/50'
                                            }`}
                                    >
                                        Tất cả ({campaigns.length})
                                    </button>
                                    {Object.entries(campaignStatuses).map(([status, label]) => {
                                        const count = campaigns.filter(c => c.campaignStatus === status).length;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => setSelectedStatus(status)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedStatus === status
                                                        ? getStatusColor(status)
                                                        : 'bg-white dark:bg-darker-2 text-text-primary dark:text-white border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {label.split(' – ')[0]} ({count})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Create New Campaign Button */}
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                                    Chiến dịch của bạn ({pagination.totalElements})
                                </h2>
                                <Button
                                    variant="gradient"
                                    onClick={handleCreateCampaign}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Tạo chiến dịch mới
                                </Button>
                            </div>

                            {/* Campaigns List (horizontal items) */}
                            <div className="space-y-6 mb-8">
                                {filteredCampaigns.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">
                                            {searchTerm || selectedStatus !== 'ALL'
                                                ? 'Không tìm thấy chiến dịch nào phù hợp'
                                                : 'Chưa có chiến dịch nào'}
                                        </p>
                                    </div>
                                ) : (
                                    filteredCampaigns.map((campaign) => (
                                        <CampaignDashboardItem
                                            key={campaign.campaignId}
                                            campaign={campaign}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevious}
                                        className="flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Trước
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(pagination.totalPages)].map((_, index) => {
                                            const page = index + 1;
                                            // Show first, last, current, and adjacent pages
                                            if (
                                                page === 1 ||
                                                page === pagination.totalPages ||
                                                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === pagination.currentPage
                                                            ? 'bg-primary text-white'
                                                            : 'bg-white dark:bg-darker-2 text-text-primary dark:text-white hover:bg-primary/10'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === pagination.currentPage - 2 ||
                                                page === pagination.currentPage + 2
                                            ) {
                                                return <span key={page} className="text-muted-foreground">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNext}
                                        className="flex items-center gap-2"
                                    >
                                        Sau
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
