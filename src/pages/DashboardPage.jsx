import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

/**
 * DashboardPage - User's dashboard showing their campaigns
 */
export default function DashboardPage() {
    const navigate = useNavigate();

    // Mock campaigns data - empty for now to show empty state
    const campaigns = [];
    // const campaigns = [
    //   {
    //     id: '1',
    //     title: 'Papercuts: A Party Game',
    //     status: 'draft',
    //     image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&h=400&fit=crop',
    //     pledged: 0,
    //     goal: 50000,
    //     backers: 0,
    //     daysLeft: 30,
    //   },
    // ];

    const handleCreateCampaign = () => {
        navigate('/campaigns/create');
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

                    {campaigns.length === 0 ? (
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
                                    className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    TẠO DỰ ÁN MỚI
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Campaigns Grid */
                        <div>
                            {/* Create New Campaign Button */}
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                                    Chiến dịch của bạn ({campaigns.length})
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

                            {/* Campaigns Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {campaigns.map((campaign) => (
                                    <Link
                                        key={campaign.id}
                                        to={`/campaigns/${campaign.id}/edit`}
                                        className="group bg-white dark:bg-darker-2 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Campaign Image */}
                                        <div className="aspect-video overflow-hidden bg-muted">
                                            <img
                                                src={campaign.image}
                                                alt={campaign.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Campaign Info */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2 line-clamp-2">
                                                {campaign.title}
                                            </h3>

                                            {/* Status Badge */}
                                            <div className="mb-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${campaign.status === 'active'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : campaign.status === 'draft'
                                                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {campaign.status === 'active' ? 'Đang chạy' : campaign.status === 'draft' ? 'Nháp' : 'Đã kết thúc'}
                                                </span>
                                            </div>

                                            {/* Stats */}
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex justify-between">
                                                    <span>Đã huy động:</span>
                                                    <span className="font-semibold text-text-primary dark:text-white">
                                                        ${campaign.pledged.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Mục tiêu:</span>
                                                    <span className="font-semibold text-text-primary dark:text-white">
                                                        ${campaign.goal.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Nhà tài trợ:</span>
                                                    <span className="font-semibold text-text-primary dark:text-white">
                                                        {campaign.backers}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Còn lại:</span>
                                                    <span className="font-semibold text-text-primary dark:text-white">
                                                        {campaign.daysLeft} ngày
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
